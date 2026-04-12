"use client";

import { useEffect, useState, use } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Clock, MapPin, Truck, ChefHat, Home, HelpCircle, Printer } from "lucide-react";

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
    deliveryAddress?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        landmark?: string;
    };
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { isSignedIn, isLoaded } = useUser();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            router.push("/");
            return;
        }

        const fetchOrder = async () => {
            try {
                // To reuse the existing endpoint, we fetch all orders and filter.
                // Ideally, there should be a specific endpoint for a single order.
                const res = await fetch("/api/order/my-orders");
                if (res.ok) {
                    const data = await res.json();
                    const foundOrder = data.orders.find((o: Order) => o._id === id);
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        router.push("/my-orders");
                    }
                }
            } catch (error) {
                console.error("Failed to fetch order", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, isSignedIn, isLoaded, router]);

    if (loading || !isLoaded) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-green"></div>
            </div>
        );
    }

    if (!order) return null;

    const itemTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxes = Math.round(itemTotal * 0.05); // Fixed 5% tax from cart logic
    const discount = 0; // Hardcoded generic
    const deliveryFee = 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 print:pb-0 print:bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 pt-20 print:pt-4">
                <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push("/my-orders")} className="p-2 hover:bg-gray-100 rounded-full transition-colors print:hidden">
                            <ArrowLeft size={24} className="text-gray-800" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">ORDER #{order._id.slice(-10).toUpperCase()}</h1>
                            <p className="text-sm text-gray-500">
                                {order.orderStatus === "Delivered" ? "Delivered" : order.orderStatus || "Placed"} • {order.items.length} Item{order.items.length > 1 ? "s" : ""} • &#8377;{order.totalAmount}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 print:hidden">
                        <button onClick={() => window.print()} className="text-gray-600 hover:text-emerald-green font-bold text-sm tracking-wide flex items-center gap-1.5 transition-colors" style={{ fontVariant: 'small-caps' }}>
                            <Printer size={16} /> Print
                        </button>
                        <button className="text-orange-500 font-bold text-sm tracking-wide lowercase" style={{ fontVariant: 'small-caps' }}>
                            Help
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-2">

                {/* Live Track Map using OpenStreetMap */}
                {(order.orderStatus === "OutForDelivery" || order.orderStatus === "Placed" || order.orderStatus === "Preparing") && (
                    <div className="w-full h-48 bg-gray-200 relative print:hidden">
                        {/* Using a rough generic embed. A real implementation would use dynamic lat/lon. */}
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src="https://www.openstreetmap.org/export/embed.html?bbox=84.780%2C19.310%2C84.810%2C19.325&layer=mapnik&marker=19.3175,84.7950"
                            style={{ border: "1px solid #e5e7eb" }}
                        />
                        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded shadow text-gray-600">
                            Live map (OpenStreetMap)
                        </div>
                    </div>
                )}

                {/* Tracking Details */}
                <div className="bg-white p-6 pb-8 border-b border-gray-100 shadow-sm">
                    {/* Origin destination route */}
                    <div className="relative pl-6 space-y-6">
                        {/* Line connecting the icons */}
                        <div className="absolute left-[11px] top-4 bottom-6 border-l-2 border-dashed border-gray-300"></div>

                        {/* Origin (Restaurant) */}
                        <div className="relative">
                            <div className="absolute -left-6 bg-white w-[22px] h-[22px] flex items-center justify-center">
                                <MapPin size={16} className="text-gray-400" />
                            </div>
                            <h3 className="font-bold text-orange-500 text-base">BistroByte</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                LOCHAPADA, BERHAMPUR ODISHA, 760001
                            </p>
                        </div>

                        {/* Destination (Home) */}
                        <div className="relative">
                            <div className="absolute -left-6 bg-white w-[22px] h-[22px] flex items-center justify-center">
                                <Home size={16} className="text-gray-700" />
                            </div>
                            <h3 className="font-bold text-gray-800 text-base">Other</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {order.deliveryAddress?.street || "N/A"}, {order.deliveryAddress?.city}, {order.deliveryAddress?.pincode}
                                {order.deliveryAddress?.landmark ? ` (Near ${order.deliveryAddress.landmark})` : ""}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={18} />
                        </div>
                        <div>
                            <p className="text-gray-800 text-sm font-medium">
                                {order.orderStatus === "Delivered"
                                    ? `Order delivered on ${new Date(order.createdAt).toLocaleDateString()}`
                                    : `Order is currently ${order.orderStatus || 'in progress'}`}
                            </p>
                            {order.orderStatus === "Delivered" && (
                                <p className="text-sm text-gray-500 mt-0.5">by delivery partner</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bill Details */}
                <div className="bg-white mt-4 shadow-sm border-t border-b border-gray-100">
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bill Details</h2>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Items list */}
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm">
                                <div className="flex gap-2 items-start">
                                    <div className="mt-0.5 w-3 h-3 border border-green-600 flex items-center justify-center rounded-sm">
                                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                    </div>
                                    <span className="text-gray-700 font-medium">{item.name} x {item.quantity}</span>
                                </div>
                                <span className="font-medium text-gray-800">&#8377;{item.price * item.quantity}</span>
                            </div>
                        ))}

                        <div className="pt-4 border-t border-dashed border-gray-300 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Item Total</span>
                                <span>&#8377;{itemTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Delivery Fee</span>
                                <span>&#8377;{deliveryFee.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount Applied</span>
                                    <span>-&#8377;{discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Taxes & Charges</span>
                                <span>&#8377;{taxes}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Total */}
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-[#fcfcfc]">
                        <span className="text-gray-800 font-medium text-sm">Paid Via {order.paymentMethod === "COD" ? "Cash" : order.paymentMethod}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-medium text-sm">Bill Total</span>
                            <span className="text-lg font-bold text-gray-900">&#8377;{order.totalAmount}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Spacer & Action */}
                <div className="bg-white p-4 mt-4 mb-2 shadow-sm text-center flex flex-col gap-3 print:hidden">
                    <button onClick={() => window.print()} className="bg-emerald-green/10 hover:bg-emerald-green/20 text-emerald-dark font-bold tracking-wide uppercase text-sm w-full py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Printer size={18} /> Print Receipt
                    </button>
                    <button onClick={() => router.push("/menu")} className="text-orange-500 font-bold tracking-wide uppercase text-sm w-full py-2 hover:bg-orange-50 rounded-lg transition-colors">
                        Reorder
                    </button>
                    <div className="h-6"></div>
                </div>
            </div>
        </div>
    );
}
