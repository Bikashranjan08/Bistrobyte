"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (identifier: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("nilkanth-user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, []);

    const login = (identifier: string) => {
        // Mock login
        const isEmail = identifier.includes("@");
        const name = isEmail ? identifier.split("@")[0] : identifier;
        const newUser = { name, email: identifier }; // Storing identifier in email field for now
        setUser(newUser);
        localStorage.setItem("nilkanth-user", JSON.stringify(newUser));
        setIsModalOpen(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("nilkanth-user");
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isModalOpen, openModal, closeModal }}>
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
