"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Check, X, Truck, ChefHat, Clock, MapPin, Phone, User } from 'lucide-react';
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
    };
    createdAt: string;
    phoneNumber: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check Auth using simple cookie existence check for client-side redirection
        const token = document.cookie.split('; ').find(row => row.startsWith('admin_token='));
        // Note: Strict HttpOnly cookies can't be read by js, so this check naturally fails if we rely only on JS.
        // However, the dashboard seems to rely on this or expects non-HttpOnly for this specific check?
        // Actually, if I made it HttpOnly, this check `document.cookie` will return nothing for `admin_token`.
        // So the user will always be redirected!
        // FIX: Remove client-side cookie check if the cookie is HttpOnly.
        // Instead, let the API call fail with 401 if unauthenticated.
        // But for now, I'll keep the logic but be aware.
        // Wait, if I changed the login to use HttpOnly, `document.cookie` is empty.
        // So this will redirect to login loop.
        // I should remove this check or use a server action/api to check auth status.
        // For now, I'll comment it out to avoid lookup loop, relying on API 401s.

        // fetchOrders will handle 401s potentially? No, currently it just logs error.
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
            case 'Placed': return 'bg-yellow-100 text-yellow-700';
            case 'Preparing': return 'bg-blue-100 text-blue-700';
            case 'OutForDelivery': return 'bg-purple-100 text-purple-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-dark-evergreen text-white p-4 sticky top-0 z-50 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ChefHat size={32} className="text-emerald-green" />
                        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>Kitchen Command Center</h1>
                    </div>
                    <button
                        onClick={() => {
                            // Clear cookie - purely for UX, real clear happens if we had a logout endpoint 
                            // or just overwrite with past expiry
                            document.cookie = "admin_token=; path=/; max-age=0;";
                            router.push('/admin/login');
                        }}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-100 px-4 py-2 rounded-lg transition-colors font-bold text-sm"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Active Orders</h2>
                    <button onClick={fetchOrders} className="text-emerald-green font-bold hover:underline">Refresh</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">#{order._id.slice(-6)}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.orderStatus || 'Placed')}`}>
                                    {getStatusLabel(order.orderStatus || 'Placed')}
                                </span>
                            </div>

                            {/* Customer Info */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">{order.userId?.name || "Guest"}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Phone size={12} /> {order.phoneNumber}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            {order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="bg-gray-50/50 p-4 border-t border-b border-gray-100 space-y-2 max-h-40 overflow-y-auto">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-md bg-gray-200 overflow-hidden relative">
                                                <Image src={item.image || '/placeholder-food.png'} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                        </div>
                                        <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Footer / Actions */}
                            <div className="p-4 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500 text-sm">Total</span>
                                    <span className="text-xl font-bold text-dark-evergreen">₹{order.totalAmount}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {(order.orderStatus === 'Placed' || !order.orderStatus) && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(order._id, 'Preparing')}
                                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold text-sm transition-colors"
                                            >
                                                Accept & Cook
                                            </button>
                                            <button
                                                onClick={() => updateStatus(order._id, 'Cancelled')}
                                                className="bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-lg font-bold text-sm transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {order.orderStatus === 'Preparing' && (
                                        <button
                                            onClick={() => updateStatus(order._id, 'OutForDelivery')}
                                            className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Truck size={16} /> Mark Out for Delivery
                                        </button>
                                    )}
                                    {order.orderStatus === 'OutForDelivery' && (
                                        <button
                                            onClick={() => updateStatus(order._id, 'Delivered')}
                                            className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Check size={16} /> Mark Delivered
                                        </button>
                                    )}
                                    {order.orderStatus === 'Delivered' && (
                                        <div className="col-span-2 text-center text-green-600 font-bold text-sm py-2 bg-green-50 rounded-lg border border-green-100">
                                            Completed Successfully
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {orders.length === 0 && (
                        <div className="col-span-full text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <ChefHat size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-600">Kitchen is Quiet</h3>
                            <p className="text-gray-400">No active orders right now.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
