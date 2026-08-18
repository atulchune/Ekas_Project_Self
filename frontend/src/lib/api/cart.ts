import { clientFetch } from "./clientFetch";
import { BackendVariant } from "./types";

export interface BackendCartPricing {
  subtotal: number;
  discount_total: number;
  applied_rules: { type: string; name: string; amount: number }[];
  free_shipping: boolean;
  coupon?: { code: string } | null;
}

export interface BackendCartItem {
  id: string;
  variant: BackendVariant;
  bundle: string | null;
  bundle_name: string | null;
  product_name: string;
  product_slug: string;
  quantity: number;
  line_total: number;
  created_at: string;
}

export interface BackendCart {
  id: string;
  coupon_code: string | null;
  items: BackendCartItem[];
  item_count: number;
  pricing: BackendCartPricing;
}

export function getCart(): Promise<BackendCart> {
  return clientFetch<BackendCart>("/cart");
}

export function addCartItem(variantId: string, quantity = 1, bundleId?: string): Promise<BackendCart> {
  return clientFetch<BackendCart>("/cart", {
    method: "POST",
    body: JSON.stringify({ variant_id: variantId, quantity, ...(bundleId ? { bundle_id: bundleId } : {}) }),
  });
}

export function updateCartItem(itemId: string, quantity: number): Promise<BackendCart> {
  return clientFetch<BackendCart>(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: string): Promise<BackendCart> {
  return clientFetch<BackendCart>(`/cart/items/${itemId}`, { method: "DELETE" });
}

export function clearCart(): Promise<BackendCart> {
  return clientFetch<BackendCart>("/cart", { method: "DELETE" });
}

export function applyCoupon(code: string): Promise<BackendCart> {
  return clientFetch<BackendCart>("/cart/apply-coupon", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}
