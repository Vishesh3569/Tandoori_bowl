import { create } from "zustand";
import { CartItem, MenuItem } from "../types";

interface CartStore {
  isOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: MenuItem, openDrawer?: boolean) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  isOpen: false,
  items: [],

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (item: MenuItem, openDrawer: boolean = false) => {
    const { items } = get();
    const existingIndex = items.findIndex((i) => i.menuItem._id === item._id);

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      set({ items: updated, isOpen: openDrawer ? true : get().isOpen });
    } else {
      set({
        items: [...items, { menuItem: item, quantity: 1 }],
        isOpen: openDrawer ? true : get().isOpen,
      });
    }
  },

  removeItem: (itemId: string) => {
    set({ items: get().items.filter((i) => i.menuItem._id !== itemId) });
  },

  updateQuantity: (itemId: string, delta: number) => {
    const { items } = get();
    const updated = items
      .map((item) => {
        if (item.menuItem._id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    set({ items: updated });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => get().items.reduce((acc, curr) => acc + curr.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0),
}));