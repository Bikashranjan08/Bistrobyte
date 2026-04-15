"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, Phone, MapPin, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RestaurantRegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        street: '',
        city: '',
        pincode: '',
        landmark: '',
        licenseUrl: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/restaurant/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        pincode: formData.pincode,
                        landmark: formData.landmark
                    },
                    licenseUrl: formData.licenseUrl
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Registration successful! Please wait for admin approval.');
                router.push('/restaurant/login');
            } else {
                toast.error(data.error || 'Registration failed');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Store size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                            Partner With Us
                        </h1>
                        <p className="text-emerald-100">Register your restaurant and start selling</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Restaurant Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Restaurant Name
                            </label>
                            <div className="relative">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Enter restaurant name"
                                />
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="restaurant@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Min 6 characters"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Confirm password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Restaurant Address
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                                <textarea
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                    rows={2}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                    placeholder="Street address"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="City"
                                />
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Pincode"
                                />
                            </div>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="Landmark (optional)"
                            />
                        </div>

                        {/* License URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                License Document URL
                            </label>
                            <div className="relative">
                                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="url"
                                    name="licenseUrl"
                                    value={formData.licenseUrl}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="https://example.com/license.pdf"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Upload your FSSAI license or business registration to a cloud storage and paste the URL
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Registering...
                                </span>
                            ) : (
                                'Register Restaurant'
                            )}
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-600">
                            Already registered?{' '}
                            <Link href="/restaurant/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                Login here
                            </Link>
                        </p>

                        {/* Back Link */}
                        <Link href="/" className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
