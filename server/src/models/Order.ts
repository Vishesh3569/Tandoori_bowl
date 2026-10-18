import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  menuItem: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  phone: string;
  items: IOrderItem[];
  subtotal: number;
  deliverySlot: string; // e.g., "Today 12:30 PM - 01:00 PM"
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    phone: { type: String, required: true },
    items: [
      {
        menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    subtotal: { type: Number, required: true },
    deliverySlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", OrderSchema);