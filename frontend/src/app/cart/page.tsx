"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { items, isLoading, updateQuantity, removeItem, pricing, applyCoupon, couponError } = useCart();
    const router = useRouter();
    const [couponInput, setCouponInput] = useState("");
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const subtotal = pricing?.subtotal ?? 0;
    const discount = pricing?.discount_total ?? 0;

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setApplyingCoupon(true);
        await applyCoupon(couponInput.trim());
        setApplyingCoupon(false);
    };

    if (isLoading) {
        return <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-24 text-center text-gray-400">Loading cart…</div>;
    }

    if (items.length === 0) {
        return (
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-24 text-center">
                <h2 className="text-3xl font-bold font-serif mb-4">Your Cart is Empty</h2>
                <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything yet.</p>
                <Link href="/shop" className="inline-flex items-center px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-12">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-8 text-primary">Your Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map(item => (
                        <div key={item.id} className="flex gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <Link href={`/product/${item.productSlug}`} className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-300">
                                <ShoppingBag className="w-8 h-8" />
                            </Link>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Link href={`/product/${item.productSlug}`} className="font-bold text-lg text-gray-900 hover:text-primary transition-colors">
                                            {item.productName}
                                        </Link>
                                        <p className="text-sm text-gray-500">{item.variantLabel}{item.bundleName ? ` · ${item.bundleName}` : ""}</p>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 transition-colors"><Minus className="w-4 h-4" /></button>
                                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors"><Plus className="w-4 h-4" /></button>
                                    </div>
                                    <p className="font-bold text-lg text-primary">₹{item.lineTotal}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg sticky top-24">
                        <h3 className="font-bold text-xl mb-6 font-serif">Order Summary</h3>

                        <div className="flex gap-2 mb-6">
                            <input
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                placeholder="Coupon code"
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <button
                                onClick={handleApplyCoupon}
                                disabled={applyingCoupon}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
                            >
                                Apply
                            </button>
                        </div>
                        {couponError && <p className="text-xs text-red-500 -mt-4 mb-4">{couponError}</p>}

                        <div className="space-y-4 mb-6 border-b border-gray-100 pb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>Discount</span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between text-xl font-bold mb-2">
                            <span>Estimated Total</span>
                            <span>₹{subtotal - discount}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-8">Shipping & tax calculated at checkout.</p>

                        <button
                            onClick={() => router.push("/checkout")}
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mb-4"
                        >
                            Checkout <ArrowRight className="w-5 h-5" />
                        </button>
                        <Link href="/shop" className="block text-center text-sm text-gray-500 font-medium hover:text-primary transition-colors">
                            Continue Shopping
                        </Link>

                        <div className="mt-8 flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-500">
                                Secure checkout. We use SSL encryption to keep your data safe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
