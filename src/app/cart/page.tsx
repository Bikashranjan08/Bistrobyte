"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Store, CreditCard, Wallet, Banknote, Smartphone, Check } from "lucide-react";

import AddressModal from "@/components/AddressModal";

type PaymentMethod = 'cod' | 'upi' | 'card' | 'wallet';

interface PaymentOption {
    id: PaymentMethod;
    name: string;
    icon: React.ReactNode;
    description: string;
    disabled?: boolean;
}

const paymentOptions: PaymentOption[] = [
    { id: 'upi', name: 'UPI', icon: <Smartphone size={20} />, description: 'Pay using any UPI app', disabled: false },
    { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard size={20} />, description: 'Visa, Mastercard, RuPay', disabled: false },
    { id: 'wallet', name: 'Wallets', icon: <Wallet size={20} />, description: 'Paytm, PhonePe, Amazon Pay', disabled: false },
    { id: 'cod', name: 'Cash on Delivery', icon: <Banknote size={20} />, description: 'Pay when you receive', disabled: false },
];

// Calculate dynamic delivery charge
const calculateDeliveryCharge = (cartTotal: number): number => {
    const baseCharge = 40;
    const variance = Math.floor(Math.random() * 21); // 0-20
    const peakHourMultiplier = 1.0; // Can be adjusted based on time
    return Math.round((baseCharge + variance) * peakHourMultiplier);
};

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, getCartItemsByRestaurant, clearCart } = useCart();
    const { isSignedIn: isAuthenticated, user } = useUser();
    const { openSignIn: openModal } = useClerk();

    const [isOrdering, setIsOrdering] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cod');
    const [deliveryCharge, setDeliveryCharge] = useState(40);
    const router = useRouter();

    const itemsByRestaurant = getCartItemsByRestaurant();
    const restaurantCount = Object.keys(itemsByRestaurant).length;
    const taxAmount = Math.round(cartTotal * 0.05);
    const totalAmount = cartTotal + taxAmount + (deliveryCharge * restaurantCount);

    // Calculate delivery charge when cart changes
    useEffect(() => {
        if (cartTotal > 0) {
            setDeliveryCharge(calculateDeliveryCharge(cartTotal));
        }
    }, [cartTotal]);

    const handleCheckoutInit = () => {
        if (!isAuthenticated) {
            openModal();
            return;
        }

        // If user already has full address, proceed
        const phone = user?.unsafeMetadata?.phone as string | undefined;
        const address = user?.unsafeMetadata?.address as any;

        if (!phone || !address?.street) {
            setShowAddressModal(true);
        } else {
            placeOrder(address, phone);
        }
    };

    // Load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Initiate Razorpay payment
    const initiateRazorpayPayment = async (address: any, phoneNumber: string) => {
        const res = await loadRazorpayScript();
        if (!res) {
            toast.error('Razorpay SDK failed to load');
            return;
        }

        // Create order on server
        const orderRes = await fetch('/api/payment/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: totalAmount,
                receipt: `receipt_${Date.now()}`,
            }),
        });

        const orderData = await orderRes.json();

        if (!orderData.success) {
            toast.error('Failed to create payment order');
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'BistroByte',
            description: 'Food Order Payment',
            order_id: orderData.orderId,
            handler: async function (response: any) {
                // Verify payment
                const verifyRes = await fetch('/api/payment/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    }),
                });

                const verifyData = await verifyRes.json();

                if (verifyData.success) {
                    // Place orders after successful payment
                    await placeOrdersAfterPayment(address, phoneNumber, response.razorpay_payment_id);
                } else {
                    toast.error('Payment verification failed');
                }
            },
            prefill: {
                name: user?.fullName || '',
                email: user?.primaryEmailAddress?.emailAddress || '',
                contact: phoneNumber,
            },
            theme: {
                color: '#10B981',
            },
            modal: {
                ondismiss: function() {
                    setIsOrdering(false);
                    toast.error('Payment cancelled');
                }
            }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
    };

    // Place orders after successful payment
    const placeOrdersAfterPayment = async (address: any, phoneNumber: string, paymentId: string) => {
        try {
            const restaurantIds = Object.keys(itemsByRestaurant);
            const orderPromises = restaurantIds.map(async (restaurantId) => {
                const items = itemsByRestaurant[restaurantId];
                const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const tax = Math.round(subtotal * 0.05);
                const totalWithCharges = subtotal + tax + deliveryCharge;
                
                const res = await fetch("/api/order/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        items,
                        totalAmount: totalWithCharges,
                        deliveryAddress: address,
                        phoneNumber: phoneNumber,
                        restaurantId,
                        paymentMethod: selectedPayment.toUpperCase(),
                        paymentId: paymentId,
                        paymentStatus: 'Paid'
                    }),
                });
                return res;
            });

            const results = await Promise.all(orderPromises);
            const allSuccessful = results.every(res => res.ok);

            if (allSuccessful) {
                toast.success("Payment successful! Orders placed.");
                clearCart();
                router.push(`/my-orders`);
            } else {
                toast.error("Payment successful but failed to place some orders. Contact support.");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error("Payment successful but order placement failed. Contact support.");
        }
    };

    const placeOrder = async (address: any, phoneNumber: string) => {
        setIsOrdering(true);
        try {
            // Update local profile if it was just added via modal
            if (user && (!user.unsafeMetadata.phone || !user.unsafeMetadata.address)) {
                user.update({
                    unsafeMetadata: {
                        ...user.unsafeMetadata,
                        phone: phoneNumber,
                        address: address
                    }
                });
            }

            if (selectedPayment === 'upi' || selectedPayment === 'card' || selectedPayment === 'wallet') {
                // Initiate Razorpay payment
                await initiateRazorpayPayment(address, phoneNumber);
            } else {
                // For COD, place orders directly
                const restaurantIds = Object.keys(itemsByRestaurant);
                const orderPromises = restaurantIds.map(async (restaurantId) => {
                    const items = itemsByRestaurant[restaurantId];
                    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    const tax = Math.round(subtotal * 0.05);
                    const totalWithCharges = subtotal + tax + deliveryCharge;
                    
                    const res = await fetch("/api/order/create", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            items,
                            totalAmount: totalWithCharges,
                            deliveryAddress: address,
                            phoneNumber: phoneNumber,
                            restaurantId,
                            paymentMethod: selectedPayment.toUpperCase()
                        }),
                    });
                    return res;
                });

                const results = await Promise.all(orderPromises);
                const allSuccessful = results.every(res => res.ok);

                if (allSuccessful) {
                    toast.success("Orders placed successfully!");
                    clearCart();
                    router.push(`/my-orders`);
                } else {
                    toast.error("Failed to place some orders.");
                }
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
                initialPhone={user?.unsafeMetadata?.phone as string | undefined}
                initialAddress={user?.unsafeMetadata?.address as any}
            />
            <div className="pt-20 sm:pt-24 lg:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 lg:gap-12">

                    {/* Left Column: Cart Items */}
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
                                <div className="space-y-8">
                                    {Object.entries(itemsByRestaurant).map(([restaurantId, items]) => (
                                        <div key={restaurantId} className="border-b border-emerald-green/10 last:border-0 pb-6 last:pb-0">
                                            {/* Restaurant Header */}
                                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-dashed border-emerald-green/10">
                                                <Store size={18} className="text-emerald-green" />
                                                <h3 className="font-bold text-dark-evergreen" style={{ fontFamily: "var(--font-playfair)" }}>
                                                    {items[0]?.restaurantName}
                                                </h3>
                                                <span className="text-xs text-emerald-dark/50">
                                                    ({items.length} item{items.length > 1 ? 's' : ''})
                                                </span>
                                            </div>

                                            {/* Items for this restaurant */}
                                            <div className="space-y-4">
                                                {items.map((item) => (
                                                    <motion.div
                                                        key={`${item.foodItemId}-${item.restaurantId}`}
                                                        layout
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="flex items-center gap-4 py-3"
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
                                                            <p className="text-xs text-emerald-dark/50">From: {item.restaurantName}</p>
                                                            <p className="text-sm text-emerald-green font-bold mt-1">₹{item.price}</p>
                                                        </div>

                                                        <div className="flex items-center gap-2 sm:gap-3 bg-mint-whisper rounded-lg p-1">
                                                            <button
                                                                onClick={() => updateQuantity(item.foodItemId, item.restaurantId, -1)}
                                                                className="w-10 h-10 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-md bg-white text-emerald-dark hover:text-red-500 transition-colors shadow-sm touch-manipulation"
                                                            >
                                                                <Minus size={16} className="sm:w-3.5 sm:h-3.5" />
                                                            </button>
                                                            <span className="text-sm sm:text-sm font-bold w-8 sm:w-4 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.foodItemId, item.restaurantId, 1)}
                                                                className="w-10 h-10 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded-md bg-dark-evergreen text-white hover:bg-emerald-green transition-colors shadow-sm touch-manipulation"
                                                            >
                                                                <Plus size={16} className="sm:w-3.5 sm:h-3.5" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeFromCart(item.foodItemId, item.restaurantId)}
                                                            className="p-2 text-emerald-dark/40 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Restaurant Subtotal */}
                                            <div className="mt-4 pt-3 border-t border-dashed border-emerald-green/10 flex justify-between text-sm">
                                                <span className="text-emerald-dark/60">Subtotal</span>
                                                <span className="font-bold text-dark-evergreen">
                                                    ₹{items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Bill Details */}
                    <div className="lg:col-span-5 space-y-8">
                        {cartItems.length > 0 && (
                            <div className="mt-8 bg-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-emerald-green/5 border border-emerald-green/10">
                                <h3 className="text-lg font-bold text-dark-evergreen mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Bill Details</h3>

                                <div className="space-y-3 mb-6 text-sm text-emerald-dark/80" style={{ fontFamily: "var(--font-inter)" }}>
                                    <div className="flex justify-between">
                                        <span>Item Total</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxes & Charges (5%)</span>
                                        <span>₹{taxAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Fee {restaurantCount > 1 && `(${restaurantCount} orders)`}</span>
                                        <span>₹{deliveryCharge * restaurantCount}</span>
                                    </div>
                                    
                                    {/* Show restaurant breakdown */}
                                    <div className="pt-3 border-t border-emerald-green/10">
                                        <p className="text-xs font-medium text-emerald-dark/50 mb-2">Order from {restaurantCount} restaurant{restaurantCount > 1 ? 's' : ''}</p>
                                    </div>

                                    <div className="flex justify-between text-base font-bold text-dark-evergreen pt-3 border-t border-emerald-green/10">
                                        <span>To Pay</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-dark-evergreen mb-3">Select Payment Method</h4>
                                    <div className="space-y-2">
                                        {paymentOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => !option.disabled && setSelectedPayment(option.id)}
                                                disabled={option.disabled}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                                                    selectedPayment === option.id
                                                        ? 'border-emerald-green bg-emerald-green/5'
                                                        : 'border-gray-100 hover:border-gray-200'
                                                } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    selectedPayment === option.id ? 'bg-emerald-green text-white' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {option.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-dark-evergreen">{option.name}</p>
                                                    <p className="text-xs text-emerald-dark/60">{option.description}</p>
                                                </div>
                                                {selectedPayment === option.id && (
                                                    <div className="w-6 h-6 rounded-full bg-emerald-green flex items-center justify-center">
                                                        <Check size={14} className="text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
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
                                            <span>{isAuthenticated ? `Pay ₹${totalAmount}` : "Login to Place Order"}</span>
                                            {isAuthenticated && (
                                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                                    {selectedPayment === 'cod' ? 'COD' : selectedPayment.toUpperCase()}
                                                </span>
                                            )}
                                        </>
                                    )
                                    }
                                </button>
                                <p className="text-xs text-center text-emerald-dark/40 mt-3">
                                    {selectedPayment === 'cod' 
                                        ? "Pay cash when your order is delivered" 
                                        : "Secure payment powered by Razorpay"}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
