"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Truck } from "lucide-react";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (address: any) => void;
    initialPhone?: string;
    initialAddress?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        landmark?: string;
    };
}

export default function AddressModal({
    isOpen,
    onClose,
    onSubmit,
    initialPhone = "",
    initialAddress
}: AddressModalProps) {
    const [formData, setFormData] = useState({
        street: initialAddress?.street || "",
        city: initialAddress?.city || "",
        state: initialAddress?.state || "",
        pincode: initialAddress?.pincode || "",
        landmark: initialAddress?.landmark || "",
        phoneNumber: initialPhone,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md sm:max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-green/10"
                >
                    {/* Header */}
                    <div className="bg-emerald-green/5 p-6 border-b border-emerald-green/10 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-dark-evergreen flex items-center gap-2" style={{ fontFamily: "var(--font-playfair)" }}>
                                <Truck size={20} className="text-emerald-green" />
                                Delivery Details
                            </h3>
                            <p className="text-xs text-emerald-dark/60 mt-1">Where should we create this deliciousness?</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-emerald-dark/60">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-dark-evergreen uppercase tracking-wider mb-1.5 ml-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="10-digit Mobile Number"
                                        className="w-full px-4 py-3 bg-mint-whisper rounded-xl border border-emerald-green/10 focus:outline-none focus:border-emerald-green/50 focus:ring-1 focus:ring-emerald-green/50 text-dark-evergreen placeholder-emerald-dark/30 transition-all font-medium"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-dark-evergreen uppercase tracking-wider mb-1.5 ml-1">Street Address</label>
                                    <input
                                        required
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        placeholder="House No., Street Name"
                                        className="w-full px-4 py-3 bg-mint-whisper rounded-xl border border-emerald-green/10 focus:outline-none focus:border-emerald-green/50 focus:ring-1 focus:ring-emerald-green/50 text-dark-evergreen placeholder-emerald-dark/30 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-evergreen uppercase tracking-wider mb-1.5 ml-1">City</label>
                                    <input
                                        required
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="w-full px-4 py-3 bg-mint-whisper rounded-xl border border-emerald-green/10 focus:outline-none focus:border-emerald-green/50 focus:ring-1 focus:ring-emerald-green/50 text-dark-evergreen placeholder-emerald-dark/30 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-evergreen uppercase tracking-wider mb-1.5 ml-1">State</label>
                                    <input
                                        required
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        className="w-full px-4 py-3 bg-mint-whisper rounded-xl border border-emerald-green/10 focus:outline-none focus:border-emerald-green/50 focus:ring-1 focus:ring-emerald-green/50 text-dark-evergreen placeholder-emerald-dark/30 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-evergreen uppercase tracking-wider mb-1.5 ml-1">Pincode</label>
                                    <input
                                        required
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="560001"
                                        className="w-full px-4 py-3 bg-mint-whisper rounded-xl border border-emerald-green/10 focus:outline-none focus:border-emerald-green/50 focus:ring-1 focus:ring-emerald-green/50 text-dark-evergreen placeholder-emerald-dark/30 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-evergreen uppercase tracking-wider mb-1.5 ml-1">Landmark</label>
                                    <input
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleChange}
                                        placeholder="Optional"
                                        className="w-full px-4 py-3 bg-mint-whisper rounded-xl border border-emerald-green/10 focus:outline-none focus:border-emerald-green/50 focus:ring-1 focus:ring-emerald-green/50 text-dark-evergreen placeholder-emerald-dark/30 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 mt-2 bg-dark-evergreen hover:bg-emerald-green text-white font-bold rounded-xl shadow-lg shadow-emerald-green/20 hover:shadow-emerald-green/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span>Confirm Delivery Details</span>
                                <MapPin size={18} />
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
