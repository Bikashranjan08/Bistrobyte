"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle, Truck, Package, Clock, XCircle, ChefHat, HelpCircle, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

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
    const { isSignedIn: isAuthenticated, isLoaded } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
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

    if (loading || authLoading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-green"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* Swiggy Style App Bar */}
            <div className="bg-white border-b border-gray-100 pt-16 sm:pt-20">
                <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-gray-800" />
                        </Link>
                        <h1 className="text-lg font-bold text-gray-900 tracking-wide uppercase">My Account</h1>
                    </div>
                    <button className="bg-orange-50 text-orange-500 font-bold px-4 py-1.5 rounded-full text-sm hover:bg-orange-100 transition-colors">
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
                                                <h3 className="font-bold text-gray-900 leading-tight">The Oxford Kitchen</h3>
                                                <p className="text-xs text-gray-500">Central Oxford</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                            <span className={`text-xs font-bold flex items-center gap-1 ${
                                                order.orderStatus === 'Delivered' ? 'text-green-600' : 'text-orange-500'
                                            }`}>
                                                {order.orderStatus === 'Delivered' ? 'Delivered' : order.orderStatus || 'Processing'}
                                                {order.orderStatus === 'Delivered' ? <CheckCircle size={14} /> : <Clock size={14} className="animate-pulse" />}
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

                                    {/* Ratings grid placeholder */}
                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1.5">Your Food Rating</p>
                                            <div className="flex gap-1 text-gray-300">
                                                {[...Array(5)].map((_, i) => <Star key={i} size={16} />)}
                                            </div>
                                        </div>
                                        <div className="pl-4 border-l border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1.5">Delivery Rating</p>
                                            <div className="flex gap-1 text-gray-300">
                                                {[...Array(5)].map((_, i) => <Star key={i} size={16} />)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reorder Button */}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent clicking the card
                                            router.push("/menu");
                                        }}
                                        className="w-full bg-orange-50 hover:bg-orange-100 text-orange-500 font-bold py-2.5 rounded-lg text-sm tracking-wide transition-colors mb-4 flex justify-center items-center gap-1 group"
                                    >
                                        REORDER <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
                                    </button>

                                    {/* Footer Info */}
                                    <p className="text-xs text-gray-500 font-medium border-t border-gray-100 pt-3">
                                        Ordered: {new Date(order.createdAt).toLocaleDateString(undefined, {month: 'long', day:'numeric', hour:'numeric', minute:'numeric'})} • Bill Total: &#8377;{order.totalAmount}
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
