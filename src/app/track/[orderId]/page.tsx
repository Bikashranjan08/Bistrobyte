"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Store, Bike, Clock, Phone, Package } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LiveTrackingMap from '@/components/LiveTrackingMap';

interface Order {
    id: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total_amount: number;
    order_status: string;
    delivery_status?: string;
    restaurant_name: string;
    restaurant_id: string;
    delivery_partner_id?: string;
    phone_number: string;
    delivery_address: {
        street: string;
        city: string;
        pincode: string;
    };
    created_at: string;
}

interface RestaurantLocation {
    lat: number;
    lng: number;
}

// Berhampur restaurant coordinates (simulated)
const restaurantCoordinates: Record<string, RestaurantLocation> = {
    // Original 5 restaurants
    '8d1cf84-27fc-48e3-988b-45e77c6ffc2e': { lat: 19.3131, lng: 84.7935 }, // Spice Garden
    '527cb2f0-cc15-4883-8c62-d4fce02de259': { lat: 19.3150, lng: 84.7950 }, // Royal Kitchen
    '6c256e32-3fe5-4b46-aa7f-10559b4abc42': { lat: 19.3110, lng: 84.7910 }, // Biryani House
    '9fa8c609-ec3d-4538-bb50-3f95128077f7': { lat: 19.3170, lng: 84.7970 }, // Chinese Wok
    '409f716d-a2d6-4c1b-8b95-254b5f57b12c': { lat: 19.3090, lng: 84.7890 }, // Punjabi Dhaba
    // New Berhampur restaurants (will be populated dynamically)
};

export default function TrackOrderPage() {
    const params = useParams();
    const orderId = params.orderId as string;
    
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [driverInfo, setDriverInfo] = useState<{ name: string; phone: string } | null>(null);

    useEffect(() => {
        fetchOrderDetails();
        const interval = setInterval(fetchOrderDetails, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const res = await fetch(`/api/order/track?orderId=${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
                
                // Fetch driver info if assigned
                if (data.order.delivery_partner_id) {
                    fetchDriverInfo(data.order.delivery_partner_id);
                }
            } else {
                toast.error('Order not found');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDriverInfo = async (partnerId: string) => {
        try {
            const res = await fetch(`/api/delivery/partner-info?partnerId=${partnerId}`);
            if (res.ok) {
                const data = await res.json();
                setDriverInfo(data.data);
            }
        } catch (error) {
            console.error('Error fetching driver info:', error);
        }
    };

    const getStatusStep = (status: string, deliveryStatus?: string) => {
        const steps = [
            { key: 'Placed', label: 'Order Placed', icon: Package },
            { key: 'Accepted', label: 'Confirmed', icon: Store },
            { key: 'Preparing', label: 'Preparing', icon: Store },
            { key: 'Ready for Dispatch', label: 'Ready', icon: Package },
            { key: 'Dispatched', label: 'Dispatched', icon: Bike },
            { key: 'Out for Delivery', label: 'On the Way', icon: Bike },
            { key: 'Delivered', label: 'Delivered', icon: MapPin }
        ];

        let currentStep = steps.findIndex(s => s.key === status);
        if (status === 'Out for Delivery' && deliveryStatus) {
            currentStep = 5; // Show as on the way
        }

        return { steps, currentStep: Math.max(0, currentStep) };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Order not found</p>
                    <Link href="/my-orders" className="text-emerald-600 hover:underline mt-2 inline-block">
                        Back to My Orders
                    </Link>
                </div>
            </div>
        );
    }

    const { steps, currentStep } = getStatusStep(order.order_status, order.delivery_status);

    // Get restaurant location (use default Berhampur if not in map)
    const restaurantLocation = restaurantCoordinates[order.restaurant_id] || { lat: 19.3131, lng: 84.7935 };
    
    // Simulate delivery location (slightly offset from restaurant)
    const deliveryLocation = {
        lat: restaurantLocation.lat + 0.005,
        lng: restaurantLocation.lng + 0.005
    };

    const trackingData = {
        orderId: order.id,
        restaurantName: order.restaurant_name,
        restaurantLocation,
        deliveryLocation,
        status: order.order_status,
        deliveryStatus: order.delivery_status,
        estimatedTime: '25-30 min',
        driverName: driverInfo?.name,
        driverPhone: driverInfo?.phone
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
                <div className="container mx-auto max-w-4xl flex items-center gap-4">
                    <Link href="/my-orders" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Track Order</h1>
                        <p className="text-sm text-gray-500">Order #{order.id.slice(-6).toUpperCase()}</p>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto max-w-4xl p-4">
                {/* Status Timeline */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status</h2>
                    <div className="flex items-center justify-between">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = idx <= currentStep;
                            const isCurrent = idx === currentStep;
                            
                            return (
                                <div key={step.key} className="flex flex-col items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                        isActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className={`text-xs mt-2 text-center font-medium ${
                                        isActive ? 'text-emerald-600' : 'text-gray-400'
                                    }`}>
                                        {step.label}
                                    </span>
                                    {idx < steps.length - 1 && (
                                        <div className={`absolute h-0.5 w-full top-5 left-1/2 -z-10 ${
                                            idx < currentStep ? 'bg-emerald-600' : 'bg-gray-200'
                                        }`} style={{ width: '100%' }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Live Tracking Button */}
                {(order.order_status === 'Out for Delivery' || order.order_status === 'Dispatched') && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            <MapPin size={20} />
                            {showMap ? 'Hide Live Tracking' : 'View Live Tracking'}
                        </button>
                    </motion.div>
                )}

                {/* Live Tracking Map */}
                {showMap && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                    >
                        <LiveTrackingMap 
                            trackingData={trackingData}
                            onClose={() => setShowMap(false)}
                        />
                    </motion.div>
                )}

                {/* Order Details */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Order Details</h2>
                    
                    {/* Restaurant Info */}
                    <div className="flex items-start gap-3 mb-4 p-4 bg-orange-50 rounded-xl">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                            <Store size={20} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs text-orange-600 font-bold uppercase">Restaurant</p>
                            <p className="font-bold text-gray-900">{order.restaurant_name}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">{item.quantity}x</span>
                                    <span className="text-gray-900">{item.name}</span>
                                </div>
                                <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                        <span className="text-gray-500">Total</span>
                        <span className="text-xl font-bold text-gray-900">₹{order.total_amount}</span>
                    </div>
                </motion.div>

                {/* Delivery Address */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Address</h2>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <MapPin size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{order.delivery_address.street}</p>
                            <p className="text-gray-500">{order.delivery_address.city} - {order.delivery_address.pincode}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Phone size={14} className="text-gray-400" />
                                <span className="text-sm text-gray-600">{order.phone_number}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
