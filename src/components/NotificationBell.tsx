"use client";

import { useState, useEffect } from 'react';
import { Bell, X, Check, Package, Truck, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    order_id?: string;
    created_at: string;
    is_read: boolean;
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    // Force re-render every 10 seconds to update timestamps
    const [, setTick] = useState(0);
    
    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 10 seconds
        const interval = setInterval(fetchNotifications, 10000);
        // Update timestamps every 10 seconds
        const tickInterval = setInterval(() => setTick(t => t + 1), 10000);
        return () => {
            clearInterval(interval);
            clearInterval(tickInterval);
        };
    }, []);

    const markAsRead = async (notificationId: string) => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId })
            });
            if (res.ok) {
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark as read');
        }
    };

    const markAllAsRead = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/notifications', {
                method: 'DELETE'
            });
            if (res.ok) {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to mark all as read');
        } finally {
            setLoading(false);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order_placed':
                return <Package size={18} className="text-blue-500" />;
            case 'order_update':
                return <Info size={18} className="text-orange-500" />;
            case 'delivery_assigned':
                return <Truck size={18} className="text-indigo-500" />;
            case 'delivery_rejected':
                return <AlertCircle size={18} className="text-red-500" />;
            case 'order_delivered':
                return <CheckCircle size={18} className="text-green-500" />;
            default:
                return <Info size={18} className="text-gray-500" />;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        
        // Calculate difference in milliseconds
        let diff = now.getTime() - date.getTime();
        
        // If the difference is negative (future date), show 'Just now'
        if (diff < 0) diff = 0;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (seconds < 10) return 'Just now';
        if (seconds < 60) return `${seconds}s ago`;
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        // For older notifications, show the actual date and time
        return date.toLocaleString('en-IN', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-dark-evergreen/60 hover:text-emerald-green hover:bg-emerald-green/5 transition-all duration-200"
                aria-label="Notifications"
            >
                <Bell size={20} strokeWidth={1.8} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        
                        {/* Notification Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        disabled={loading}
                                        className="text-xs text-emerald-green hover:text-emerald-dark font-medium flex items-center gap-1"
                                    >
                                        <Check size={14} />
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                                        <p className="text-sm">No new notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-gray-900">{notification.title}</p>
                                                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span 
                                                            className="text-xs text-gray-400 cursor-help" 
                                                            title={new Date(notification.created_at).toLocaleString('en-IN')}
                                                        >
                                                            {formatTime(notification.created_at)}
                                                        </span>
                                                        {notification.order_id && (
                                                            <Link
                                                                href={`/my-orders/${notification.order_id}`}
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="text-xs text-emerald-green hover:underline font-medium"
                                                            >
                                                                View Order
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all"
                                                >
                                                    <X size={14} className="text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                                    <Link
                                        href="/my-orders"
                                        onClick={() => setIsOpen(false)}
                                        className="text-sm text-emerald-green hover:text-emerald-dark font-medium"
                                    >
                                        View all orders
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
