"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Save, X, MapPin, Phone, Mail, User, Lock, Camera } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading, updateProfile } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
            landmark: ""
        }
    });

    const [avatar, setAvatar] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    // Fetch profile data
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/");
            return;
        }

        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address ? {
                    street: user.address.street || "",
                    city: user.address.city || "",
                    state: user.address.state || "",
                    pincode: user.address.pincode || "",
                    landmark: user.address.landmark || ""
                } : {
                    street: "",
                    city: "",
                    state: "",
                    pincode: "",
                    landmark: ""
                }
            });
            setAvatar((user as any).avatar || null);
            setAvatarPreview((user as any).avatar || null);
        }
    }, [user, isAuthenticated, isLoading, router]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        // Validate file type
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            toast.error("Only JPEG, PNG, and WebP images are allowed");
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setAvatarPreview(base64);
            setAvatar(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate password change
            if (showPasswordFields) {
                if (!oldPassword || !newPassword || !confirmPassword) {
                    toast.error("Please fill all password fields");
                    setLoading(false);
                    return;
                }
                if (newPassword !== confirmPassword) {
                    toast.error("New passwords do not match");
                    setLoading(false);
                    return;
                }
                if (newPassword.length < 6) {
                    toast.error("Password must be at least 6 characters");
                    setLoading(false);
                    return;
                }
            }

            const payload: any = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                avatar
            };

            if (showPasswordFields) {
                payload.oldPassword = oldPassword;
                payload.newPassword = newPassword;
            }

            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Profile updated successfully!");
                updateProfile(data.user);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setShowPasswordFields(false);
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-green"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-mint-whisper via-white to-emerald-green/5 py-12 sm:py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-green/10 overflow-hidden border border-emerald-green/10">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-green to-dark-evergreen p-6 sm:p-8 text-white">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                            My Profile
                        </h1>
                        <p className="text-emerald-green/20">Manage your account information</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-emerald-green/10 border-4 border-white shadow-lg">
                                    {avatarPreview ? (
                                        <Image
                                            src={avatarPreview}
                                            alt="Avatar"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-emerald-dark">
                                            {formData.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-green rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-dark-evergreen transition-colors"
                                >
                                    <Camera size={20} className="text-white" />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">Click camera to upload (Max 2MB)</p>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-emerald-dark mb-2">
                                    <User size={16} className="inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-emerald-dark mb-2">
                                    <Mail size={16} className="inline mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-emerald-dark mb-2">
                                    <Phone size={16} className="inline mr-2" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-bold text-emerald-dark mb-4 flex items-center gap-2">
                                <MapPin size={20} />
                                Delivery Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <input
                                        type="text"
                                        placeholder="Street Address"
                                        value={formData.address.street}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            address: { ...formData.address, street: e.target.value }
                                        })}
                                        className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={formData.address.city}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: { ...formData.address, city: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={formData.address.state}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: { ...formData.address, state: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                />
                                <input
                                    type="text"
                                    placeholder="Pincode"
                                    value={formData.address.pincode}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: { ...formData.address, pincode: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                />
                                <input
                                    type="text"
                                    placeholder="Landmark (Optional)"
                                    value={formData.address.landmark}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: { ...formData.address, landmark: e.target.value }
                                    })}
                                    className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                />
                            </div>
                        </div>

                        {/* Password Change */}
                        <div className="border-t border-gray-200 pt-6">
                            <button
                                type="button"
                                onClick={() => setShowPasswordFields(!showPasswordFields)}
                                className="flex items-center gap-2 text-emerald-green font-bold hover:text-dark-evergreen transition-colors mb-4"
                            >
                                <Lock size={18} />
                                {showPasswordFields ? "Cancel Password Change" : "Change Password"}
                            </button>

                            {showPasswordFields && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                    />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3.5 min-h-[44px] bg-gradient-to-r from-emerald-green to-dark-evergreen text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-green/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation text-base"
                            >
                                <Save size={20} />
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3.5 min-h-[44px] border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 touch-manipulation text-base"
                            >
                                <X size={20} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
