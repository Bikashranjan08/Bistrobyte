"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function AuthSlider() {
    const [isLogin, setIsLogin] = useState(true);
    const { user, login, logout, isAuthenticated } = useAuth();
    const [email, setEmail] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) login(email);
    };

    if (isAuthenticated && user) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-emerald-green/5 border border-emerald-green/10 text-center">
                <div className="w-20 h-20 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👤</span>
                </div>
                <h3 className="text-xl font-bold text-dark-evergreen mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    Welcome, {user.name}!
                </h3>
                <p className="text-emerald-dark/60 mb-6" style={{ fontFamily: "var(--font-inter)" }}>
                    You are logged in and ready to order.
                </p>
                <button
                    onClick={logout}
                    className="px-6 py-2 border border-emerald-green/20 text-emerald-dark rounded-full hover:bg-emerald-green/5 transition-colors font-medium text-sm"
                >
                    Logout
                </button>
            </div>
        )
    }

    return (
        <div className="relative w-full max-w-md mx-auto aspect-[4/5] sm:aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-green/10">
            {/* Background Image/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-mint-whisper to-emerald-green/10 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-10" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-8">
                {/* Toggle Header */}
                <div className="flex bg-emerald-green/5 rounded-full p-1 mb-8 self-center shadow-inner">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isLogin
                                ? "bg-emerald-green text-white shadow-md"
                                : "text-emerald-dark/60 hover:text-emerald-dark"
                            }`}
                        style={{ fontFamily: "var(--font-inter)" }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${!isLogin
                                ? "bg-royal-amethyst text-white shadow-md"
                                : "text-emerald-dark/60 hover:text-emerald-dark"
                            }`}
                        style={{ fontFamily: "var(--font-inter)" }}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Forms Container */}
                <div className="relative flex-1">
                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleLogin}
                                className="flex flex-col gap-4 h-full"
                            >
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-emerald-green/10 rounded-xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all"
                                            placeholder="hello@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1">Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-emerald-green/10 rounded-xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <a href="#" className="text-xs font-medium text-emerald-green hover:underline">Forgot password?</a>
                                    </div>
                                </div>

                                <button className="w-full py-3.5 bg-dark-evergreen text-white font-bold rounded-xl shadow-lg shadow-emerald-green/20 hover:bg-emerald-green transition-all transform hover:-translate-y-1 active:scale-95">
                                    Login
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="signup"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleLogin}
                                className="flex flex-col gap-4 h-full"
                            >
                                <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1">First Name</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-emerald-green/10 rounded-xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1">Last Name</label>
                                            <input type="text" className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-emerald-green/10 rounded-xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-emerald-green/10 rounded-xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-emerald-dark/60 uppercase tracking-wider mb-1">Phone Number</label>
                                        <input type="tel" className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-emerald-green/10 rounded-xl focus:ring-2 focus:ring-emerald-green/20 outline-none transition-all" placeholder="+91 99999 99999" />
                                    </div>
                                </div>

                                <button className="w-full py-3.5 bg-royal-amethyst text-white font-bold rounded-xl shadow-lg shadow-royal-amethyst/20 hover:bg-purple-600 transition-all transform hover:-translate-y-1 active:scale-95">
                                    Create Account
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
