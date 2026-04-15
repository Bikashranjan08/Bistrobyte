"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Check, X, Truck, ChefHat, Clock, MapPin, Phone, User, ReceiptText, Store, AlertCircle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import Image from 'next/image';

type TabType = 'orders' | 'restaurants' | 'foodItems';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    image: string;
    restaurantName?: string;
}

interface Order {
    _id: string;
    userId: string;
    customerName?: string;
    items: OrderItem[];
    totalAmount: number;
    orderStatus: 'Placed' | 'Preparing' | 'Ready for Dispatch' | 'Looking for Driver' | 'Assigned to Driver' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    deliveryAddress: {
        street: string;
        city: string;
        pincode: string;
        landmark?: string;
    };
    createdAt: string;
    phoneNumber: string;
    paymentMethod: string;
    restaurant_name?: string;
    delivery_partner_id?: string;
    delivery_partner_name?: string;
    delivery_partner_phone?: string;
    delivery_partner_vehicle?: string;
    delivery_incentive?: number;
    delivery_charge?: number;
}

interface DeliveryPartner {
    id: string;
    name: string;
    phone: string;
    vehicle_type: string;
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
    license_url?: string;
    status: 'pending' | 'approved' | 'rejected';
    is_online: boolean;
    admin_feedback?: string;
    created_at: string;
}

interface FoodItem {
    id: string;
    name: string;
    category: string;
    description?: string;
    base_image?: string;
    is_veg: boolean;
}

// Delivery Partner interface
interface DeliveryPartnerInfo {
    id: string;
    name: string;
    phone: string;
    vehicle_type: string;
    is_available: boolean;
}

