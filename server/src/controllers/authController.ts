import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import { User } from "../models/User";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const isSmsEnabled = process.env.ENABLE_SMS_OTP?.toLowerCase() === "yes";
const twilioClient =
  isSmsEnabled && accountSid && authToken
    ? twilio(accountSid, authToken)
    : null;

const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const requestOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      res.status(400).json({ message: "Please provide a valid 10-digit Indian phone number." });
      return;
    }

    let user = await User.findOne({ phone });

    // === BYPASS MODE (ENABLE_SMS_OTP=no) ===
    if (!isSmsEnabled) {
      if (!user) {
        user = new User({ phone, isVerified: true });
        await user.save();
      }

      const token = jwt.sign(
        { userId: user._id, phone: user.phone },
        process.env.JWT_SECRET || "tandoori_bowl_super_secret_jwt_key_2026",
        { expiresIn: "14d" }
      );

      res.status(200).json({
        success: true,
        bypassOtp: true,
        message: "SMS OTP disabled in environment: logged in directly.",
        token,
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
        },
      });
      return;
    }

    // === REAL SMS OTP MODE (ENABLE_SMS_OTP=yes) ===
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    if (!user) {
      user = new User({ phone, otpCode, otpExpiresAt });
    } else {
      user.otpCode = otpCode;
      user.otpExpiresAt = otpExpiresAt;
    }
    await user.save();

    if (twilioClient && twilioNumber) {
      const formattedPhone = `+91${phone}`;
      await twilioClient.messages.create({
        body: `Your Tandoori Bowl verification code is: ${otpCode}. Valid for 5 minutes.`,
        from: twilioNumber,
        to: formattedPhone,
      });
      console.log(`[Twilio SMS Sent to ${formattedPhone}]`);
    } else {
      console.warn(`[SMS Mode Active but credentials missing] OTP: ${otpCode}`);
    }

    res.status(200).json({
      success: true,
      bypassOtp: false,
      message: `OTP sent to +91 ${phone}`,
      debugOtp: process.env.NODE_ENV === "development" ? otpCode : undefined,
    });
  } catch (error) {
    console.error("Auth Request Error:", error);
    res.status(500).json({ message: "Authentication request failed", error: (error as Error).message });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp, name } = req.body;

    const user = await User.findOne({ phone });

    if (!user || !user.otpCode || !user.otpExpiresAt) {
      res.status(400).json({ message: "No active OTP request found for this number." });
      return;
    }

    if (new Date() > user.otpExpiresAt) {
      res.status(400).json({ message: "OTP has expired. Please request a new one." });
      return;
    }

    if (user.otpCode !== otp) {
      res.status(400).json({ message: "Invalid OTP code entered." });
      return;
    }

    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    user.isVerified = true;
    if (name) user.name = name;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET || "tandoori_bowl_super_secret_jwt_key_2026",
      { expiresIn: "14d" }
    );

    res.status(200).json({
      success: true,
      message: "Phone verified successfully",
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error: (error as Error).message });
  }
};