export type CategoryType = "all" | "drip_roll" | "burger" | "fries" | "dips";

export interface MenuItem {
  _id: string;
  name: string;
  category: "drip_roll" | "burger" | "fries" | "dips" | "beverages";
  price: number;
  description: string;
  tagline?: string;
  badge?: string;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface UserProfile {
  id: string;
  phone: string;
  name?: string;
}

export interface PreorderStatus {
  isOpen: boolean;
  message: string;
  nextOpenTimeText: string;
}