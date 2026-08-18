export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  image: string | null;
  is_active: boolean;
  display_order: number;
  seo_title: string;
  seo_description: string;
  product_count: number;
}

export interface BackendVariant {
  id: string;
  sku: string;
  label: string;
  weight_grams: number;
  dimensions: string;
  price: string;
  mrp: string;
  is_default: boolean;
  is_active: boolean;
  display_order: number;
  savings_amount: string;
  savings_percent: number;
  available_quantity: number;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
}

export interface BackendPriceRange {
  min_price: number;
  max_price: number;
  min_mrp: number;
}

export interface BackendProductListItem {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  category: string | null;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_launch: boolean;
  average_rating: string;
  review_count: number;
  primary_image: string | null;
  price_range: BackendPriceRange | null;
  default_variant: BackendVariant | null;
  status: string;
}

export interface BackendProductImage {
  id: string;
  variant: string | null;
  image: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
}

export interface BackendProductDetail extends Omit<BackendProductListItem, "category"> {
  description: string;
  category: BackendCategory | null;
  source: string;
  ingredients: string;
  preparation: string;
  aroma_texture: string;
  culinary_uses: string;
  storage_instructions: string;
  shelf_life: string;
  allergens: string;
  nutrition_info: Record<string, string | number>;
  certifications: string[];
  seo_title: string;
  seo_description: string;
  variants: BackendVariant[];
  images: BackendProductImage[];
  videos: { id: string; video: string | null; video_url: string; thumbnail: string | null; title: string; display_order: number }[];
  related_products: BackendProductListItem[];
}

export interface PaginatedResponse<T> {
  count: number;
  num_pages: number;
  current_page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ProductListParams {
  category?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  in_stock?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  new_launch?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