// Assign Delivery Partner Component - Shows dropdown to select partner
function AssignDeliveryPartner({ order, onAssigned }: { order: Order; onAssigned: () => void }) {
    const [partners, setPartners] = useState<DeliveryPartnerInfo[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const res = await fetch('/api/admin/assign-delivery');
            if (res.ok) {
                const data = await res.json();
                setPartners(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch partners:', error);
        }
    };

    const assignPartner = async () => {
        if (!selectedPartner) {
            toast.error('Please select a delivery partner');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/assign-delivery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order._id, partnerId: selectedPartner })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                setShowDropdown(false);
                setSelectedPartner('');
                onAssigned();
            } else {
                toast.error(data.message || 'Failed to assign delivery partner');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const onlinePartners = partners.filter(p => p.is_available);
    const offlinePartners = partners.filter(p => !p.is_available);

    return (
        <div className="col-span-2">
            {!showDropdown ? (
                <button
                    onClick={() => setShowDropdown(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    <Truck size={18} /> Assign Delivery Partner
                </button>
            ) : (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">Select Delivery Partner</span>
                        <button 
                            onClick={() => { setShowDropdown(false); setSelectedPartner(''); }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    
                    <select
                        value={selectedPartner}
                        onChange={(e) => setSelectedPartner(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Select a partner --</option>
                        {onlinePartners.length > 0 && (
                            <optgroup label={`Online (${onlinePartners.length})`}>
                                {onlinePartners.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} - {p.vehicle_type} ({p.phone})
                                    </option>
                                ))}
                            </optgroup>
                        )}
                        {offlinePartners.length > 0 && (
                            <optgroup label={`Offline (${offlinePartners.length})`}>
                                {offlinePartners.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} - {p.vehicle_type} ({p.phone}) [Offline]
                                    </option>
                                ))}
                            </optgroup>
                        )}
                    </select>

                    {partners.length === 0 && (
                        <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                            No delivery partners available. Please add partners first.
                        </p>
                    )}

                    <button
                        onClick={assignPartner}
                        disabled={isLoading || !selectedPartner}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Assigning...
                            </>
                        ) : (
                            <>
                                <Check size={18} /> Confirm Assignment
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('orders');
    const [orders, setOrders] = useState<Order[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectFeedback, setRejectFeedback] = useState('');
    const [rejectingId, setRejectingId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
        fetchRestaurants();
        fetchFoodItems();
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

    const fetchRestaurants = async () => {
        try {
            const res = await fetch('/api/admin/restaurants');
            if (res.ok) {
                const data = await res.json();
                setRestaurants(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch restaurants");
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
            console.error("Failed to fetch food items");
        }
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
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

    const approveRestaurant = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/restaurants/${id}/approve`, {
                method: 'PUT'
            });
            if (res.ok) {
                toast.success('Restaurant approved successfully');
                fetchRestaurants();
            } else {
                toast.error('Failed to approve restaurant');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const rejectRestaurant = async (id: string) => {
        if (!rejectFeedback.trim()) {
            toast.error('Please provide feedback for rejection');
            return;
        }

        try {
            const res = await fetch(`/api/admin/restaurants/${id}/reject`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback: rejectFeedback })
            });
            if (res.ok) {
                toast.success('Restaurant rejected');
                setRejectingId(null);
                setRejectFeedback('');
                fetchRestaurants();
            } else {
                toast.error('Failed to reject restaurant');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Out for Delivery': return 'Out for Delivery';
            case 'Assigned to Driver': return 'Assigned to Driver';
            case 'Looking for Driver': return 'Finding Driver';
            case 'Ready for Dispatch': return 'Ready for Dispatch';
            case 'Placed': return 'New Order';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Placed': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
            case 'Preparing': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Ready for Dispatch': return 'bg-orange-50 text-orange-600 border-orange-200';
            case 'Looking for Driver': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'Assigned to Driver': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
            case 'Out for Delivery': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-200';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getRestaurantStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
                            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Admin Dashboard</p>
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

            {/* Tabs */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-2 mb-6">
                    {[
                        { id: 'orders', label: 'Orders', icon: ReceiptText },
                        { id: 'restaurants', label: 'Restaurants', icon: Store },
                        { id: 'foodItems', label: 'Food Items', icon: ChefHat },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {orders.map((order) => {
                            const itemTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                            const taxes = Math.round(itemTotal * 0.05);

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
                                                <p className="font-bold text-gray-900 text-sm">{order.customerName || "Customer"}</p>
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

                                    {/* Items List */}
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
                                                        <div>
                                                            <span className="font-medium text-gray-700 leading-tight pt-0.5">{item.name}</span>
                                                            {item.restaurantName && (
                                                                <p className="text-xs text-gray-400">from {item.restaurantName}</p>
                                                            )}
                                                        </div>
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
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Delivery Charge</span>
                                                <span>₹{order.delivery_charge || 40}</span>
                                            </div>
                                            {order.delivery_incentive && (
                                                <div className="flex justify-between text-xs text-indigo-600">
                                                    <span>Driver Incentive</span>
                                                    <span>₹{order.delivery_incentive}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer / Actions */}
                                    <div className="p-5 bg-white">
                                        <div className="flex justify-between items-center mb-5">
                                            <div>
                                                <span className="text-gray-500 text-xs uppercase tracking-wider font-bold block mb-0.5">Total &bull; {order.paymentMethod || 'COD'}</span>
                                                <span className="text-2xl font-black text-gray-900 tracking-tight">₹{order.totalAmount}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Admin only handles delivery assignment */}
                                            {(order.orderStatus === 'Placed' || order.orderStatus === 'Preparing') && (
                                                <div className="col-span-2 bg-gray-50 text-gray-500 py-3 rounded-xl font-bold text-sm text-center">
                                                    Waiting for restaurant to prepare...
                                                </div>
                                            )}
                                            {order.orderStatus === 'Ready for Dispatch' && (
                                                <AssignDeliveryPartner 
                                                    order={order} 
                                                    onAssigned={fetchOrders}
                                                />
                                            )}
                                            {order.orderStatus === 'Looking for Driver' && (
                                                <AssignDeliveryPartner 
                                                    order={order} 
                                                    onAssigned={fetchOrders}
                                                />
                                            )}
                                            {order.orderStatus === 'Assigned to Driver' && (
                                                <div className="col-span-2">
                                                    <div className="bg-indigo-50 text-indigo-700 py-3 rounded-xl font-bold text-sm text-center mb-2">
                                                        Driver assigned - waiting for pickup
                                                    </div>
                                                    {order.delivery_partner_name && (
                                                        <div className="bg-white border border-indigo-200 rounded-xl p-3 flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                                <Truck size={18} className="text-indigo-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-bold text-sm text-gray-900">{order.delivery_partner_name}</p>
                                                                <p className="text-xs text-gray-500">{order.delivery_partner_vehicle || 'Vehicle'}</p>
                                                            </div>
                                                            {order.delivery_partner_phone && (
                                                                <a href={`tel:${order.delivery_partner_phone}`} className="text-indigo-600 hover:text-indigo-700">
                                                                    <Phone size={18} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {order.orderStatus === 'Out for Delivery' && (
                                                <div className="col-span-2">
                                                    <div className="bg-purple-50 text-purple-700 py-3 rounded-xl font-bold text-sm text-center mb-2">
                                                        Out for delivery
                                                    </div>
                                                    {order.delivery_partner_name && (
                                                        <div className="bg-white border border-purple-200 rounded-xl p-3 flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                                <Truck size={18} className="text-purple-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-bold text-sm text-gray-900">{order.delivery_partner_name}</p>
                                                                <p className="text-xs text-gray-500">{order.delivery_partner_vehicle || 'Vehicle'}</p>
                                                            </div>
                                                            {order.delivery_partner_phone && (
                                                                <a href={`tel:${order.delivery_partner_phone}`} className="text-purple-600 hover:text-purple-700">
                                                                    <Phone size={18} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {order.orderStatus === 'Delivered' && (
                                                <div className="col-span-2 bg-green-50 text-green-700 py-3 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2">
                                                    <Check size={18} /> Delivered
                                                </div>
                                            )}
                                            {order.orderStatus === 'Cancelled' && (
                                                <div className="col-span-2 bg-red-50 text-red-700 py-3 rounded-xl font-bold text-sm text-center">
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
                )}

                {/* Restaurants Tab */}
                {activeTab === 'restaurants' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Restaurant Management</h2>
                            <p className="text-sm text-gray-500 mt-1">Approve or reject restaurant registrations</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {restaurants.map((restaurant) => (
                                <div key={restaurant.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold text-lg text-gray-900">{restaurant.name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRestaurantStatusColor(restaurant.status)}`}>
                                                    {restaurant.status}
                                                </span>
                                                {restaurant.is_online && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                        Online
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                <div>
                                                    <span className="text-gray-400">Email:</span> {restaurant.email}
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Phone:</span> {restaurant.phone}
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-gray-400">Address:</span> {restaurant.address.street}, {restaurant.address.city} - {restaurant.address.pincode}
                                                </div>
                                                {restaurant.license_url && (
                                                    <div className="col-span-2">
                                                        <a href={restaurant.license_url} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                                                            View License Document
                                                        </a>
                                                    </div>
                                                )}
                                                {restaurant.admin_feedback && (
                                                    <div className="col-span-2 bg-red-50 p-3 rounded-lg text-red-700 text-sm">
                                                        <span className="font-medium">Feedback:</span> {restaurant.admin_feedback}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {restaurant.status === 'pending' && (
                                            <div className="flex flex-col gap-2 ml-4">
                                                {rejectingId === restaurant.id ? (
                                                    <div className="flex flex-col gap-2">
                                                        <textarea
                                                            value={rejectFeedback}
                                                            onChange={(e) => setRejectFeedback(e.target.value)}
                                                            placeholder="Enter rejection reason..."
                                                            className="w-48 p-2 text-sm border border-gray-200 rounded-lg resize-none"
                                                            rows={2}
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => rejectRestaurant(restaurant.id)}
                                                                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setRejectingId(null);
                                                                    setRejectFeedback('');
                                                                }}
                                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => approveRestaurant(restaurant.id)}
                                                            className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                                                        >
                                                            <CheckCircle size={16} />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectingId(restaurant.id)}
                                                            className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors border border-red-200"
                                                        >
                                                            <XCircle size={16} />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {restaurants.length === 0 && (
                                <div className="py-16 text-center">
                                    <Store size={48} className="text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No restaurants yet</h3>
                                    <p className="text-gray-500">Restaurants will appear here once they register</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Food Items Tab */}
                {activeTab === 'foodItems' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Food Items Catalog</h2>
                                <p className="text-sm text-gray-500 mt-1">Base food items available for restaurants</p>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                {foodItems.length} items
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            {foodItems.map((item) => (
                                <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                        {item.base_image && (
                                            <img 
                                                src={item.base_image} 
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <span className="text-xs text-gray-400">{item.is_veg ? 'Veg' : 'Non-Veg'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {foodItems.length === 0 && (
                            <div className="py-16 text-center">
                                <ChefHat size={48} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No food items</h3>
                                <p className="text-gray-500">Run the seed script to populate food items</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
