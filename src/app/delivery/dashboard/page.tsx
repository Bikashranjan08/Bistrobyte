"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Bike, Power, Package, LogOut, AlertCircle, CheckCircle, MapPin, Store, Navigation, Phone, User, ChevronDown, X, History, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface DeliveryPartner {
    id: string;
    name: string;
    phone: string;
    email?: string;
    vehicle_type: string;
    status: 'pending' | 'approved' | 'rejected';
    is_available: boolean;
    admin_feedback?: string;
}

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: string;
    items: OrderItem[];
    total_amount: number;
    order_status: 'Placed' | 'Accepted' | 'Preparing' | 'Ready for Dispatch' | 'Dispatched' | 'Assigned to Driver' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    delivery_status?: 'Pending Acceptance' | 'Accepted by Driver' | 'Arrived at Restaurant' | 'Order Picked Up' | 'Arrived at Location' | 'Delivered';
    payment_status: string;
    payment_method: string;
    phone_number: string;
    restaurant_name: string;
    restaurant_address?: string;
    delivery_address: {
        street: string;
        city: string;
        pincode: string;
    };
    created_at: string;
    delivery_incentive?: number;
    delivery_charge?: number;
}

// Delivery Order Card Component
function DeliveryOrderCard({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (orderId: string, status: string) => void }) {
    const getDeliveryStatusStep = (order: Order) => {
        const statusFlow = ['Accepted by Driver', 'Arrived at Restaurant', 'Order Picked Up', 'Arrived at Location', 'Delivered'];
        const currentStatus = order.delivery_status || 'Accepted by Driver';
        return statusFlow.indexOf(currentStatus);
    };

    const currentStep = getDeliveryStatusStep(order);

    const getNextDeliveryStatus = (order: Order): string | null => {
        const statusFlow = ['Accepted by Driver', 'Arrived at Restaurant', 'Order Picked Up', 'Arrived at Location', 'Delivered'];
        const currentStatus = order.delivery_status || 'Accepted by Driver';
        const currentIndex = statusFlow.indexOf(currentStatus);
        return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;
    };

    const nextStatus = getNextDeliveryStatus(order);

    const getStatusButtonConfig = (status: string | null) => {
        switch (status) {
            case 'Arrived at Restaurant':
                return { icon: <Store size={18} />, text: 'Arrived at Restaurant', color: 'bg-blue-600' };
            case 'Order Picked Up':
                return { icon: <Package size={18} />, text: 'Order Picked Up', color: 'bg-orange-600' };
            case 'Arrived at Location':
                return { icon: <MapPin size={18} />, text: 'Arrived at Delivery Location', color: 'bg-purple-600' };
            case 'Delivered':
                return { icon: <CheckCircle size={18} />, text: 'Mark as Delivered', color: 'bg-green-600' };
            default:
                return { icon: <Navigation size={18} />, text: 'Update Status', color: 'bg-emerald-600' };
        }
    };

    const buttonConfig = getStatusButtonConfig(nextStatus);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
        >
            {/* Order Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-blue-100">Order #{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-blue-200">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20">
                        {order.delivery_status || 'New Delivery'}
                    </span>
                </div>
            </div>

            {/* Restaurant Info */}
            <div className="p-4 border-b border-gray-100 bg-orange-50">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <Store size={20} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-orange-600 font-bold uppercase tracking-wide">Pickup From</p>
                        <p className="font-bold text-gray-900">{order.restaurant_name}</p>
                        <p className="text-sm text-gray-600">{order.restaurant_address || 'Restaurant Address'}</p>
                    </div>
                </div>
            </div>

            {/* Customer Info */}
            <div className="p-4 border-b border-gray-100 bg-blue-50">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <MapPin size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Deliver To</p>
                        <p className="font-bold text-gray-900">Customer</p>
                        <p className="text-sm text-gray-600">{order.delivery_address.street}, {order.delivery_address.city} - {order.delivery_address.pincode}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Phone size={14} className="text-gray-400" />
                            <p className="text-sm font-medium text-gray-700">{order.phone_number}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="p-4 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Order Items</p>
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500">{item.quantity}x</span>
                            <span className="text-gray-900">{item.name}</span>
                        </div>
                        <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                ))}
                <div className="border-t border-gray-100 mt-3 pt-3 space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Item Total</span>
                        <span>₹{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Delivery Charge</span>
                        <span>₹{order.delivery_charge || 40}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                        <span className="text-sm text-gray-500">Total ({order.payment_method})</span>
                        <span className="text-xl font-bold text-gray-900">₹{order.total_amount}</span>
                    </div>
                </div>
            </div>

            {/* Delivery Progress */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    {['Accept', 'Arrive', 'Pickup', 'Deliver'].map((step, idx) => (
                        <div key={step} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                idx <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                                {idx < currentStep ? <CheckCircle size={14} /> : idx + 1}
                            </div>
                            <span className={`text-xs mt-1 ${idx <= currentStep ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            {order.delivery_status !== 'Delivered' && (
                <div className="p-4">
                    <button
                        onClick={() => nextStatus && onUpdateStatus(order.id, nextStatus)}
                        disabled={!nextStatus}
                        className={`w-full py-4 ${buttonConfig.color} text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg`}
                    >
                        {buttonConfig.icon}
                        {buttonConfig.text}
                    </button>
                </div>
            )}

            {order.delivery_status === 'Delivered' && (
                <div className="p-4 bg-green-50">
                    <p className="text-center text-green-700 font-bold flex items-center justify-center gap-2">
                        <CheckCircle size={20} />
                        Delivery Completed Successfully!
                    </p>
                </div>
            )}
        </motion.div>
    );
}

interface DeliveryRequest {
    id: string;
    order_id: string;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
}

interface PastDelivery {
    id: string;
    restaurant_name: string;
    delivery_address: any;
    delivery_incentive: number;
    created_at: string;
}

export default function DeliveryDashboard() {
    const router = useRouter();
    const [partner, setPartner] = useState<DeliveryPartner | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isToggling, setIsToggling] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [pastDeliveries, setPastDeliveries] = useState<PastDelivery[]>([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalDeliveries, setTotalDeliveries] = useState(0);

    useEffect(() => {
        fetchProfile();
        fetchOrders();
        fetchDeliveryRequests();
        fetchDeliveryHistory();
        // Poll for new delivery requests every 5 seconds
        const interval = setInterval(fetchDeliveryRequests, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/delivery/profile');
            if (res.status === 401) {
                router.push('/delivery/login');
                return;
            }
            const data = await res.json();
            if (data.success) {
                setPartner(data.data);
                setIsOnline(data.data.is_available);
            }
        } catch (error) {
            console.error('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/delivery/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch orders');
        }
    };

    const fetchDeliveryHistory = async () => {
        try {
            const res = await fetch('/api/delivery/history');
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setPastDeliveries(data.data || []);
                    setTotalEarnings(data.totalEarnings || 0);
                    setTotalDeliveries(data.totalDeliveries || 0);
                }
            }
        } catch (error) {
            console.error('Failed to fetch delivery history');
        }
    };

    const toggleAvailability = async () => {
        setIsToggling(true);
        try {
            const res = await fetch('/api/delivery/toggle-status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isAvailable: !isOnline })
            });

            if (res.ok) {
                setIsOnline(!isOnline);
                toast.success(`You are now ${!isOnline ? 'online' : 'offline'}`);
            }
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setIsToggling(false);
        }
    };

    const updateDeliveryStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch('/api/delivery/order-status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, deliveryStatus: status })
            });

            if (res.ok) {
                toast.success(`Status updated: ${status}`);
                fetchOrders();
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const fetchDeliveryRequests = async () => {
        try {
            const res = await fetch('/api/delivery/requests');
            if (res.ok) {
                const data = await res.json();
                setDeliveryRequests(data.requests || []);
            }
        } catch (error) {
            console.error('Failed to fetch delivery requests:', error);
        }
    };

    const acceptDeliveryRequest = async (orderId: string, notificationId: string) => {
        try {
            const res = await fetch('/api/delivery/accept-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Delivery request accepted! You got the order!');
                // Mark notification as read
                await fetch('/api/notifications', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notificationId })
                });
                // Clear all delivery requests for this order and refresh
                setDeliveryRequests(prev => prev.filter(r => r.order_id !== orderId));
                fetchOrders();
            } else {
                toast.error(data.message || 'Failed to accept request');
                // Remove this specific request from the list since it's no longer available
                setDeliveryRequests(prev => prev.filter(r => r.order_id !== orderId));
                // Refresh to get updated status
                fetchDeliveryRequests();
            }
        } catch (error) {
            toast.error('Something went wrong');
            // Refresh on error
            fetchDeliveryRequests();
        }
    };

    const acceptOrder = async (orderId: string) => {
        try {
            const res = await fetch('/api/delivery/accept-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });

            if (res.ok) {
                toast.success('Order accepted! Start delivery now.');
                fetchOrders();
            } else {
                toast.error('Failed to accept order');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const rejectOrder = async (orderId: string) => {
        const reason = prompt('Please provide a reason for rejection (optional):');
        try {
            const res = await fetch('/api/delivery/reject-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, reason })
            });

            if (res.ok) {
                toast.success('Order rejected. Admin will reassign.');
                fetchOrders();
            } else {
                toast.error('Failed to reject order');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const logout = () => {
        document.cookie = 'delivery_token=; path=/; max-age=0;';
        router.push('/delivery/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Filter orders - assigned directly by admin
    const assignedOrders = orders.filter(o => o.order_status === 'Assigned to Driver');
    const activeOrders = orders.filter(o => o.delivery_status && o.delivery_status !== 'Delivered' && o.order_status === 'Out for Delivery');
    const completedOrders = orders.filter(o => o.delivery_status === 'Delivered');

    // Helper to start delivery
    const startDelivery = async (orderId: string) => {
        try {
            const res = await fetch('/api/delivery/order-status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, orderStatus: 'Out for Delivery', deliveryStatus: 'Accepted by Driver' })
            });

            if (res.ok) {
                toast.success('Delivery started!');
                fetchOrders();
            } else {
                toast.error('Failed to start delivery');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                            <Bike size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">Delivery Partner</h1>
                            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                            View Site
                        </Link>
                        
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User size={18} className="text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">{partner?.name || 'Driver'}</span>
                                <ChevronDown size={16} className="text-gray-400" />
                            </button>
                            
                            {showProfileMenu && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowProfileMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                                        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                                            <p className="font-bold">{partner?.name}</p>
                                            <p className="text-xs text-blue-100">{partner?.phone}</p>
                                            <p className="text-xs text-blue-100 mt-1">{partner?.vehicle_type || 'Bike'}</p>
                                        </div>
                                        <div className="p-3 border-t border-gray-100">
                                            <div className="flex justify-between text-sm py-2 px-2 rounded-lg bg-green-50">
                                                <span className="text-gray-600">Total Earnings</span>
                                                <span className="font-bold text-green-600">₹{totalEarnings}</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-2 px-2 mt-1 rounded-lg bg-blue-50">
                                                <span className="text-gray-600">Deliveries</span>
                                                <span className="font-bold text-blue-600">{totalDeliveries}</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-100">
                                            <button
                                                onClick={logout}
                                                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
                {/* Online/Offline Toggle */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isOnline ? 'bg-green-100' : 'bg-gray-100'}`}>
                                <Power size={28} className={isOnline ? 'text-green-600' : 'text-gray-400'} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{isOnline ? 'You are Online' : 'You are Offline'}</h2>
                                <p className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                    {isOnline ? 'Receiving delivery requests' : 'Go online to start delivering'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleAvailability}
                            disabled={isToggling}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${
                                isOnline 
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                                    : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20'
                            }`}
                        >
                            {isToggling ? 'Updating...' : isOnline ? 'Go Offline' : 'Go Online'}
                        </button>
                    </div>
                </motion.div>

                {/* Active Deliveries */}
                {activeOrders.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Navigation size={24} className="text-blue-600" />
                            Active Delivery ({activeOrders.length})
                        </h2>
                        <div className="space-y-4">
                            {activeOrders.map(order => (
                                <DeliveryOrderCard 
                                    key={order.id} 
                                    order={order} 
                                    onUpdateStatus={updateDeliveryStatus}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* New Assigned Orders - Admin assigned directly */}
                {assignedOrders.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle size={24} className="text-blue-600 animate-pulse" />
                            New Deliveries Assigned ({assignedOrders.length})
                        </h2>
                        <div className="grid gap-4">
                            {assignedOrders.map(order => (
                                <div key={order.id} className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Order #{order.id.slice(-6).toUpperCase()}</p>
                                            <p className="font-bold text-lg text-gray-900">{order.restaurant_name}</p>
                                            <p className="text-sm text-gray-600">Pickup: {order.restaurant_address || 'Restaurant'}</p>
                                            <p className="text-sm text-gray-600">Drop: {order.delivery_address?.street}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 block mb-1">
                                                +₹{order.delivery_incentive || 30} incentive
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => startDelivery(order.id)}
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Navigation size={18} /> Start Delivery
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* No Orders State */}
                {activeOrders.length === 0 && assignedOrders.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
                    >
                        <Package size={64} className="text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No deliveries assigned</h3>
                        <p className="text-gray-500">
                            Waiting for admin to assign deliveries...
                        </p>
                    </motion.div>
                )}

                {/* Earnings Summary */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                <DollarSign size={28} />
                            </div>
                            <div>
                                <p className="text-green-100 text-sm">Total Earnings</p>
                                <p className="text-3xl font-bold">₹{totalEarnings}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold">{totalDeliveries}</p>
                            <p className="text-green-100 text-sm">Deliveries</p>
                        </div>
                    </div>
                </motion.div>

                {/* Past Deliveries */}
                {pastDeliveries.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <History size={24} className="text-gray-600" />
                            Past Deliveries
                        </h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {pastDeliveries.map((delivery) => (
                                    <div key={delivery.id} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                                <CheckCircle size={20} className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{delivery.restaurant_name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(delivery.created_at).toLocaleDateString()} • #{delivery.id.slice(-6).toUpperCase()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">+₹{delivery.delivery_incentive || 0}</p>
                                            <p className="text-xs text-gray-400">Earned</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
