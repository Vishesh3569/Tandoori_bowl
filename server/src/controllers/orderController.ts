import { Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Order } from "../models/Order";
import { MenuItem } from "../models/MenuItem";

// Helper to guarantee fresh, trimmed environment variables are read at call time
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay Key ID or Key Secret is missing from environment variables."
    );
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// 1. Create Pre-Order
export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const isPaymentEnabled =
      process.env.ENABLE_PAYMENT_GATEWAY?.toLowerCase() === "yes";

    const { items, deliverySlot } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Cart cannot be empty." });
      return;
    }

    const itemIds = items.map((i: { menuItemId: string }) => i.menuItemId);
    const dbItems = await MenuItem.find({ _id: { $in: itemIds } });

    let subtotal = 0;
    const verifiedOrderItems = items.map(
      (item: { menuItemId: string; quantity: number }) => {
        const match = dbItems.find((d) => d._id.toString() === item.menuItemId);
        if (!match) throw new Error("Invalid menu item in cart.");
        subtotal += match.price * item.quantity;
        return {
          menuItem: match._id,
          name: match.name,
          price: match.price,
          quantity: item.quantity,
        };
      }
    );

    // === BYPASS / SIMULATION MODE (ENABLE_PAYMENT_GATEWAY=no) ===
    if (!isPaymentEnabled) {
      const simulatedOrder = await Order.create({
        user: req.userId,
        phone: req.phone,
        items: verifiedOrderItems,
        subtotal,
        deliverySlot,
        status: "confirmed",
        paymentStatus: "paid",
      });

      res.status(201).json({
        success: true,
        bypassPayment: true,
        message: "Payment simulation mode active: Pre-order placed successfully!",
        order: simulatedOrder,
      });
      return;
    }

    // === REAL RAZORPAY GATEWAY MODE (ENABLE_PAYMENT_GATEWAY=yes) ===
    const razorpay = getRazorpayInstance();

    const newOrder = await Order.create({
      user: req.userId,
      phone: req.phone,
      items: verifiedOrderItems,
      subtotal,
      deliverySlot,
      status: "pending",
      paymentStatus: "pending",
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(subtotal * 100),
      currency: "INR",
      receipt: `tb_${newOrder._id}`,
      notes: {
        orderId: (newOrder._id as any).toString(),
        phone: req.phone || "",
      },
    });

    res.status(201).json({
      success: true,
      bypassPayment: false,
      order: newOrder,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({
      message: "Failed to initiate payment",
      error: (error as Error).message,
    });
  }
};

// 2. Verify Razorpay Payment Signature
export const verifyPayment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      res.status(400).json({
        success: false,
        message: "Payment verification failed: Signature mismatch.",
      });
      return;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: "paid", status: "confirmed" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment verified successfully!",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment verification error",
      error: (error as Error).message,
    });
  }
};

// 3. Fetch past orders for logged in customer
export const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch past orders",
      error: (error as Error).message,
    });
  }
};