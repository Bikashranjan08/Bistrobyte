"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Truck, Package, Clock, XCircle, ChefHat, HelpCircle, ArrowLeft, Star, MapPin, Phone, Mail, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    restaurant_name?: string;
    restaurant_id?: string;
    restaurantAddress?: string;
    restaurantCity?: string;
    restaurantState?: string;
    restaurantPincode?: string;
    foodRating?: number;
    deliveryRating?: number;
    deliveryCharge?: number;
}

// Star Rating Component
function StarRating({ rating, onRate, readOnly = false, size = 16 }: { rating: number; onRate?: (r: number) => void; readOnly?: boolean; size?: number }) {
    const [hover, setHover] = useState(0);
    
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onRate?.(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                    className={`transition-all ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                >
                    <Star
                        size={size}
                        className={`transition-colors ${
                            star <= (hover || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

// Help Modal Component
function HelpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl max-w-md w-full p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Help & Support</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <a href="tel:+917008600000" className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <Phone size={24} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Call Us</p>
                                <p className="text-sm text-gray-500">+91 70086 00000</p>
                            </div>
                        </a>
                        
                        <a href="mailto:support@bistrobyte.com" className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Mail size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Email Support</p>
                                <p className="text-sm text-gray-500">support@bistrobyte.com</p>
                            </div>
                        </a>
                        
                        <button className="w-full flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <MessageCircle size={24} className="text-green-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900">Live Chat</p>
                                <p className="text-sm text-gray-500">Chat with our support team</p>
                            </div>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Cancel Order Button Component
function CancelOrderButton({ order, onCancel }: { order: Order; onCancel: (id: string) => void }) {
    const [timeLeft, setTimeLeft] = useState(60);
    const [isExpired, setIsExpired] = useState(false);
    
    useEffect(() => {
        const orderTime = new Date(order.createdAt).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - orderTime) / 1000);
        const remaining = Math.max(0, 60 - elapsed);
        
        setTimeLeft(remaining);
        if (remaining === 0) setIsExpired(true);
        
        if (remaining > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsExpired(true);
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            
            return () => clearInterval(timer);
        }
    }, [order.createdAt]);
    
    if (order.orderStatus !== 'Placed' && order.orderStatus !== 'Accepted') {
        return null;
    }
    
    if (isExpired) {
        return (
            <div className="text-xs text-gray-400 text-center py-2">
                Cancel window closed
            </div>
        );
    }
    
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to cancel this order?')) {
                    onCancel(order._id);
                }
            }}
            className="w-full py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
            <XCircle size={16} />
            Cancel Order ({timeLeft}s)
        </button>
    );
}

