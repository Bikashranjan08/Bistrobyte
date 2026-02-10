"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Package, Clock, CheckCircle, Truck, XCircle, ChefHat } from "lucide-react";

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
}

export default function MyOrdersPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
            // Poll for updates every 5 seconds
            const interval = setInterval(fetchOrders, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "placed": return "text-blue-500 bg-blue-50";
            case "preparing": return "text-orange-500 bg-orange-50";
            case "outfordelivery": return "text-purple-500 bg-purple-50";
            case "delivered": return "text-green-500 bg-green-50";
            case "cancelled": return "text-red-500 bg-red-50";
            default: return "text-gray-500 bg-gray-50";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "placed": return <Package size={16} />;
            case "preparing": return <ChefHat size={16} />;
            case "outfordelivery": return <Truck size={16} />;
            case "delivered": return <CheckCircle size={16} />;
            case "cancelled": return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-mint-whisper">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-green"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mint-whisper pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-dark-evergreen mb-8" style={{ fontFamily: "var(--font-playfair)" }}>My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-emerald-green/5">
                        <Package size={48} className="mx-auto text-emerald-green/30 mb-4" />
                        <h2 className="text-xl font-semibold text-dark-evergreen mb-2">No orders yet</h2>
                        <p className="text-emerald-dark/60 mb-6">Looks like you haven't placed any orders yet.</p>
                        <button
                            onClick={() => router.push("/menu")}
                            className="px-6 py-2.5 bg-emerald-green text-white rounded-full font-bold hover:bg-emerald-dark transition-colors"
                        >
                            Start Ordering
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-green/5 overflow-hidden"
                            >
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-gray-100 pb-4">
                                    <div>
                                        <span className="text-xs text-emerald-dark/40 font-bold uppercase tracking-wider">Order ID</span>
                                        <p className="font-mono text-sm text-dark-evergreen">#{order._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-emerald-dark/40 font-bold uppercase tracking-wider">Date</span>
                                        <p className="text-sm text-dark-evergreen">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-emerald-dark/40 font-bold uppercase tracking-wider">Total</span>
                                        <p className="text-sm font-bold text-emerald-green">&#8377;{order.totalAmount}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
                                        {getStatusIcon(order.orderStatus)}
                                        <span className="capitalize">{order.orderStatus === 'OutForDelivery' ? 'Out for Delivery' : order.orderStatus}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Package size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-dark-evergreen">{item.name}</p>
                                                <p className="text-xs text-emerald-dark/50">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium text-dark-evergreen">&#8377;{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
