export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["addresses"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          type: "spice" | "fruit";
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          origin: string | null;
          nutrition_info: Record<string, unknown> | null;
          tags: string[] | null;
          is_active: boolean;
          is_seasonal: boolean;
          is_subscribable: boolean;
          primary_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          label: string;
          weight_grams: number | null;
          unit: "g" | "kg" | "piece" | "dozen" | "box";
          price_cents: number;
          compare_at_price_cents: number | null;
          stock_quantity: number;
          sku: string;
          is_active: boolean;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["product_variants"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["product_images"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["product_images"]["Insert"]>;
      };
      product_seasonal_rules: {
        Row: {
          id: string;
          product_id: string;
          available_from_month: number;
          available_to_month: number;
          available_from_day: number | null;
          available_to_day: number | null;
          label: string;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["product_seasonal_rules"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["product_seasonal_rules"]["Insert"]>;
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          variant_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["cart_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["cart_items"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: string;
          subtotal_cents: number;
          shipping_cents: number;
          tax_cents: number;
          total_cents: number;
          shipping_address: Record<string, unknown>;
          stripe_payment_intent_id: string | null;
          stripe_checkout_session_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string;
          product_name: string;
          variant_label: string;
          quantity: number;
          unit_price_cents: number;
          total_cents: number;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      subscription_plans: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          interval: "month" | "quarter";
          interval_count: number;
          price_cents: number;
          stripe_price_id: string | null;
          is_active: boolean;
          image_url: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["subscription_plans"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["subscription_plans"]["Insert"]>;
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: "active" | "paused" | "cancelled" | "past_due";
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_subscriptions"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["user_subscriptions"]["Insert"]>;
      };
    };
  };
}
