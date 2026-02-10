"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, User, ChefHat, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call the API route to set the cookie securely
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            // Simulate slight delay for UX
            setTimeout(() => {
                if (res.ok) {
                    toast.success("Welcome, Chef!", { duration: 2000 });
                    router.push('/admin/dashboard');
                    router.refresh(); // Ensure middleware picks up the new cookie
                } else {
                    toast.error(data.message || "Invalid Credentials", { description: "Please check your Admin ID and Password." });
                    setLoading(false);
                }
            }, 800);
        } catch (error) {
            toast.error("Login Failed", { description: "Please try again later." });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#022C22] flex items-center justify-center p-4">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-800/20 rounded-full blur-[80px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
            </div>

            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-emerald-800/80 to-emerald-900/80 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent)]" />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner"
                        >
                            <ChefHat size={32} className="text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Admin Portal</h1>
                        <p className="text-emerald-100/70 text-sm font-medium">Kitchen Command Center</p>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative group"
                                >
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200/50 group-focus-within:text-emerald-400 transition-colors">
                                        <User size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Admin ID"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-black/20 text-white placeholder-white/30 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-black/30 transition-all"
                                        required
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="relative group"
                                >
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200/50 group-focus-within:text-emerald-400 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-black/20 text-white placeholder-white/30 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-black/30 transition-all"
                                        required
                                    />
                                </motion.div>
                            </div>

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#022C22] font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-[#022C22] border-t-transparent rounded-full animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    "Access Dashboard"
                                )}
                            </motion.button>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-6 text-center"
                        >
                            <Link href="/" className="inline-flex items-center gap-2 text-emerald-200/40 hover:text-emerald-200 text-sm transition-colors group">
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Kitchen
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Security Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 flex justify-center gap-4 text-[10px] text-white/20 font-mono tracking-widest uppercase"
                >
                    <span className="flex items-center gap-1"><Lock size={10} /> Secure Area</span>
                    <span>•</span>
                    <span>Authorized Personnel Only</span>
                </motion.div>
            </motion.div>
        </div>
    );
}
