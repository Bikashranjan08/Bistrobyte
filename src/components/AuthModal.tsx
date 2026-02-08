"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";

export default function AuthModal() {
    const { isModalOpen, closeModal, login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) login(email);
    };

    if (!isModalOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl z-10"
                >
                    {/* Close Button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 text-dark-evergreen/60 hover:text-dark-evergreen transition-colors z-20"
                    >
                        <X size={20} />
                    </button>

                    {/* Background Image/Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-mint-whisper to-emerald-green/10 z-0">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-10" />
                    </div>

                    <div className="relative z-10 p-8 pt-12">
                        {/* Toggle Switch */}
                        <div className="flex bg-emerald-green/5 rounded-full p-1 mb-8 shadow-inner max-w-[280px] mx-auto">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${isLogin
                                    ? "bg-emerald-green text-white shadow-md"
                                    : "text-emerald-dark/60 hover:text-emerald-dark"
                                    }`}
                                style={{ fontFamily: "var(--font-inter)" }}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${!isLogin
                                    ? "bg-royal-amethyst text-white shadow-md"
                                    : "text-emerald-dark/60 hover:text-emerald-dark"
                                    }`}
                                style={{ fontFamily: "var(--font-inter)" }}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Forms */}
                        <div className="min-h-[300px]">
                            <AnimatePresence mode="wait">
                                {isLogin ? (
                                    <motion.form
                                        key="login"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        onSubmit={handleLogin}
                                        className="flex flex-col gap-5"
                                    >
                                        {/* Method Selection Tabs */}
                                        <div className="flex p-1 bg-emerald-green/5 rounded-xl mb-2">
                                            <button
                                                type="button"
                                                onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
                                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${loginMethod === 'email' ? 'bg-white shadow-sm text-emerald-dark' : 'text-emerald-dark/50'}`}
                                            >
                                                Email
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
                                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${loginMethod === 'phone' ? 'bg-white shadow-sm text-emerald-dark' : 'text-emerald-dark/50'}`}
                                            >
                                                Phone
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Email Input */}
                                            {loginMethod === 'email' && (
                                                <div>
                                                    <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1.5 ml-1">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full px-5 py-3.5 bg-white/60 backdrop-blur-sm border border-emerald-green/10 rounded-2xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all placeholder:text-emerald-dark/30 font-medium text-dark-evergreen"
                                                        placeholder="hello@example.com"
                                                    />
                                                </div>
                                            )}

                                            {/* Phone Input */}
                                            {loginMethod === 'phone' && (
                                                <div>
                                                    <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1.5 ml-1">
                                                        Mobile Number
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-evergreen/60 font-medium">+91</span>
                                                        <input
                                                            type="tel"
                                                            required
                                                            value={email} // Using email state for phone as well to minimize refactoring
                                                            onChange={(e) => {
                                                                const val = e.target.value.replace(/\D/g, '');
                                                                if (val.length <= 10) setEmail(val);
                                                            }}
                                                            className="w-full pl-12 pr-5 py-3.5 bg-white/60 backdrop-blur-sm border border-emerald-green/10 rounded-2xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all placeholder:text-emerald-dark/30 font-medium text-dark-evergreen tracking-widest"
                                                            placeholder="98765 43210"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* OTP Input */}
                                            {loginMethod === 'phone' && otpSent && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="overflow-hidden"
                                                >
                                                    <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1.5 ml-1">
                                                        Enter OTP
                                                    </label>
                                                    <div className="flex gap-2">
                                                        {[0, 1, 2, 3].map((i) => (
                                                            <input
                                                                key={i}
                                                                type="text"
                                                                maxLength={1}
                                                                value={otp[i] || ""}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    const newOtp = otp.split('');
                                                                    newOtp[i] = val;
                                                                    setOtp(newOtp.join(''));
                                                                    if (val && i < 3) {
                                                                        const nextInput = e.target.parentElement?.querySelectorAll('input')[i + 1] as HTMLInputElement;
                                                                        if (nextInput) nextInput.focus();
                                                                    }
                                                                }}
                                                                className="w-full py-3.5 text-center bg-white/80 border border-emerald-green/20 rounded-xl focus:ring-2 focus:ring-emerald-green/30 outline-none font-bold text-xl text-dark-evergreen"
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-xs text-emerald-dark/50">Didn't receive code?</span>
                                                        <button type="button" className="text-xs font-bold text-emerald-green hover:text-emerald-dark">Resend</button>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Password Input (Only for Email) */}
                                            {loginMethod === 'email' && (
                                                <div>
                                                    <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                                                    <input
                                                        type="password"
                                                        className="w-full px-5 py-3.5 bg-white/60 backdrop-blur-sm border border-emerald-green/10 rounded-2xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all placeholder:text-emerald-dark/30 font-medium text-dark-evergreen"
                                                        placeholder="••••••••"
                                                    />
                                                    <div className="flex justify-end mt-1">
                                                        <a href="#" className="text-xs font-bold text-emerald-green hover:text-emerald-dark transition-colors">Forgot password?</a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="button" // Changed to button to prevent default form submission unless explicit
                                            onClick={(e) => {
                                                if (loginMethod === 'phone' && !otpSent) {
                                                    // Send OTP Logic
                                                    if (email.length < 10) return; // Simple validation
                                                    setOtpSent(true);
                                                } else {
                                                    handleLogin(e);
                                                }
                                            }}
                                            className="w-full py-4 bg-dark-evergreen text-white font-bold rounded-2xl shadow-lg shadow-emerald-green/20 hover:bg-emerald-green transition-all transform hover:-translate-y-1 active:scale-95 mt-2 flex items-center justify-center gap-2"
                                        >
                                            {loginMethod === 'phone' ? (otpSent ? "Verify & Login" : "Get OTP") : "Login to Continue"}
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.form
                                        key="signup"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        onSubmit={handleLogin}
                                        className="flex flex-col gap-4"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1.5 ml-1">First Name</label>
                                                <input type="text" className="w-full px-5 py-3.5 bg-white/60 backdrop-blur-sm border border-emerald-green/10 rounded-2xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1.5 ml-1">Last Name</label>
                                                <input type="text" className="w-full px-5 py-3.5 bg-white/60 backdrop-blur-sm border border-emerald-green/10 rounded-2xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-5 py-3.5 bg-white/60 backdrop-blur-sm border border-emerald-green/10 rounded-2xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1.5 ml-1">Phone</label>
                                            <input type="tel" className="w-full px-5 py-3.5 bg-white/60 backdrop-blur-sm border border-emerald-green/10 rounded-2xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all" placeholder="+91..." />
                                        </div>

                                        <button className="w-full py-4 bg-royal-amethyst text-white font-bold rounded-2xl shadow-lg shadow-royal-amethyst/20 hover:bg-purple-600 transition-all transform hover:-translate-y-1 active:scale-95 mt-2">
                                            Create Account
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
