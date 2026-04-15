export interface MenuItem {
  name: string;
  price: number;
  image?: string; // Optional image URL for specific items
  description?: string; // Optional description
}

export interface MenuCategory {
  id: string;
  title: string;
  emoji: string;
  items: MenuItem[];
}

// Restaurant data with addresses
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}

export const restaurants: Restaurant[] = [
  {
    id: "spice-garden",
    name: "Spice Garden",
    address: "LOCHAPADA, BERHAMPUR",
    city: "BERHAMPUR",
    state: "ODISHA",
    pincode: "760001",
    phone: "+91 9876543210",
    latitude: 19.3175,
    longitude: 84.7950
  },
  {
    id: "biryani-house",
    name: "Biryani House",
    address: "ASOKA ROAD, NEAR BUS STAND",
    city: "BERHAMPUR",
    state: "ODISHA",
    pincode: "760001",
    phone: "+91 9876543211",
    latitude: 19.3200,
    longitude: 84.8000
  },
  {
    id: "pizza-hut",
    name: "Pizza Hut",
    address: "GANJAM ROAD, OPPOSITE MEDICAL COLLEGE",
    city: "BERHAMPUR",
    state: "ODISHA",
    pincode: "760001",
    phone: "+91 9876543212",
    latitude: 19.3150,
    longitude: 84.7900
  },
  {
    id: "chinese-corner",
    name: "Chinese Corner",
    address: "ENGINEERING SCHOOL ROAD",
    city: "BERHAMPUR",
    state: "ODISHA",
    pincode: "760001",
    phone: "+91 9876543213",
    latitude: 19.3250,
    longitude: 84.8050
  }
];

// Helper function to get restaurant by ID
export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find(r => r.id === id);
}

// Helper function to get full address string
export function getRestaurantFullAddress(restaurant: Restaurant): string {
  return `${restaurant.address}, ${restaurant.city} ${restaurant.state}, ${restaurant.pincode}`;
}

