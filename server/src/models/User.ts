import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  phone: string;
  name?: string;
  otpCode?: string;
  otpExpiresAt?: Date;
  isVerified: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true },
    otpCode: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);