import type { Database } from "./database";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type SeasonalRule = Database["public"]["Tables"]["product_seasonal_rules"]["Row"];

export interface ProductWithDetails extends Product {
  category_name: string;
  category_slug: string;
  category_type: "spice" | "fruit";
  variants: ProductVariant[];
  images: ProductImage[];
  seasonal_rules: SeasonalRule[];
}

export interface ProductFilters {
  category?: string;
  type?: "spice" | "fruit";
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "name-asc" | "newest";
  inSeason?: boolean;
}
