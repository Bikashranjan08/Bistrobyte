"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { menuData } from "@/lib/menuData";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

import AddressModal from "@/components/AddressModal";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, addToCart } = useCart();
    const { isAuthenticated, openModal, user, updateProfile } = useAuth();

    // Get some suggested items (e.g., from Starters or Desserts)
    const suggestions = [
        ...menuData.find(c => c.id === "starters")?.items.slice(0, 2) || [],
        ...menuData.find(c => c.id === "desserts")?.items.slice(0, 2) || []
    ];

    const [isOrdering, setIsOrdering] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const router = useRouter();

    const handleCheckoutInit = () => {
        if (!isAuthenticated) {
            openModal();
            return;
        }

        // If user already has full address, proceed (or show confirmation? let's just show modal if missing)
        // Check if user has phone and address
        if (!user?.phone || !user?.address?.street) {
            setShowAddressModal(true);
        } else {
            // If they have it, just proceed (or we could show the modal pre-filled to confirm)
            // For better UX, let's just proceed if they have it, or show modal to confirm?
            // Prompt: "Fast2SMS for all stuff required".
            // Let's show modal if missing.
            placeOrder(user.address, user.phone);
        }
    };

    const placeOrder = async (address: any, phoneNumber: string) => {
        setIsOrdering(true);
        try {
            const res = await fetch("/api/order/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cartItems,
                    totalAmount: cartTotal + Math.round(cartTotal * 0.05),
                    deliveryAddress: address,
                    phoneNumber: phoneNumber
                }),
            });

            if (res.ok) {
                // Update local profile if it was just added via modal (implicit in context updateProfile if we had one)
                // For now, rely on backend update.
                if (user && (!user.phone || !user.address)) {
                    updateProfile({ phone: phoneNumber, address });
                }

                toast.success("Order placed successfully!");
                router.push("/my-orders");
            } else {
                toast.error("Failed to place order.");
            }
        } catch (error) {
            console.error("Checkout error", error);
            toast.error("Something went wrong.");
        } finally {
            setIsOrdering(false);
            setShowAddressModal(false);
        }
    };

    return (
        <div className="min-h-screen bg-mint-whisper pb-20">
            <AddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSubmit={(data) => {
                    const { phoneNumber, ...address } = data;
                    placeOrder(address, phoneNumber);
                }}
                initialPhone={user?.phone}
                initialAddress={user?.address}
            />
            <div className="pt-20 sm:pt-24 lg:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 lg:gap-12">

                    {/* Left Column: Cart Items & Suggestions */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Cart List */}
                        <div className="bg-white rounded-3xl shadow-sm border border-emerald-green/5 p-6 lg:p-8">
                            <h2 className="text-2xl font-bold text-dark-evergreen mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Order Summary</h2>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingBag size={32} className="text-emerald-green/40" />
                                    </div>
                                    <p className="text-emerald-dark/60 mb-6" style={{ fontFamily: "var(--font-inter)" }}>Your cart is empty.</p>
                                    <Link href="/menu" className="inline-block px-8 py-3 bg-dark-evergreen text-white rounded-full font-medium hover:bg-emerald-green transition-colors">
                                        Start Ordering
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <motion.div
                                            key={item.name}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center gap-4 py-4 border-b border-dashed border-emerald-green/10 last:border-0"
                                        >
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-dark-evergreen truncate" style={{ fontFamily: "var(--font-playfair)" }}>{item.name}</h3>
                                                <p className="text-sm text-emerald-green font-bold">&#8377;{item.price}</p>
                                            </div>

                                            <div className="flex items-center gap-2 sm:gap-3 bg-mint-whisper rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.name, -1)}
                                                    className="w-10 h-10 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-md bg-white text-emerald-dark hover:text-red-500 transition-colors shadow-sm touch-manipulation"
                                                >
                                                    <Minus size={16} className="sm:w-3.5 sm:h-3.5" />
                                                </button>
                                                <span className="text-sm sm:text-sm font-bold w-8 sm:w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.name, 1)}
                                                    className="w-10 h-10 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-md bg-dark-evergreen text-white hover:bg-emerald-green transition-colors shadow-sm touch-manipulation"
                                                >
                                                    <Plus size={16} className="sm:w-3.5 sm:h-3.5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Suggestions */}
                        {cartItems.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-dark-evergreen mb-4 ml-1" style={{ fontFamily: "var(--font-playfair)" }}>Complete your meal</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {suggestions.map((item) => (
                                        <div key={item.name} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-emerald-green/10 shadow-sm hover:shadow-md transition-all">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-dark-evergreen truncate">{item.name}</p>
                                                <p className="text-xs text-emerald-green font-bold">&#8377;{item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="w-10 h-10 min-w-[44px] min-h-[44px] sm:w-8 sm:h-8 sm:min-w-0 sm:min-h-0 rounded-full bg-emerald-green/10 text-emerald-green flex items-center justify-center hover:bg-emerald-green hover:text-white transition-colors touch-manipulation"
                                            >
                                                <Plus size={18} className="sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Auth & Total */}
                    <div className="lg:col-span-5 space-y-8">
                        {cartItems.length > 0 && (
                            <div className="mt-8 bg-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-emerald-green/5 border border-emerald-green/10">
                                <h3 className="text-lg font-bold text-dark-evergreen mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Bill Details</h3>

                                <div className="space-y-3 mb-6 text-sm text-emerald-dark/80" style={{ fontFamily: "var(--font-inter)" }}>
                                    <div className="flex justify-between">
                                        <span>Item Total</span>
                                        <span>&#8377;{cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxes & Charges (5%)</span>
                                        <span>&#8377;{Math.round(cartTotal * 0.05)}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold text-dark-evergreen pt-3 border-t border-emerald-green/10">
                                        <span>To Pay</span>
                                        <span>&#8377;{cartTotal + Math.round(cartTotal * 0.05)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckoutInit}
                                    disabled={isOrdering}
                                    className={`w-full py-4 min-h-[50px] font-bold rounded-xl shadow-lg transition-all transform flex items-center justify-center gap-2 touch-manipulation text-base ${isAuthenticated
                                        ? "bg-dark-evergreen text-white shadow-emerald-green/20 hover:bg-emerald-green hover:-translate-y-1 active:scale-95"
                                        : "bg-royal-amethyst text-white shadow-royal-amethyst/20 hover:bg-purple-600 hover:-translate-y-1 active:scale-95"
                                        }`}
                                >
                                    {isOrdering ? (
                                        <span>Processing...</span>
                                    ) : (
                                        <>
                                            <span>{isAuthenticated ? "Place Order (COD)" : "Login to Place Order"}</span>
                                            {isAuthenticated && <span className="bg-white/20 px-2 py-0.5 rounded text-xs">&#8377;{cartTotal + Math.round(cartTotal * 0.05)}</span>}
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-center text-emerald-dark/40 mt-3">
                                    Currently only Cash on Delivery (COD) is supported.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