export const menuData: MenuCategory[] = [
  {
    id: "soups",
    title: "Soups",
    emoji: "🍜",
    items: [
      { name: "Veg Manchow Soup", price: 70, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop", description: "Spicy and tangy soup with crunchy noodles" },
      { name: "Veg Hot N Sour Soup", price: 70, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
      { name: "Lemon Coriander Soup", price: 90, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop" },
      { name: "Noodles Soup", price: 90, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Malaysian Potato Soup", price: 90, image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop" },
      { name: "Cream of Tomato Soup", price: 90, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop" },
      { name: "Cream of Mushroom Soup", price: 90, image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop" },
      { name: "Mushroom Soup", price: 90, image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop" },
      { name: "BistroByte Spl Veg Soup", price: 100, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop" },
      { name: "Chicken Hot N Sour Soup", price: 90, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
      { name: "Chicken Sweet Corn Soup", price: 90, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "salads",
    title: "Salads & Sides",
    emoji: "🥗",
    items: [
      { name: "Green Salad", price: 50, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop" },
      { name: "Cucumber Salad", price: 50, image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop" },
      { name: "Onion Salad", price: 30, image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=400&fit=crop" },
      { name: "Mix Raita", price: 50, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop" },
      { name: "Masala Papad", price: 30, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop" },
      { name: "Fry Papad", price: 20, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop" },
      { name: "Roasted Masala Papad", price: 30, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop" },
      { name: "Plain Roasted Papad", price: 20, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "starters",
    title: "Starters",
    emoji: "🍢",
    items: [
      { name: "Veg Lollipop", price: 150, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Mushroom Pakoda", price: 160, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Mushroom Chilli", price: 160, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Mushroom Chatpata", price: 160, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Mushroom 65", price: 160, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Garlic Mushroom", price: 160, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Hot Garlic Mushroom", price: 160, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Mushroom Salt & Pepper", price: 180, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Shanghai Mushroom", price: 180, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Thai Mushroom", price: 180, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Singaporean Mushroom", price: 180, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Sesame Mushroom", price: 160, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Mushroom Stick", price: 160, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Mushroom Manchurian", price: 160, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Paneer Chilli", price: 160, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Chatpata", price: 160, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer 65", price: 160, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Garlic Paneer", price: 160, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Hot Garlic Paneer", price: 160, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Shanghai Paneer", price: 180, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Sesame Paneer", price: 180, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Thai Paneer", price: 180, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Stick", price: 160, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Manchurian", price: 160, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Salt & Pepper", price: 160, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Dragon Paneer", price: 180, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Kurkure", price: 160, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Devil Paneer", price: 180, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Popcorn", price: 160, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Fingers", price: 120, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Pakoda", price: 100, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Corn Salt & Pepper", price: 160, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Crispy Chilli Baby Corn", price: 160, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Baby Corn Manchurian", price: 120, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Honey Chilli Potato", price: 100, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Chicken Chilli", price: 200, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Chicken 65", price: 200, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Fish Tikka", price: 250, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "tandoori",
    title: "Tandoori",
    emoji: "🔥",
    items: [
      { name: "Paneer Tikka", price: 180, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Hariyali Paneer Tikka", price: 180, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Paneer Lasuni Kabab", price: 180, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Methi Paneer Tikka", price: 180, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Achari Paneer Tikka", price: 180, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Mushroom Tikka", price: 160, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Mushroom Lasuni Kabab", price: 160, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Veg Hara Bhara Kabab", price: 150, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Veg Shami Kabab", price: 150, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Tandoori Gobi", price: 100, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Tandoori Potato", price: 100, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "dal",
    title: "Dal",
    emoji: "🫕",
    items: [
      { name: "Dal Fry", price: 60, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" },
      { name: "Dal Tadka", price: 80, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" },
      { name: "Mix Dal", price: 80, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" },
      { name: "Dal Makhani", price: 80, image: "https://images.unsplash.com/photo-1585937427243-d250476d51c7?w=400&h=400&fit=crop" },
      { name: "Veg Tadka", price: 80, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" },
      { name: "Punjabi Dal Tadka", price: 100, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "main-course",
    title: "Main Course",
    emoji: "🍛",
    items: [
      { name: "Veg Lazez", price: 150, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Lajawab", price: 150, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Veg Punjabi Masala", price: 150, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Veg Pesawari", price: 150, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Veg Bhuna Masala", price: 150, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Veg Dewani Handi", price: 150, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Veg Manpasand", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Butter Masala", price: 180, image: "/paneer-handi.png" },
      { name: "Paneer Tikka Masala", price: 160, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Paneer Masala", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Lababdar", price: 160, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Paneer Korma", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Palak Paneer", price: 160, image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400&h=400&fit=crop" },
      { name: "Paneer Kaleji", price: 160, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Paneer Pasanda", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Maharaja", price: 180, image: "/paneer-handi.png" },
      { name: "Paneer Methi Chaman", price: 180, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Matar Paneer", price: 160, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Mushroom Butter Masala", price: 180, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mushroom Masala", price: 160, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Mushroom Kadai", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mushroom Handi", price: 160, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Mushroom Kolhapuri", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mushroom Hyderabadi", price: 160, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Matar Mushroom", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mushroom Punjabi Masala", price: 160, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Mushroom Lababdar", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Kadai", price: 160, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Paneer Handi", price: 160, image: "/paneer-handi.png" },
      { name: "Paneer Kolhapuri", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Hyderabadi", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Kaju Curry", price: 150, image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Kaju Masala", price: 150, image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Kaju Tomato Masala", price: 150, image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Khoya Kaju", price: 150, image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Kaju Paneer Masala", price: 160, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Malai Kofta", price: 160, image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Bahubali Kofta Curry", price: 160, image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Paneer Kofta Curry", price: 160, image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Kofta E Lazez", price: 160, image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Nargisi Kofta Curry", price: 160, image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Lasooni Kofta Curry", price: 160, image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Veg Kadai", price: 120, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Mix Veg Curry", price: 100, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Veg Handi", price: 120, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Veg Kolhapuri", price: 150, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Veg Makhani", price: 150, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Chicken Butter Masala", price: 280, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mutton Rogan Josh", price: 350, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Chicken Kolhapuri", price: 260, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "rice",
    title: "Rice",
    emoji: "🍚",
    items: [
      { name: "Plain Rice", price: 60, image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Curd Rice", price: 80, image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Lemon Rice", price: 80, image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Jeera Rice", price: 120, image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Ghee Rice", price: 120, image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Kaju Ghee Rice", price: 150, image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Tomato Rice", price: 120, image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Basmati Chawal Ka Mazaa", price: 180, image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "biryani",
    title: "Biryani",
    emoji: "🥘",
    items: [
      { name: "Veg Pulao", price: 150, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&h=400&fit=crop" },
      { name: "Kashmiri Pulao", price: 180, image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&h=400&fit=crop" },
      { name: "Veg Biryani", price: 160, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Spl Veg Biryani", price: 180, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Paneer Biryani", price: 180, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Mushroom Biryani", price: 180, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Chicken Biryani", price: 220, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Mutton Biryani", price: 320, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Egg Biryani", price: 180, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "noodles",
    title: "Noodles",
    emoji: "🍝",
    items: [
      { name: "Veg Noodles", price: 100, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Mix Veg Noodles", price: 130, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Paneer Noodles", price: 130, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Mushroom Noodles", price: 130, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Chilli Garlic Veg Noodles", price: 130, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Shanghai Noodles", price: 130, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Sesame Garlic Noodles", price: 130, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Singaporean Noodles", price: 130, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" },
      { name: "Schezwan Noodles", price: 130, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" },
      { name: "Triple Noodles", price: 150, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" },
      { name: "Chicken Noodles", price: 140, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Egg Noodles", price: 120, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "fried-rice",
    title: "Fried Rice",
    emoji: "🍳",
    items: [
      { name: "Veg Fried Rice", price: 120, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Mix Veg Fried Rice", price: 150, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Paneer Fried Rice", price: 150, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Mushroom Fried Rice", price: 150, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Chilli Garlic Fried Rice", price: 150, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Shanghai Fried Rice", price: 150, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Sesame Garlic Fried Rice", price: 150, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Singaporean Fried Rice", price: 150, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" },
      { name: "Schezwan Fried Rice", price: 150, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" },
      { name: "Chicken Fried Rice", price: 160, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Egg Fried Rice", price: 140, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "naan-roti",
    title: "Naan & Roti",
    emoji: "🫓",
    items: [
      { name: "Roti", price: 4, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Butter Naan", price: 30, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Garlic Naan", price: 50, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Masala Naan", price: 50, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Mint Naan", price: 30, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Methi Paratha", price: 50, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Butter Kulcha (Plain)", price: 30, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Masala Kulcha", price: 50, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Paneer Kulcha", price: 50, image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    emoji: "🍮",
    items: [
      { name: "Veg Custard", price: 50, image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop" },
      { name: "Rabdi", price: 50, image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop" },
      { name: "Rasmalai", price: 50, image: "https://images.unsplash.com/photo-1630409351218-e21a7ee31f33?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "cold-drinks",
    title: "Cold Drinks",
    emoji: "🥤",
    items: [
      { name: "Plain Cold Drink", price: 30, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop" },
      { name: "Masala Cold Drink", price: 50, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop" },
      { name: "Masala Soda", price: 50, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "non-veg",
    title: "Non-Veg",
    emoji: "🍗",
    items: [
      { name: "Chicken Chilli", price: 200, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Chicken 65", price: 200, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Fish Tikka", price: 250, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Chicken Butter Masala", price: 280, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mutton Rogan Josh", price: 350, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Chicken Kolhapuri", price: 260, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Chicken Biryani", price: 220, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Mutton Biryani", price: 320, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Egg Biryani", price: 180, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Chicken Hot N Sour Soup", price: 90, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
      { name: "Chicken Sweet Corn Soup", price: 90, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
      { name: "Chicken Noodles", price: 140, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Egg Noodles", price: 120, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Chicken Fried Rice", price: 160, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Egg Fried Rice", price: 140, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
    ],
  },
];

// Placeholder image URLs using food category-based SVG placeholders
export const categoryImages: Record<string, string> = {
  soups: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
  salads: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  starters: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
  tandoori: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
  dal: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
  "main-course": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
  rice: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=300&fit=crop",
  biryani: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
  noodles: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
  "fried-rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop",
  "naan-roti": "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop",
  desserts: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
  "cold-drinks": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop",
  "non-veg": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop",
};
