"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    name: string;
    email: string;
    phone?: string;
    phoneVerified?: boolean;
    avatar?: string;
    role?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        landmark?: string;
    };
}

interface AuthContextType {
    user: User | null;
    login: (token: string, userData: User) => void;
    signup: (token: string, userData: User) => void;
    logout: () => void;
    sendOtp: (phone: string) => Promise<{ success: boolean; message: string }>;
    verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; message: string; user?: User }>;
    updateProfile: (data: Partial<User>) => void; // Helper to update local state
    isAuthenticated: boolean;
    isLoading: boolean;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Auth check failed", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (token: string, userData: User) => {
        setUser(userData);
        setIsModalOpen(false);
        router.refresh();
    };

    const signup = (token: string, userData: User) => {
        setUser(userData);
        setIsModalOpen(false);
        router.refresh();
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const sendOtp = async (phone: string) => {
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });
            const data = await res.json();
            return { success: res.ok, message: data.message };
        } catch (error) {
            return { success: false, message: "Failed to send OTP" };
        }
    };

    const verifyOtp = async (phone: string, otp: string) => {
        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, otp }),
            });
            const data = await res.json();
            if (res.ok && data.user) {
                setUser(data.user);
                setIsModalOpen(false);
                router.refresh();
                return { success: true, message: "Login successful", user: data.user };
            }
            return { success: false, message: data.message || "Verification failed" };
        } catch (error) {
            return { success: false, message: "Failed to verify OTP" };
        }
    };

    const updateProfile = (data: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...data });
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout,
                sendOtp,
                verifyOtp,
                updateProfile,
                isAuthenticated: !!user,
                isLoading,
                isModalOpen,
                openModal,
                closeModal,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
