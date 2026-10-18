import { Schema, model, Document } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  category: "drip_roll" | "burger" | "fries" | "dips" | "beverages";
  price: number;
  description: string;
  tagline?: string;
  badge?: string; // e.g., "CREAMY RICH", "MOST POPULAR", "THE OG"
  imageUrl: string; // Transparent cutout image for 3D pop-out effect
  isVeg: boolean;
  isAvailable: boolean;
  createdAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["drip_roll", "burger", "fries", "dips", "beverages"],
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    tagline: { type: String },
    badge: { type: String },
    imageUrl: { type: String, required: true },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MenuItem = model<IMenuItem>("MenuItem", MenuItemSchema);