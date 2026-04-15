"use client";

import { useEffect, useState, use } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Clock, MapPin, Truck, ChefHat, Home, HelpCircle, Printer, Package, XCircle, Phone, User, Bike } from "lucide-react";

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
    deliveryStatus?: string;
    createdAt: string;
    restaurant_name?: string;
    restaurant_id?: string;
    restaurantAddress?: string;
    restaurantCity?: string;
    restaurantState?: string;
    restaurantPincode?: string;
    restaurantLatitude?: number;
    restaurantLongitude?: number;
    deliveryCharge?: number;
    delivery_partner_name?: string;
    delivery_partner_phone?: string;
    delivery_partner_vehicle?: string;
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
        
        // Auto-refresh order every 5 seconds for active orders
        const interval = setInterval(fetchOrder, 5000);
        
        return () => clearInterval(interval);
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
    const deliveryFee = order.deliveryCharge || 40; // Use actual delivery charge from order
    const taxes = order.totalAmount - itemTotal - deliveryFee; // Calculate actual taxes
    const discount = 0; // Hardcoded generic

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
                {(order.orderStatus === "Out for Delivery" || order.orderStatus === "Placed" || order.orderStatus === "Preparing" || order.orderStatus === "Assigned to Driver" || order.orderStatus === "Ready for Dispatch" || order.orderStatus === "Looking for Driver") && (
                    <div className="w-full h-64 bg-gray-200 relative print:hidden rounded-xl overflow-hidden shadow-sm">
                        {/* Dynamic map showing route from restaurant to delivery */}
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${(order.restaurantLongitude || 84.7950) - 0.02}%2C${(order.restaurantLatitude || 19.3175) - 0.01}%2C${(order.restaurantLongitude || 84.7950) + 0.02}%2C${(order.restaurantLatitude || 19.3175) + 0.01}&layer=mapnik&marker=${order.restaurantLatitude || 19.3175},${order.restaurantLongitude || 84.7950}`}
                            style={{ border: "none" }}
                        />
                        
                        {/* Delivery Partner Tracker Overlay */}
                        {(order.orderStatus === "Assigned to Driver" || order.orderStatus === "Out for Delivery") && (
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Animated delivery bike icon */}
                                <div 
                                    className="absolute transition-all duration-1000 ease-linear"
                                    style={{
                                        top: order.orderStatus === "Out for Delivery" ? "50%" : "30%",
                                        left: order.orderStatus === "Out for Delivery" ? "60%" : "40%",
                                        transform: "translate(-50%, -50%)"
                                    }}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                            <Bike size={24} className="text-white" />
                                        </div>
                                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                                            {order.delivery_partner_name || "Driver"}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Route line indicator */}
                                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                                    <line 
                                        x1="30%" 
                                        y1="40%" 
                                        x2={order.orderStatus === "Out for Delivery" ? "70%" : "50%"}
                                        y2={order.orderStatus === "Out for Delivery" ? "60%" : "50%"}
                                        stroke="#f97316" 
                                        strokeWidth="3" 
                                        strokeDasharray="8,4"
                                        className="animate-pulse"
                                    />
                                </svg>
                            </div>
                        )}
                        
                        {/* Restaurant Marker */}
                        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">{order.restaurant_name || "Restaurant"}</span>
                        </div>
                        
                        {/* Delivery Address Marker */}
                        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">Your Location</span>
                        </div>
                        
                        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs font-bold rounded shadow text-gray-600">
                            🗺️ Live Tracking
                        </div>
                    </div>
                )}

                {/* Order Status Timeline */}
                <div className="bg-white p-6 border-b border-gray-100 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Order Status</h2>
                    
                    {(() => {
                        const statusFlow = [
                            { status: 'Placed', label: 'Order Placed', icon: CheckCircle, description: 'Your order has been placed successfully' },
                            { status: 'Preparing', label: 'Being Prepared', icon: ChefHat, description: 'Restaurant is preparing your food' },
                            { status: 'Ready for Dispatch', label: 'Ready for Pickup', icon: Package, description: 'Food is ready, waiting for driver' },
                            { status: 'Looking for Driver', label: 'Finding Driver', icon: Truck, description: 'Searching for available delivery partner' },
                            { status: 'Assigned to Driver', label: 'Driver Assigned', icon: Truck, description: 'Delivery partner is on the way to restaurant' },
                            { status: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, description: 'Your order is on the way!' },
                            { status: 'Delivered', label: 'Delivered', icon: CheckCircle, description: 'Order delivered successfully' },
                        ];
                        
                        const currentIndex = statusFlow.findIndex(s => s.status === order.orderStatus);
                        const isCancelled = order.orderStatus === 'Cancelled';
                        
                        if (isCancelled) {
                            return (
                                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <XCircle size={20} className="text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-red-700">Order Cancelled</p>
                                        <p className="text-sm text-red-600">This order has been cancelled</p>
                                    </div>
                                </div>
                            );
                        }
                        
                        return (
                            <div className="space-y-0">
                                {statusFlow.map((step, index) => {
                                    const isCompleted = index <= currentIndex;
                                    const isCurrent = index === currentIndex;
                                    const IconComponent = step.icon;
                                    
                                    // Only show up to current status
                                    if (index > currentIndex && !isCompleted) return null;
                                    
                                    return (
                                        <div key={step.status} className="flex items-start gap-3 relative">
                                            {/* Connecting line */}
                                            {index < currentIndex && (
                                                <div className="absolute left-[18px] top-10 w-0.5 h-6 bg-green-500"></div>
                                            )}
                                            
                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                                                isCurrent 
                                                    ? 'bg-green-500 text-white animate-pulse' 
                                                    : isCompleted 
                                                        ? 'bg-green-100 text-green-600' 
                                                        : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                <IconComponent size={20} />
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 pb-6">
                                                <p className={`font-bold ${isCurrent ? 'text-green-600' : 'text-gray-800'}`}>
                                                    {step.label}
                                                </p>
                                                <p className="text-sm text-gray-500">{step.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>

                {/* Tracking Details */}
                <div className="bg-white p-6 pb-8 border-b border-gray-100 shadow-sm">
                    {/* Origin destination route */}
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Delivery Details</h2>
                    <div className="relative pl-6 space-y-6">
                        {/* Line connecting the icons */}
                        <div className="absolute left-[11px] top-4 bottom-6 border-l-2 border-dashed border-gray-300"></div>

                        {/* Origin (Restaurant) */}
                        <div className="relative">
                            <div className="absolute -left-6 bg-white w-[22px] h-[22px] flex items-center justify-center">
                                <MapPin size={16} className="text-gray-400" />
                            </div>
                            <h3 className="font-bold text-orange-500 text-base">{order.restaurant_name || 'BistroByte'}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {order.restaurantAddress || 'LOCHAPADA, BERHAMPUR'}, {order.restaurantCity || 'BERHAMPUR'} {order.restaurantState || 'ODISHA'}, {order.restaurantPincode || '760001'}
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
                    
                    {/* Delivery Partner Info */}
                    {(order.orderStatus === "Assigned to Driver" || order.orderStatus === "Out for Delivery") && order.delivery_partner_name ? (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Your Delivery Partner</h3>
                            <div className="bg-indigo-50 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <User size={24} className="text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{order.delivery_partner_name}</p>
                                    <p className="text-sm text-gray-500">{order.delivery_partner_vehicle || "Delivery Partner"}</p>
                                </div>
                                {order.delivery_partner_phone ? (
                                    <a 
                                        href={`tel:${order.delivery_partner_phone}`}
                                        className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors"
                                    >
                                        <Phone size={18} />
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
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
