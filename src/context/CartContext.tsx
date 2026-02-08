"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MenuItem } from "@/lib/menuData";

export interface CartItem extends MenuItem {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (itemName: string) => void;
    updateQuantity: (itemName: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("nilkanth-cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart data", e);
            }
        }
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem("nilkanth-cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: MenuItem) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.name === item.name);
            if (existing) {
                return prev.map((i) =>
                    i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemName: string) => {
        setCartItems((prev) => prev.filter((i) => i.name !== itemName));
    };

    const updateQuantity = (itemName: string, delta: number) => {
        setCartItems((prev) => {
            return prev.map((item) => {
                if (item.name === itemName) {
                    const newQty = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter((item) => item.quantity > 0);
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
