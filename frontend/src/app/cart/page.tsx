"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Wood Pressed Groundnut Oil",
            price: 450,
            image: "/images/hero.png",
            quantity: 2,
            size: "1 Litre"
        },
        {
            id: 2,
            name: "Organic Flax Seeds",
            price: 380,
            image: "/images/cat-seeds.png",
            quantity: 1,
            size: "250g"
        }
    ]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 999 ? 0 : 50;
    const total = subtotal + shipping;

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    if (cartItems.length === 0) {
        return (
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-24 text-center">
                <h2 className="text-3xl font-bold font-serif mb-4">Your Cart is Empty</h2>
                <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
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
                    {cartItems.map(item => (
                        <div key={item.id} className="flex gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.size}</p>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-100 transition-colors"><Minus className="w-4 h-4" /></button>
                                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-100 transition-colors"><Plus className="w-4 h-4" /></button>
                                    </div>
                                    <p className="font-bold text-lg text-primary">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg sticky top-24">
                        <h3 className="font-bold text-xl mb-6 font-serif">Order Summary</h3>

                        <div className="space-y-4 mb-6 border-b border-gray-100 pb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? <span className="text-green-600 font-bold">Free</span> : `₹${shipping}`}</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-xl font-bold mb-8">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>

                        <button className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-green-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mb-4">
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
