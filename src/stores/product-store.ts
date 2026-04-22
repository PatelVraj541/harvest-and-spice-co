import { create } from "zustand";
import type { ProductFilters } from "@/types/product";

interface ProductState {
  filters: ProductFilters;
  searchQuery: string;

  setFilters: (filters: Partial<ProductFilters>) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const defaultFilters: ProductFilters = {
  sortBy: "newest",
  inSeason: false,
};

export const useProductStore = create<ProductState>((set) => ({
  filters: defaultFilters,
  searchQuery: "",

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSearchQuery: (searchQuery) =>
    set({ searchQuery }),

  resetFilters: () =>
    set({ filters: defaultFilters, searchQuery: "" }),
}));
