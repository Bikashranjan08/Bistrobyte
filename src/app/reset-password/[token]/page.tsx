"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const params = useParams(); // useParams returns an object, we need to cast or access directly
    // Ideally reset-password/[token] means params.token
    // But since I'm creating /src/app/reset-password/[token]/page.tsx, params will have token.
    // Wait, the plan said /reset-password/page.tsx, but usually it's dynamic route.
    // I will place this file at src/app/reset-password/[token]/page.tsx

    // Actually, let's double check what I wrote in plan:
    // "src/app/reset-password/page.tsx - Page to enter new password. Parses token from URL."
    // It's cleaner to use a dynamic route: src/app/reset-password/[token]/page.tsx

    const token = params?.token as string;
    const router = useRouter();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Password reset successfully! Please login.");
                router.push('/'); // Redirect to home, user can open login modal
            } else {
                toast.error(data.message || "Failed to reset password");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-mint-whisper flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-emerald-green/10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-dark-evergreen mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Reset Password</h1>
                    <p className="text-emerald-dark/60">Enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <KeyRound size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="relative">
                            <KeyRound size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password" // Always hide confirm password? Or sync visibility? Let's keep it simple.
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-green focus:ring-1 focus:ring-emerald-green transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-dark-evergreen text-white font-bold rounded-xl hover:bg-emerald-green transition-colors shadow-lg shadow-emerald-green/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Resetting..." : "Set New Password"}
                    </button>

                    <div className="text-center">
                        <Link href="/" className="text-sm text-emerald-green font-bold hover:underline">
                            Back to Home
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
