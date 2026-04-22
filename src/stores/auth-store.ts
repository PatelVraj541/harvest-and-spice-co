import { create } from "zustand";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthState {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: { id: string; email: string } | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  setProfile: (profile) =>
    set({ profile }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  reset: () =>
    set({
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    }),
}));
