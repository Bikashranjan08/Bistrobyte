// ============================================
// Multi-Restaurant Marketplace Types
// ============================================

// Base Food Item - Centralized catalog of food items
export interface FoodItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  baseImage?: string;
  isVeg: boolean;
  createdAt?: string;
}

// Restaurant
export type RestaurantStatus = 'pending' | 'approved' | 'rejected';

export interface Restaurant {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  phone: string;
  email: string;
  licenseUrl?: string;
  status: RestaurantStatus;
  isOnline: boolean;
  passwordHash?: string;
  adminFeedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Restaurant Menu Item - Links restaurant to food item with custom price
export interface RestaurantMenuItem {
  id: string;
  restaurantId: string;
  foodItemId: string;
  price: number;
  isAvailable: boolean;
  customImage?: string;
  createdAt?: string;
  // Joined fields
  foodItem?: FoodItem;
  restaurant?: Restaurant;
}

// Extended Menu Item with Restaurant Info for display
export interface MenuItemWithRestaurants {
  foodItem: FoodItem;
  restaurants: {
    restaurant: Restaurant;
    menuItem: RestaurantMenuItem;
  }[];
  lowestPrice: number;
  highestPrice: number;
}

// Cart Item with Restaurant Info
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

// Delivery Partner
export type DeliveryPartnerStatus = 'pending' | 'approved' | 'rejected';

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicleType: 'bike' | 'scooter' | 'cycle' | 'car';
  licenseUrl?: string;
  status: DeliveryPartnerStatus;
  isAvailable: boolean;
  passwordHash?: string;
  adminFeedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Admin User
export type AdminRole = 'super_admin' | 'admin';

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  createdAt?: string;
}

// Order Types (Extended from existing)
export interface OrderItem {
  foodItemId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
}

export type OrderStatus = 'Placed' | 'Preparing' | 'OutForDelivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  deliveryAddress: {
    street: string;
    city: string;
    pincode: string;
    landmark?: string;
  };
  phoneNumber: string;
  paymentMethod: string;
  restaurantId?: string; // For single restaurant orders
  deliveryPartnerId?: string;
  createdAt: string;
  updatedAt?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Context Types
export interface RestaurantAuthState {
  restaurant: Restaurant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DeliveryAuthState {
  partner: DeliveryPartner | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
