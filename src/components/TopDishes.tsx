"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Using a mix of assets and remote images for demonstration
const topDishes = [
    {
        id: 1,
        name: "Paneer Handi",
        price: 160,
        image: "/paneer-handi.png", // Local asset
        rating: 4.8,
        description: "Rich and creamy paneer curry cooked in a traditional clay pot.",
    },
    {
        id: 2,
        name: "Greek Salad",
        price: 120,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop",
        rating: 4.5,
        description: "Fresh vegetables with feta cheese and olive oil dressing.",
    },
    {
        id: 3,
        name: "Veg Salad",
        price: 180,
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop",
        rating: 4.2,
        description: "A healthy mix of seasonal greens and crunchy toppings.",
    },
    {
        id: 4,
        name: "Clover Salad",
        price: 160,
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=500&fit=crop",
        rating: 4.6,
        description: "Nutrient-rich salad with a zest of lemon and herbs.",
    },
];

export default function TopDishes() {
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

    const getItemQuantity = (name: string) => {
        const item = cartItems.find((i) => i.name === name);
        return item ? item.quantity : 0;
    };

    return (
        <section className="py-16 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-royal-amethyst/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold text-dark-evergreen">
                        Top dishes near you
                    </h2>
                </motion.div>

                <div className="flex overflow-x-auto pb-6 -mx-6 px-6 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 snap-x snap-mandatory scrollbar-hide">
                    {topDishes.map((dish, index) => {
                        const qty = getItemQuantity(dish.name);
                        return (
                            <motion.div
                                key={dish.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="min-w-[280px] snap-center group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-emerald-green/10 border border-gray-100 transition-all duration-300"
                            >
                                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50">
                                    <Image
                                        src={dish.image}
                                        alt={dish.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className="object-contain p-2 hover:scale-110 transition-transform duration-500"
                                    />
                                    {/* Action Button: Add or Quantity Control */}
                                    <div className="absolute bottom-3 right-3 shadow-lg">
                                        {qty === 0 ? (
                                            <button
                                                onClick={() => addToCart(dish)}
                                                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-dark-evergreen hover:bg-emerald-green hover:text-white transition-all transform hover:scale-105"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        ) : (
                                            <div className="flex items-center bg-emerald-green text-white rounded-full h-10 px-1 shadow-md">
                                                <button
                                                    onClick={() => updateQuantity(dish.name, -1)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-emerald-dark/20 rounded-l-full transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="font-bold text-sm w-4 text-center">{qty}</span>
                                                <button
                                                    onClick={() => updateQuantity(dish.name, 1)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-emerald-dark/20 rounded-r-full transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-dark-evergreen group-hover:text-emerald-green transition-colors">
                                            {dish.name}
                                        </h3>
                                        <div className="flex items-center gap-1">
                                            <span className="text-amber-400 text-sm">★</span>
                                            <span className="text-xs font-medium text-gray-500">{dish.rating}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 line-clamp-2 min-h-[2.5em]">
                                        {dish.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-lg font-bold text-emerald-green">
                                            &#8377;{dish.price}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
