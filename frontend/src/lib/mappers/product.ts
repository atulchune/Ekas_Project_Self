import {
  BackendProductDetail,
  BackendProductListItem,
  BackendVariant,
} from "@/lib/api/types";

export interface ProductVariantVM {
  id: string;
  label: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockStatus: BackendVariant["stock_status"];
  isDefault: boolean;
}

export interface ProductCardVM {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  image: string | null;
  hoverImage: string | null;
  badge?: string;
  rating: number;
  reviewCount: number;
  price: number | null;
  originalPrice?: number;
  defaultVariantId: string | null;
  defaultVariantLabel: string | null;
  inStock: boolean;
}

export interface ProductDetailVM {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  categoryName: string | null;
  categorySlug: string | null;
  gallery: string[];
  rating: number;
  reviewCount: number;
  badge?: string;
  variants: ProductVariantVM[];
  features: string[];
  usage: string;
  nutrition: { label: string; value: string }[];
  ingredients: string;
  storageInstructions: string;
  shelfLife: string;
  allergens: string;
  relatedProducts: ProductCardVM[];
}

function deriveBadge(p: Pick<BackendProductListItem, "is_bestseller" | "is_new_launch" | "is_featured">): string | undefined {
  if (p.is_bestseller) return "Best Seller";
  if (p.is_new_launch) return "New";
  if (p.is_featured) return "Featured";
  return undefined;
}

export function mapVariant(v: BackendVariant): ProductVariantVM {
  const price = Number(v.price);
  const mrp = Number(v.mrp);
  return {
    id: v.id,
    label: v.label,
    price,
    originalPrice: mrp > price ? mrp : undefined,
    inStock: v.stock_status !== "out_of_stock",
    stockStatus: v.stock_status,
    isDefault: v.is_default,
  };
}

export function mapListItemToCard(p: BackendProductListItem): ProductCardVM {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDescription: p.short_description,
    image: p.primary_image,
    hoverImage: p.primary_image,
    badge: deriveBadge(p),
    rating: Number(p.average_rating) || 0,
    reviewCount: p.review_count,
    price: p.price_range ? p.price_range.min_price : p.default_variant ? Number(p.default_variant.price) : null,
    originalPrice: p.price_range && p.price_range.min_mrp > p.price_range.min_price ? p.price_range.min_mrp : undefined,
    defaultVariantId: p.default_variant?.id ?? null,
    defaultVariantLabel: p.default_variant?.label ?? null,
    inStock: p.default_variant ? p.default_variant.stock_status !== "out_of_stock" : true,
  };
}

export function mapDetailToViewModel(p: BackendProductDetail): ProductDetailVM {
  const sortedImages = [...p.images].sort((a, b) => a.display_order - b.display_order);
  const gallery = sortedImages.length ? sortedImages.map((i) => i.image) : [];
  const variants = [...p.variants]
    .filter((v) => v.is_active)
    .sort((a, b) => a.display_order - b.display_order)
    .map(mapVariant);

  const nutrition = Object.entries(p.nutrition_info ?? {}).map(([label, value]) => ({
    label,
    value: String(value),
  }));

  const features = [...p.certifications];
  if (p.aroma_texture) features.push(p.aroma_texture);

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    shortDescription: p.short_description,
    categoryName: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
    gallery,
    rating: Number(p.average_rating) || 0,
    reviewCount: p.review_count,
    badge: deriveBadge(p),
    variants,
    features,
    usage: p.culinary_uses || p.preparation || "",
    nutrition,
    ingredients: p.ingredients,
    storageInstructions: p.storage_instructions,
    shelfLife: p.shelf_life,
    allergens: p.allergens,
    relatedProducts: p.related_products.map(mapListItemToCard),
  };
}
