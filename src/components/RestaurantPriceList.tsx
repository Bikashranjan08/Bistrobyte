"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Store } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface RestaurantOption {
  restaurant: {
    id: string;
    name: string;
    address: {
      street: string;
      city: string;
    };
    phone: string;
    isOnline: boolean;
  };
  menuItem: {
    id: string;
    price: number;
    customImage?: string;
  };
}

interface RestaurantPriceListProps {
  foodItemId: string;
  foodItemName: string;
  foodItemImage: string;
  isVeg: boolean;
  restaurants: RestaurantOption[];
  lowestPrice: number | null;
}

export default function RestaurantPriceList({
  foodItemId,
  foodItemName,
  foodItemImage,
  isVeg,
  restaurants,
  lowestPrice,
}: RestaurantPriceListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToCart, cartItems } = useCart();

  const handleAddToCart = (restaurantOption: RestaurantOption) => {
    const { restaurant, menuItem } = restaurantOption;
    
    addToCart({
      foodItemId,
      name: foodItemName,
      price: menuItem.price,
      quantity: 1,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      image: menuItem.customImage || foodItemImage,
      isVeg,
    });

    toast.success(`Added ${foodItemName} from ${restaurant.name} to cart`);
  };

  const getItemQuantityInCart = (restaurantId: string) => {
    const item = cartItems.find(
      (i) => i.foodItemId === foodItemId && i.restaurantId === restaurantId
    );
    return item?.quantity || 0;
  };

  if (restaurants.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Price Preview */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 px-3 bg-emerald-green/5 hover:bg-emerald-green/10 rounded-xl transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-emerald-dark/70">
            {restaurants.length} restaurant{restaurants.length > 1 ? 's' : ''}
          </span>
          {lowestPrice && (
            <span className="text-xs font-bold text-emerald-green">
              Starting at ₹{lowestPrice}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-emerald-dark/50" />
        </motion.div>
      </button>

      {/* Expanded Restaurant List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {restaurants.map((option) => {
                const quantity = getItemQuantityInCart(option.restaurant.id);
                
                return (
                  <div
                    key={option.restaurant.id}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-green/10 hover:border-emerald-green/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-green/10 flex items-center justify-center flex-shrink-0">
                        <Store size={14} className="text-emerald-green" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-dark-evergreen truncate">
                          {option.restaurant.name}
                        </p>
                        <p className="text-xs text-emerald-dark/50 truncate">
                          {option.restaurant.address.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold text-dark-evergreen">
                        ₹{option.menuItem.price}
                      </span>
                      
                      {quantity > 0 ? (
                        <div className="flex items-center gap-1 bg-emerald-green rounded-lg px-2 py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle decrement via cart context
                            }}
                            className="text-white text-xs font-bold w-4"
                          >
                            -
                          </button>
                          <span className="text-white text-xs font-bold w-4 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(option);
                            }}
                            className="text-white text-xs font-bold w-4"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(option);
                          }}
                          className="w-8 h-8 min-w-[32px] flex items-center justify-center rounded-full bg-emerald-green text-white hover:bg-emerald-dark hover:scale-110 active:scale-95 transition-all shadow-md"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
