"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/products';

export interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
    selectedPrice: number;
    cartItemId: string; // unique id for size variant
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (product: Product, quantity: number, size: string, price: number) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, newQuantity: number) => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Load cart from local storage if needed in future
    }, []);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const addItem = (product: Product, quantity: number, size: string, price: number) => {
        const cartItemId = `${product.id}-${size}`;

        setItems(prev => {
            const existing = prev.find(item => item.cartItemId === cartItemId);
            if (existing) {
                return prev.map(item =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity, selectedSize: size, selectedPrice: price, cartItemId }];
        });
        setIsOpen(true);
    };

    const removeItem = (cartItemId: string) => {
        setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setItems(prev => prev.map(item =>
            item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const cartTotal = items.reduce((total, item) => total + (item.selectedPrice * item.quantity), 0);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            isOpen,
            openCart,
            closeCart,
            addItem,
            removeItem,
            updateQuantity,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
