"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    foodItemId: string;
    name: string;
    price: number;
    quantity: number;
    restaurantId: string;
    restaurantName: string;
    image: string;
    isVeg: boolean;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (foodItemId: string, restaurantId: string) => void;
    updateQuantity: (foodItemId: string, restaurantId: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    getCartItemsByRestaurant: () => { [restaurantId: string]: CartItem[] };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("bistrobyte-cart");
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
        localStorage.setItem("bistrobyte-cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        setCartItems((prev) => {
            // Check if item from same restaurant already exists
            const existing = prev.find((i) => i.foodItemId === item.foodItemId && i.restaurantId === item.restaurantId);
            if (existing) {
                return prev.map((i) =>
                    i.foodItemId === item.foodItemId && i.restaurantId === item.restaurantId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (foodItemId: string, restaurantId: string) => {
        setCartItems((prev) => prev.filter((i) => !(i.foodItemId === foodItemId && i.restaurantId === restaurantId)));
    };

    const updateQuantity = (foodItemId: string, restaurantId: string, delta: number) => {
        setCartItems((prev) => {
            return prev.map((item) => {
                if (item.foodItemId === foodItemId && item.restaurantId === restaurantId) {
                    const newQty = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter((item) => item.quantity > 0);
        });
    };

    const getCartItemsByRestaurant = () => {
        return cartItems.reduce((acc, item) => {
            if (!acc[item.restaurantId]) {
                acc[item.restaurantId] = [];
            }
            acc[item.restaurantId].push(item);
            return acc;
        }, {} as { [restaurantId: string]: CartItem[] });
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
                getCartItemsByRestaurant,
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
