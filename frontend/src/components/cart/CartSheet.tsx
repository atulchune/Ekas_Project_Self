"use client";

import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Tag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Mirrors backend/.env's FREE_SHIPPING_THRESHOLD default — cosmetic progress-bar
// estimate only. The authoritative figure is computed server-side at checkout.
const FREE_SHIPPING_ESTIMATE = 999;

export function CartSheet() {
    const { isOpen, closeCart, items, removeItem, updateQuantity, pricing, applyCoupon, couponCode, couponError } = useCart();
    const [couponInput, setCouponInput] = useState("");
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const subtotal = pricing?.subtotal ?? 0;
    const discount = pricing?.discount_total ?? 0;
    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_ESTIMATE - subtotal);
    const progressPercentage = Math.min(100, (subtotal / FREE_SHIPPING_ESTIMATE) * 100);

    const handleApply = async () => {
        if (!couponInput.trim()) return;
        setApplying(true);
        await applyCoupon(couponInput.trim());
        setApplying(false);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={closeCart}
            />

            {/* Sheet */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#F9F6F0] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-[#2D5C35]/10",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2D5C35]/10 rounded-full flex items-center justify-center text-[#2D5C35]">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold font-serif text-[#1F2937]">Your Cart</h2>
                        <span className="bg-[#2D5C35] text-white text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Free Shipping Progress */}
                {items.length > 0 && (
                    <div className="bg-[#2D5C35] p-4 text-white">
                        {remainingForFreeShipping > 0 ? (
                            <p className="text-xs font-bold mb-2 flex items-center gap-2">
                                <Truck className="w-4 h-4" />
                                Add <span className="text-[#D9A528]">₹{remainingForFreeShipping}</span> more for FREE Shipping
                            </p>
                        ) : (
                            <p className="text-xs font-bold mb-2 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-[#D9A528]" />
                                You&apos;ve unlocked <span className="text-[#D9A528]">FREE Shipping!</span>
                            </p>
                        )}
                        <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#D9A528] rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Your cart is empty</h3>
                            <button onClick={closeCart} className="text-[#2D5C35] font-bold text-sm hover:underline">
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative group hover:border-[#2D5C35]/30 transition-colors">
                                <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-300">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm text-[#1F2937] line-clamp-2 pr-6">{item.productName}</h4>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors absolute top-4 right-4"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-[#2D5C35] font-bold mb-3">{item.variantLabel}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#2D5C35] text-xs font-bold disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-4 text-center text-xs font-bold text-[#1F2937]">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-[#2D5C35] text-xs font-bold"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-[#1F2937]">₹{item.lineTotal}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        {/* Coupon Code Section */}
                        <div className="mb-4">
                            {!couponCode ? (
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2D5C35] transition-colors"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={handleApply}
                                        className="px-4 py-2 bg-[#1F2937] text-white text-sm font-bold rounded-lg hover:bg-[#2D5C35] transition-colors disabled:opacity-50"
                                        disabled={!couponInput || applying}
                                    >
                                        Apply
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-green-50 border border-green-100 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-bold text-green-700">Code &apos;{couponCode}&apos; applied!</span>
                                    </div>
                                    <button
                                        onClick={() => applyCoupon("")}
                                        className="text-xs font-bold text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                            {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
                        </div>

                        <div className="space-y-2 mb-6 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-bold text-[#1F2937]">₹{subtotal}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span className="font-bold">-₹{discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-[#1F2937] pt-4 border-t border-dashed border-gray-200">
                                <span>Estimated Total</span>
                                <span>₹{subtotal - discount}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full bg-[#2D5C35] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#234a2b] shadow-lg shadow-green-900/20 transition-all group"
                        >
                            Checkout Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