export default function MyOrdersPage() {
    const { isSignedIn: isAuthenticated, isLoaded } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const router = useRouter();

    const authLoading = !isLoaded;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/order/my-orders");
                if (res.ok) {
                    const data = await res.json();
                    // Sort descending by date
                    const sorted = data.orders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setOrders(sorted);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const handleRateFood = async (orderId: string, rating: number) => {
        try {
            const res = await fetch('/api/order/rate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, foodRating: rating })
            });
            if (res.ok) {
                toast.success('Food rated successfully!');
                setOrders(orders.map(o => o._id === orderId ? { ...o, foodRating: rating } : o));
            }
        } catch (error) {
            toast.error('Failed to rate');
        }
    };

    const handleRateDelivery = async (orderId: string, rating: number) => {
        try {
            const res = await fetch('/api/order/rate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, deliveryRating: rating })
            });
            if (res.ok) {
                toast.success('Delivery rated successfully!');
                setOrders(orders.map(o => o._id === orderId ? { ...o, deliveryRating: rating } : o));
            }
        } catch (error) {
            toast.error('Failed to rate');
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            const res = await fetch('/api/order/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });
            if (res.ok) {
                toast.success('Order cancelled successfully!');
                setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
            } else {
                toast.error('Failed to cancel order');
            }
        } catch (error) {
            toast.error('Failed to cancel order');
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-green"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* Help Modal */}
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

            {/* Swiggy Style App Bar */}
            <div className="bg-white border-b border-gray-100 pt-16 sm:pt-20">
                <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-gray-800" />
                        </Link>
                        <h1 className="text-lg font-bold text-gray-900 tracking-wide uppercase">My Account</h1>
                    </div>
                    <button 
                        onClick={() => setShowHelp(true)}
                        className="bg-orange-50 text-orange-500 font-bold px-4 py-1.5 rounded-full text-sm hover:bg-orange-100 transition-colors"
                    >
                        Help
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto mt-6 px-4">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Past Orders</h2>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                        <button
                            onClick={() => router.push("/menu")}
                            className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors"
                        >
                            Start Ordering
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200"
                                onClick={() => router.push(`/my-orders/${order._id}`)}
                            >
                                <div className="p-4 sm:p-5">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative shadow-sm border border-gray-200">
                                                <Image
                                                    src={order.items[0]?.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop"}
                                                    alt="Restaurant"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 leading-tight">{order.restaurant_name || 'BistroByte'}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {order.restaurantAddress || 'LOCHAPADA, BERHAMPUR'}, {order.restaurantCity || 'BERHAMPUR'} {order.restaurantState || 'ODISHA'}, {order.restaurantPincode || '760001'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                            <span className={`text-xs font-bold flex items-center gap-1 ${
                                                order.orderStatus === 'Delivered' ? 'text-green-600' : 
                                                order.orderStatus === 'Cancelled' ? 'text-red-600' :
                                                'text-orange-500'
                                            }`}>
                                                {order.orderStatus === 'Delivered' ? 'Delivered' : 
                                                 order.orderStatus === 'Cancelled' ? 'Cancelled' :
                                                 order.orderStatus || 'Processing'}
                                                {order.orderStatus === 'Delivered' ? <CheckCircle size={14} /> : 
                                                 order.orderStatus === 'Cancelled' ? <XCircle size={14} /> :
                                                 <Clock size={14} className="animate-pulse" />}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items Info */}
                                    <div className="border-b border-dashed border-gray-200 pb-4 mb-4">
                                        <p className="text-sm text-gray-700 bg-gray-50 inline-block px-3 py-1 rounded flex items-center gap-2">
                                            <span className="font-bold text-gray-500 bg-white px-1.5 shadow-sm text-xs border border-gray-200">{order.items.length}X</span>
                                            {order.items.map(i => i.name).join(', ')}
                                        </p>
                                    </div>

                                    {/* Ratings grid - Now Functional! */}
                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1.5">Your Food Rating</p>
                                            <StarRating 
                                                rating={order.foodRating || 0} 
                                                onRate={(r) => handleRateFood(order._id, r)}
                                                readOnly={order.orderStatus !== 'Delivered'}
                                            />
                                        </div>
                                        <div className="pl-4 border-l border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1.5">Delivery Rating</p>
                                            <StarRating 
                                                rating={order.deliveryRating || 0} 
                                                onRate={(r) => handleRateDelivery(order._id, r)}
                                                readOnly={order.orderStatus !== 'Delivered'}
                                            />
                                        </div>
                                    </div>

                                    {/* Cancel Order Button - Only for Placed/Accepted, expires after 60s */}
                                    {(order.orderStatus === 'Placed' || order.orderStatus === 'Accepted') && (
                                        <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                                            <CancelOrderButton order={order} onCancel={handleCancelOrder} />
                                        </div>
                                    )}

                                    {/* Track & Reorder Buttons */}
                                    <div className="flex gap-2 mb-4">
                                        {(order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Dispatched') && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/track/${order._id}`);
                                                }}
                                                className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold py-2.5 rounded-lg text-sm tracking-wide transition-colors flex justify-center items-center gap-1"
                                            >
                                                <MapPin size={16} />
                                                TRACK
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push("/menu");
                                            }}
                                            className={`${(order.orderStatus === 'Out for Delivery' || order.orderStatus === 'Dispatched') ? 'flex-1' : 'w-full'} bg-orange-50 hover:bg-orange-100 text-orange-500 font-bold py-2.5 rounded-lg text-sm tracking-wide transition-colors flex justify-center items-center gap-1 group`}
                                        >
                                            REORDER <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
                                        </button>
                                    </div>

                                    {/* Bill Breakdown */}
                                    <div className="border-t border-gray-100 pt-3 mb-3">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Item Total</span>
                                            <span>₹{Math.round(order.totalAmount - (order.deliveryCharge || 0) - Math.round((order.totalAmount - (order.deliveryCharge || 0)) * 0.05))}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Taxes (5%)</span>
                                            <span>₹{Math.round((order.totalAmount - (order.deliveryCharge || 0)) * 0.05)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Delivery Charge</span>
                                            <span>₹{order.deliveryCharge || 40}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200">
                                            <span>Bill Total</span>
                                            <span>₹{order.totalAmount}</span>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <p className="text-xs text-gray-400">
                                        Ordered: {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
