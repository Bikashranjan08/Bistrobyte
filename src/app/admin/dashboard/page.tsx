"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Check, X, Truck, ChefHat, Clock, MapPin, Phone, User, ReceiptText } from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    _id: string;
    userId: {
        name: string;
        phone: string;
    };
    items: OrderItem[];
    totalAmount: number;
    orderStatus: 'Placed' | 'Preparing' | 'OutForDelivery' | 'Delivered' | 'Cancelled';
    deliveryAddress: {
        street: string;
        city: string;
        pincode: string;
        landmark?: string;
    };
    createdAt: string;
    phoneNumber: string;
    paymentMethod: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            if (res.status === 401) {
                router.push('/admin/login');
                return;
            }
            const data = await res.json();
            if (res.ok) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch('/api/admin/order-status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status }),
            });
            if (res.ok) {
                toast.success(`Order marked as ${status}`);
                fetchOrders();
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'OutForDelivery': return 'Out for Delivery';
            case 'Placed': return 'New Order';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Placed': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
            case 'Preparing': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'OutForDelivery': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-200';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-green"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                            <ChefHat size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">BistroByte</h1>
                            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Partner Dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            document.cookie = "admin_token=; path=/; max-age=0;";
                            router.push('/admin/login');
                        }}
                        className="text-gray-500 hover:text-red-500 font-bold text-sm px-4 py-2 transition-colors border border-gray-200 hover:border-red-200 rounded-lg"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Active Orders</h2>
                    <button onClick={fetchOrders} className="text-orange-500 font-bold hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors text-sm">
                        Refresh List
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {orders.map((order) => {
                        const itemTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                        const taxes = Math.round(itemTotal * 0.05); // Standard tax match frontend

                        return (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                {/* Header */}
                                <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-[#fcfcfc]">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">#{order._id.slice(-6).toUpperCase()}</h3>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 font-medium mt-1">
                                            <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.orderStatus || 'Placed')}`}>
                                        {getStatusLabel(order.orderStatus || 'Placed')}
                                    </span>
                                </div>

                                {/* Customer Info */}
                                <div className="p-5 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-gray-50 p-2.5 rounded-full border border-gray-100 text-gray-600 flex-shrink-0">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{order.userId?.name || "Customer"}</p>
                                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                                                <Phone size={12} className="text-gray-400" /> {order.phoneNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-gray-50 p-2.5 rounded-full border border-gray-100 text-gray-600 flex-shrink-0">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-700 leading-snug">
                                                {order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                                                {order.deliveryAddress.landmark && <span className="block text-gray-500 text-xs mt-0.5">Landmark: {order.deliveryAddress.landmark}</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items List (Receipt style) */}
                                <div className="bg-[#f8f9fa] p-5 border-t border-b border-gray-100 flex-1">
                                    <div className="flex items-center gap-2 mb-3 text-gray-500">
                                        <ReceiptText size={16} />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Order Details</h4>
                                    </div>

                                    <div className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-start text-sm">
                                                <div className="flex items-start gap-2">
                                                    <span className="font-bold text-gray-800 bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[10px]">{item.quantity}X</span>
                                                    <span className="font-medium text-gray-700 leading-tight pt-0.5">{item.name}</span>
                                                </div>
                                                <span className="font-bold text-gray-900 pt-0.5 whitespace-nowrap">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-dashed border-gray-300 space-y-1.5">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Subtotal</span>
                                            <span>₹{itemTotal}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Taxes (5%)</span>
                                            <span>₹{taxes}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer / Actions */}
                                <div className="p-5 bg-white">
                                    <div className="flex justify-between items-center mb-5">
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase tracking-wider font-bold block mb-0.5">Total &bull; {order.paymentMethod || 'COD'}</span>
                                            <span className="text-2xl font-black text-gray-900 tracking-tight">₹{order.totalAmount}</span>
                                        </div>
                                        {/* Status badge for quick glance */}
                                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                                            {order.orderStatus === 'Delivered' ? <Check size={20} className="text-green-500" /> : <Clock size={20} className="text-orange-500" />}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {(order.orderStatus === 'Placed' || !order.orderStatus) && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(order._id, 'Preparing')}
                                                    className="bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-sm"
                                                >
                                                    Accept & Cook
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(order._id, 'Cancelled')}
                                                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-3 rounded-xl font-bold text-sm transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {order.orderStatus === 'Preparing' && (
                                            <button
                                                onClick={() => updateStatus(order._id, 'OutForDelivery')}
                                                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                                            >
                                                <Truck size={18} /> Mark Out for Delivery
                                            </button>
                                        )}
                                        {order.orderStatus === 'OutForDelivery' && (
                                            <button
                                                onClick={() => updateStatus(order._id, 'Delivered')}
                                                className="col-span-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                                            >
                                                <Check size={18} /> Mark Delivered
                                            </button>
                                        )}
                                        {order.orderStatus === 'Delivered' && (
                                            <div className="col-span-2 text-center text-green-700 font-bold text-sm py-3 bg-green-50 rounded-xl border border-green-200 border-dashed">
                                                Order Completed
                                            </div>
                                        )}
                                        {order.orderStatus === 'Cancelled' && (
                                            <div className="col-span-2 text-center text-red-700 font-bold text-sm py-3 bg-red-50 rounded-xl border border-red-200 border-dashed">
                                                Order Cancelled
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {orders.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                <ChefHat size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Kitchen is Quiet</h3>
                            <p className="text-gray-500 font-medium">Waiting for new orders to arrive.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
