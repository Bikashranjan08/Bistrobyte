"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Store, Power, Utensils, Plus, Trash2, DollarSign, LogOut, AlertCircle, ChefHat, Package, Truck, CheckCircle, Clock, XCircle, PackageCheck, Phone, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Order Card Component
function OrderCard({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (orderId: string, status: string) => void }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Placed': return 'bg-yellow-100 text-yellow-800';
            case 'Accepted': return 'bg-blue-100 text-blue-800';
            case 'Preparing': return 'bg-orange-100 text-orange-800';
            case 'Ready for Dispatch': return 'bg-purple-100 text-purple-800';
            case 'Dispatched': return 'bg-indigo-100 text-indigo-800';
            case 'Out for Delivery': return 'bg-blue-100 text-blue-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Placed': return <Clock size={16} />;
            case 'Accepted': return <CheckCircle size={16} />;
            case 'Preparing': return <ChefHat size={16} />;
            case 'Ready for Dispatch': return <PackageCheck size={16} />;
            case 'Dispatched': return <Truck size={16} />;
            case 'Out for Delivery': return <Package size={16} />;
            case 'Delivered': return <CheckCircle size={16} />;
            case 'Cancelled': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const getNextStatus = (currentStatus: string) => {
        // Restaurant only manages: Placed → Accepted → Preparing → Ready for Dispatch → Dispatched
        const flow = ['Placed', 'Accepted', 'Preparing', 'Ready for Dispatch', 'Dispatched'];
        const currentIndex = flow.indexOf(currentStatus);
        return currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;
    };

    const nextStatus = getNextStatus(order.order_status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
        >
            {/* Order Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(order.order_status)}`}>
                    {getStatusIcon(order.order_status)}
                    {order.order_status}
                </span>
            </div>

            {/* Customer Info */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-bold text-sm">C</span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Customer</p>
                        <p className="text-sm text-gray-500">{order.phone_number}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 ml-10">{order.delivery_address.street}, {order.delivery_address.city} - {order.delivery_address.pincode}</p>
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
                <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total ({order.payment_method})</span>
                    <span className="text-xl font-bold text-gray-900">₹{order.total_amount}</span>
                </div>
            </div>

            {/* Action Buttons - Restaurant only shows up to Dispatched */}
            {order.order_status !== 'Dispatched' && order.order_status !== 'Out for Delivery' && order.order_status !== 'Delivered' && order.order_status !== 'Cancelled' && (
                <div className="p-4 flex gap-3">
                    {order.order_status === 'Placed' ? (
                        <>
                            <button
                                onClick={() => onUpdateStatus(order.id, 'Accepted')}
                                className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <ChefHat size={18} />
                                Accept & Cook
                            </button>
                            <button
                                onClick={() => onUpdateStatus(order.id, 'Cancelled')}
                                className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-200"
                            >
                                <XCircle size={18} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => nextStatus && onUpdateStatus(order.id, nextStatus)}
                            disabled={!nextStatus}
                            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {nextStatus === 'Accepted' && <CheckCircle size={18} />}
                            {nextStatus === 'Preparing' && <ChefHat size={18} />}
                            {nextStatus === 'Ready for Dispatch' && <PackageCheck size={18} />}
                            {nextStatus === 'Dispatched' && <Truck size={18} />}
                            {nextStatus ? `Mark as ${nextStatus}` : 'Order Handed to Delivery'}
                        </button>
                    )}
                </div>
            )}
            {order.order_status === 'Dispatched' && (
                <div className="p-4 bg-blue-50 border-t border-blue-100">
                    <p className="text-sm text-blue-700 font-medium text-center mb-2">
                        <Truck size={16} className="inline mr-2" />
                        Order handed to delivery partner
                    </p>
                    {order.delivery_partner_name && (
                        <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User size={14} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">{order.delivery_partner_name}</p>
                                <p className="text-xs text-gray-500">{order.delivery_partner_vehicle || 'Delivery Partner'}</p>
                            </div>
                            {order.delivery_partner_phone && (
                                <a href={`tel:${order.delivery_partner_phone}`} className="text-blue-600 hover:text-blue-700">
                                    <Phone size={16} />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            )}
            {(order.order_status === 'Looking for Driver' || order.order_status === 'Assigned to Driver' || order.order_status === 'Out for Delivery') && (
                <div className="p-4 bg-indigo-50 border-t border-indigo-100">
                    <p className="text-sm text-indigo-700 font-medium text-center mb-2">
                        <Truck size={16} className="inline mr-2" />
                        {order.order_status === 'Looking for Driver' && 'Finding delivery partner...'}
                        {order.order_status === 'Assigned to Driver' && 'Driver assigned'}
                        {order.order_status === 'Out for Delivery' && 'Out for delivery'}
                    </p>
                    {order.delivery_partner_name && (
                        <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <User size={14} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">{order.delivery_partner_name}</p>
                                <p className="text-xs text-gray-500">{order.delivery_partner_vehicle || 'Delivery Partner'}</p>
                            </div>
                            {order.delivery_partner_phone && (
                                <a href={`tel:${order.delivery_partner_phone}`} className="text-indigo-600 hover:text-indigo-700">
                                    <Phone size={16} />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}

interface Restaurant {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        pincode: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    is_online: boolean;
    admin_feedback?: string;
}

interface FoodItem {
    id: string;
    name: string;
    category: string;
    base_image?: string;
    is_veg: boolean;
}

interface MenuItem {
    id: string;
    food_item_id: string;
    price: number;
    is_available: boolean;
    custom_image?: string;
    food_item: FoodItem;
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
    order_status: 'Placed' | 'Accepted' | 'Preparing' | 'Ready for Dispatch' | 'Dispatched' | 'Looking for Driver' | 'Assigned to Driver' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    payment_status: string;
    payment_method: string;
    phone_number: string;
    delivery_address: {
        street: string;
        city: string;
        pincode: string;
    };
    created_at: string;
    restaurant_name?: string;
    delivery_partner_name?: string;
    delivery_partner_phone?: string;
    delivery_partner_vehicle?: string;
}

export default function RestaurantDashboard() {
    const router = useRouter();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isToggling, setIsToggling] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [selectedFoodItem, setSelectedFoodItem] = useState('');
    const [price, setPrice] = useState('');
    const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('orders');

    useEffect(() => {
        fetchProfile();
        fetchMenu();
        fetchFoodItems();
        fetchOrders();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/restaurant/profile');
            if (res.status === 401) {
                router.push('/restaurant/login');
                return;
            }
            const data = await res.json();
            if (data.success) {
                setRestaurant(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch profile');
        }
    };

    const fetchMenu = async () => {
        try {
            const res = await fetch('/api/restaurant/menu');
            if (res.ok) {
                const data = await res.json();
                setMenuItems(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch menu');
        } finally {
            setLoading(false);
        }
    };

    const fetchFoodItems = async () => {
        try {
            const res = await fetch('/api/admin/food-items');
            if (res.ok) {
                const data = await res.json();
                setFoodItems(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch food items');
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/restaurant/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch orders');
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/restaurant/order-status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });

            if (res.ok) {
                toast.success(`Order status updated to ${newStatus}`);
                fetchOrders();
            } else {
                toast.error('Failed to update order status');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const toggleOnlineStatus = async () => {
        if (!restaurant) return;
        
        setIsToggling(true);
        try {
            const res = await fetch('/api/restaurant/toggle-status', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isOnline: !restaurant.is_online })
            });

            const data = await res.json();
            if (data.success) {
                setRestaurant(prev => prev ? { ...prev, is_online: !prev.is_online } : null);
                toast.success(`Restaurant is now ${!restaurant.is_online ? 'online' : 'offline'}`);
            } else {
                toast.error(data.error || 'Failed to toggle status');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsToggling(false);
        }
    };

    const addMenuItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFoodItem || !price) {
            toast.error('Please select a food item and enter price');
            return;
        }

        try {
            const res = await fetch('/api/restaurant/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    foodItemId: selectedFoodItem,
                    price: parseInt(price),
                    isAvailable: true
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Menu item added successfully');
                setShowAddMenu(false);
                setSelectedFoodItem('');
                setPrice('');
                fetchMenu();
            } else {
                toast.error(data.error || 'Failed to add menu item');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const removeMenuItem = async (menuItemId: string) => {
        if (!confirm('Are you sure you want to remove this item?')) return;

        try {
            const res = await fetch(`/api/restaurant/menu?id=${menuItemId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success('Menu item removed');
                fetchMenu();
            } else {
                toast.error('Failed to remove menu item');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const logout = () => {
        document.cookie = 'restaurant_token=; path=/; max-age=0;';
        router.push('/restaurant/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Failed to load restaurant data</p>
            </div>
        );
    }

    // Filter out food items already in menu
    const availableFoodItems = foodItems.filter(
        fi => !menuItems.some(mi => mi.food_item_id === fi.id)
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center px-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
                            <Store size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">{restaurant.name}</h1>
                            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Restaurant Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                            View Site
                        </Link>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-red-500 font-bold text-sm px-4 py-2 transition-colors border border-gray-200 hover:border-red-200 rounded-lg"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {/* Status Alert */}
                {restaurant.status === 'pending' && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
                        <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-bold text-yellow-800">Pending Approval</h3>
                            <p className="text-sm text-yellow-700">Your restaurant is under review. You'll be notified once approved.</p>
                        </div>
                    </div>
                )}

                {restaurant.status === 'rejected' && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-bold text-red-800">Registration Rejected</h3>
                            <p className="text-sm text-red-700">{restaurant.admin_feedback || 'Your registration was rejected. Please contact support.'}</p>
                        </div>
                    </div>
                )}

                {/* Online/Offline Toggle */}
                {restaurant.status === 'approved' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${restaurant.is_online ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    <Power size={28} className={restaurant.is_online ? 'text-green-600' : 'text-gray-400'} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Restaurant Status</h2>
                                    <p className={`text-sm font-medium ${restaurant.is_online ? 'text-green-600' : 'text-gray-500'}`}>
                                        {restaurant.is_online ? 'Currently Online - Visible to customers' : 'Currently Offline - Hidden from customers'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleOnlineStatus}
                                disabled={isToggling}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                                    restaurant.is_online 
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                                }`}
                            >
                                {isToggling ? 'Updating...' : restaurant.is_online ? 'Go Offline' : 'Go Online'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Tabs */}
                <div className="mb-6 flex gap-4">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            activeTab === 'orders'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Package size={20} />
                            Orders ({orders.filter(o => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled').length})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            activeTab === 'menu'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Utensils size={20} />
                            Menu ({menuItems.length})
                        </div>
                    </button>
                </div>

                {/* Orders Section */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <Package size={24} className="text-emerald-600" />
                                <h2 className="text-xl font-bold text-gray-900">Incoming Orders</h2>
                            </div>
                        </div>

                        <div className="p-6">
                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package size={48} className="text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                                    <p className="text-gray-500">Orders will appear here when customers place them</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {orders.map((order) => (
                                        <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Menu Management */}
                {activeTab === 'menu' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Utensils size={24} className="text-emerald-600" />
                            <h2 className="text-xl font-bold text-gray-900">Menu Management</h2>
                        </div>
                        {restaurant.status === 'approved' && (
                            <button
                                onClick={() => setShowAddMenu(!showAddMenu)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                            >
                                <Plus size={18} />
                                Add Item
                            </button>
                        )}
                    </div>

                    {/* Add Menu Item Form */}
                    {showAddMenu && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="bg-gray-50 p-6 border-b border-gray-100"
                        >
                            <form onSubmit={addMenuItem} className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Food Item</label>
                                    <select
                                        value={selectedFoodItem}
                                        onChange={(e) => setSelectedFoodItem(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        required
                                    >
                                        <option value="">Choose an item...</option>
                                        {availableFoodItems.map(item => (
                                            <option key={item.id} value={item.id}>
                                                {item.name} ({item.category}) {item.is_veg ? '🟢' : '🔴'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-32">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            min="1"
                                            required
                                            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddMenu(false)}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Menu Items List */}
                    <div className="p-6">
                        {menuItems.length === 0 ? (
                            <div className="text-center py-12">
                                <Utensils size={48} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No menu items yet</h3>
                                <p className="text-gray-500">Add items from our catalog to start selling</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {menuItems.map((item) => (
                                    <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                            {item.food_item?.base_image && (
                                                <img 
                                                    src={item.food_item.base_image} 
                                                    alt={item.food_item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 truncate">{item.food_item?.name}</h4>
                                            <p className="text-sm text-gray-500">{item.food_item?.category}</p>
                                            <p className="text-lg font-bold text-emerald-600">₹{item.price}</p>
                                        </div>
                                        <button
                                            onClick={() => removeMenuItem(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                )}

                {/* Restaurant Info */}
                <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurant Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-gray-500">Email</label>
                            <p className="font-medium text-gray-900">{restaurant.email}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-500">Phone</label>
                            <p className="font-medium text-gray-900">{restaurant.phone}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm text-gray-500">Address</label>
                            <p className="font-medium text-gray-900">
                                {restaurant.address.street}, {restaurant.address.city} - {restaurant.address.pincode}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
