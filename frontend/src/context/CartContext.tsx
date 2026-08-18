"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { addCartItem, applyCoupon as applyCouponApi, BackendCart, BackendCartPricing, getCart, removeCartItem, updateCartItem } from "@/lib/api/cart";
import { ApiError } from "@/lib/api/config";

export interface CartItemVM {
  id: string;
  variantId: string;
  productName: string;
  productSlug: string;
  bundleName: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  variantLabel: string;
  image: string | null;
}

function mapCart(cart: BackendCart): CartItemVM[] {
  return cart.items.map((item) => ({
    id: item.id,
    variantId: item.variant.id,
    productName: item.product_name,
    productSlug: item.product_slug,
    bundleName: item.bundle_name,
    quantity: item.quantity,
    unitPrice: Number(item.variant.price),
    lineTotal: item.line_total,
    variantLabel: item.variant.label,
    image: null,
  }));
}

interface CartContextType {
  items: CartItemVM[];
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  pricing: BackendCartPricing | null;
  couponCode: string | null;
  couponError: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemVM[]>([]);
  const [pricing, setPricing] = useState<BackendCartPricing | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const applyCartResponse = (cart: BackendCart) => {
    setItems(mapCart(cart));
    setPricing(cart.pricing);
    setCouponCode(cart.coupon_code);
  };

  const refreshCart = useCallback(async () => {
    try {
      const cart = await getCart();
      applyCartResponse(cart);
    } catch {
      // Cart is guest-friendly (AllowAny) — a failure here means the API is
      // unreachable, not that the user is unauthenticated. Leave state as-is.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (variantId: string, quantity = 1) => {
    const cart = await addCartItem(variantId, quantity);
    applyCartResponse(cart);
    setIsOpen(true);
  };

  const removeItem = async (itemId: string) => {
    const cart = await removeCartItem(itemId);
    applyCartResponse(cart);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
      return;
    }
    const cart = await updateCartItem(itemId, newQuantity);
    applyCartResponse(cart);
  };

  const applyCoupon = async (code: string) => {
    setCouponError(null);
    try {
      const cart = await applyCouponApi(code);
      applyCartResponse(cart);
    } catch (err) {
      setCouponError(err instanceof ApiError ? err.message : "Could not apply coupon");
    }
  };

  const cartTotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        refreshCart,
        cartTotal,
        cartCount,
        pricing,
        couponCode,
        couponError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
