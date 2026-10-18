import { create } from "zustand";
import { UserProfile } from "../types";

interface AuthStore {
  user: UserProfile | null;
  token: string | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("tb_token") : null,
  isAuthModalOpen: false,

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  login: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tb_token", token);
    }
    set({ user, token, isAuthModalOpen: false });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tb_token");
    }
    set({ user: null, token: null });
  },
}));