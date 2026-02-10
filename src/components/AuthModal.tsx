"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, KeyRound, User, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { GoogleLogin } from '@react-oauth/google';

export default function AuthModal() {
    const { isModalOpen, closeModal, login, signup, sendOtp, verifyOtp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [isForgotPassword, setIsForgotPassword] = useState(false); // New state for Forgot Password

    // Email Auth State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    // Phone Auth State
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setName("");
        setPhone("");
        setOtp("");
        setOtpSent(false);
        setLoading(false);
        setIsForgotPassword(false);
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = isLogin ? "/api/auth/login" : "/api/auth/signup";
            const body = isLogin ? { email, password } : { name, email, password, phone };

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (res.ok) {
                if (isLogin) login(data.token, data.user);
                else signup(data.token, data.user);
                toast.success(isLogin ? "Logged in successfully!" : "Account created successfully!");
                resetForm();
                closeModal(); // Close modal on success
            } else {
                toast.error(data.message || "Authentication failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Reset link sent!");
                setIsForgotPassword(false); // Optionally close or show success state
                closeModal();
            } else {
                toast.error(data.message || "Failed to send reset link");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) return toast.error("Invalid phone number");
        setLoading(true);
        const res = await sendOtp(phone);
        setLoading(false);
        if (res.success) {
            setOtpSent(true);
            toast.success("OTP Sent!");
        } else {
            toast.error(res.message);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await verifyOtp(phone, otp);
        setLoading(false);
        if (res.success) {
            toast.success("Logged in verified!");
            // Modal closes automatically via context update in verifyOtp, but we can double check
            closeModal();
            resetForm();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-0"
                        onClick={closeModal}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white rounded-none sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-md overflow-y-auto shadow-2xl relative z-10"
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10 touch-manipulation"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-dark-evergreen mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                                    {isForgotPassword ? "Reset Password" : (authMethod === 'phone' ? 'Phone Login' : (isLogin ? "Welcome Back" : "Create Account"))}
                                </h2>
                                <p className="text-emerald-dark/60">
                                    {isForgotPassword ? "Enter your email to receive a reset link" : (authMethod === 'phone' ? 'Enter your mobile number to continue' : (isLogin ? "Login to access your orders" : "Sign up for exclusive offers"))}
                                </p>
                            </div>

                            {/* Auth Method Toggle - Hide if Forgot Password */}
                            {!isForgotPassword && (
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                                    <button
                                        onClick={() => { setAuthMethod('email'); setIsLogin(true); resetForm(); }}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === 'email' ? 'bg-white shadow text-dark-evergreen' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Email
                                    </button>
                                    <button
                                        onClick={() => { setAuthMethod('phone'); resetForm(); }}
                                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === 'phone' ? 'bg-white shadow text-dark-evergreen' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Phone
                                    </button>
                                </div>
                            )}

                            {isForgotPassword ? (
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <div className="relative">
                                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-dark-evergreen text-white font-bold rounded-xl hover:bg-emerald-green transition-colors shadow-lg shadow-emerald-green/20"
                                    >
                                        {loading ? "Sending..." : "Send Reset Link"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotPassword(false)}
                                        className="w-full text-sm text-gray-500 hover:text-dark-evergreen font-bold"
                                    >
                                        Back to Login
                                    </button>
                                </form>
                            ) : authMethod === 'email' ? (
                                <form onSubmit={handleEmailAuth} className="space-y-4">
                                    {!isLogin && (
                                        <div className="relative">
                                            <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                                required={!isLogin}
                                            />
                                        </div>
                                    )}
                                    <div className="relative">
                                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                            required
                                        />
                                    </div>

                                    {!isLogin && (
                                        <div className="relative">
                                            <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                placeholder="Mobile Number (Optional)"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                            />
                                        </div>
                                    )}
                                    <div className="relative">
                                        <KeyRound size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                            required
                                        />
                                    </div>

                                    {isLogin && (
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setIsForgotPassword(true)}
                                                className="text-xs font-bold text-emerald-green hover:underline"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-dark-evergreen text-white font-bold rounded-xl hover:bg-emerald-green transition-colors shadow-lg shadow-emerald-green/20"
                                    >
                                        {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
                                    </button>
                                </form>
                            ) : (
                                /* PHONE AUTH FORM */
                                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                                    {!otpSent ? (
                                        <div className="relative">
                                            <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                placeholder="Mobile Number"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                                required
                                            />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <KeyRound size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Enter OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 min-h-[44px] bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all text-base"
                                                required
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-dark-evergreen text-white font-bold rounded-xl hover:bg-emerald-green transition-colors shadow-lg shadow-emerald-green/20"
                                    >
                                        {loading ? "Processing..." : (otpSent ? "Verify OTP" : "Send OTP")}
                                    </button>
                                    {otpSent && (
                                        <button
                                            type="button"
                                            onClick={() => setOtpSent(false)}
                                            className="w-full text-xs text-emerald-green font-bold hover:underline"
                                        >
                                            Change Number / Resend
                                        </button>
                                    )}
                                </form>
                            )}


                            {!isForgotPassword && (
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="h-px bg-gray-200 flex-1" />
                                    <span className="text-xs font-bold text-gray-400 uppercase">Or continue with</span>
                                    <div className="h-px bg-gray-200 flex-1" />
                                </div>
                            )}

                            {!isForgotPassword && (
                                <div className="mt-6">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            try {
                                                const res = await fetch('/api/auth/google', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ token: credentialResponse.credential }),
                                                });
                                                const data = await res.json();
                                                if (res.ok) {
                                                    if (isLogin) login(data.token, data.user);
                                                    else signup(data.token, data.user);
                                                    toast.success('Logged in with Google!');
                                                } else {
                                                    toast.error('Google Auth Failed');
                                                }
                                            } catch (err) {
                                                toast.error('Google Login Error');
                                            }
                                        }}
                                        onError={() => {
                                            toast.error('Login Failed');
                                        }}
                                        useOneTap
                                    />
                                </div>
                            )}

                            {!isForgotPassword && authMethod === 'email' && (
                                <p className="text-center mt-6 text-sm text-gray-500">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-emerald-green font-bold hover:underline"
                                    >
                                        {isLogin ? "Sign Up" : "Login"}
                                    </button>
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
