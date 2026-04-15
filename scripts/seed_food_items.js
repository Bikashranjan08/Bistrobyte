// ============================================
// Seed Food Items from Existing Menu Data
// Run this script once to populate the food_items table
// ============================================

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
// Read from .env.local file
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Existing menu data from menuData.ts
const menuData = [
  {
    id: "soups",
    title: "Soups",
    emoji: "🍜",
    items: [
      { name: "Veg Manchow Soup", description: "Spicy and tangy soup with crunchy noodles", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop" },
      { name: "Veg Hot N Sour Soup", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
      { name: "Lemon Coriander Soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop" },
      { name: "Noodles Soup", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Malaysian Potato Soup", image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop" },
      { name: "Cream of Tomato Soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop" },
      { name: "Cream of Mushroom Soup", image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop" },
      { name: "Mushroom Soup", image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop" },
      { name: "BistroByte Spl Veg Soup", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop" },
      { name: "Chicken Hot N Sour Soup", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
      { name: "Chicken Sweet Corn Soup", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "salads",
    title: "Salads & Sides",
    emoji: "🥗",
    items: [
      { name: "Green Salad", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop" },
      { name: "Cucumber Salad", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop" },
      { name: "Onion Salad", image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=400&fit=crop" },
      { name: "Mix Raita", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop" },
      { name: "Masala Papad", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop" },
      { name: "Fry Papad", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop" },
      { name: "Roasted Masala Papad", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop" },
      { name: "Plain Roasted Papad", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "starters",
    title: "Starters",
    emoji: "🍢",
    items: [
      { name: "Veg Lollipop", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Mushroom Pakoda", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Mushroom Chilli", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Mushroom Chatpata", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Mushroom 65", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Garlic Mushroom", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Hot Garlic Mushroom", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Mushroom Salt & Pepper", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Shanghai Mushroom", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Thai Mushroom", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Singaporean Mushroom", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Sesame Mushroom", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop" },
      { name: "Mushroom Stick", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Mushroom Manchurian", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Paneer Chilli", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Chatpata", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer 65", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Garlic Paneer", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Hot Garlic Paneer", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Shanghai Paneer", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Sesame Paneer", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Thai Paneer", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Stick", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Manchurian", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Salt & Pepper", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Dragon Paneer", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Kurkure", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Devil Paneer", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Popcorn", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Fingers", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Paneer Pakoda", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Corn Salt & Pepper", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Crispy Chilli Baby Corn", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Baby Corn Manchurian", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Honey Chilli Potato", image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=400&fit=crop" },
      { name: "Chicken Chilli", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Chicken 65", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Fish Tikka", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "tandoori",
    title: "Tandoori",
    emoji: "🔥",
    items: [
      { name: "Paneer Tikka", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Hariyali Paneer Tikka", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Paneer Lasuni Kabab", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Methi Paneer Tikka", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Achari Paneer Tikka", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Mushroom Tikka", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Mushroom Lasuni Kabab", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Veg Hara Bhara Kabab", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Veg Shami Kabab", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Tandoori Gobi", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Tandoori Potato", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "dal",
    title: "Dal",
    emoji: "🫕",
    items: [
      { name: "Dal Fry", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" },
      { name: "Dal Tadka", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" },
      { name: "Mix Dal", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" },
      { name: "Dal Makhani", image: "https://images.unsplash.com/photo-1585937427243-d250476d51c7?w=400&h=400&fit=crop" },
      { name: "Veg Tadka", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" },
      { name: "Punjabi Dal Tadka", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "main-course",
    title: "Main Course",
    emoji: "🍛",
    items: [
      { name: "Veg Lazez", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Lajawab", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Veg Punjabi Masala", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Veg Pesawari", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Veg Bhuna Masala", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Veg Dewani Handi", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Veg Manpasand", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Butter Masala", image: "/paneer-handi.png" },
      { name: "Paneer Tikka Masala", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Paneer Masala", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Lababdar", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Paneer Korma", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Palak Paneer", image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400&h=400&fit=crop" },
      { name: "Paneer Kaleji", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Paneer Pasanda", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Maharaja", image: "/paneer-handi.png" },
      { name: "Paneer Methi Chaman", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Matar Paneer", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Mushroom Butter Masala", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mushroom Masala", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Mushroom Kadai", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mushroom Handi", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Mushroom Kolhapuri", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mushroom Hyderabadi", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Matar Mushroom", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mushroom Punjabi Masala", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Mushroom Lababdar", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Kadai", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Paneer Handi", image: "/paneer-handi.png" },
      { name: "Paneer Kolhapuri", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Paneer Hyderabadi", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Kaju Curry", image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Kaju Masala", image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Kaju Tomato Masala", image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Khoya Kaju", image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Kaju Paneer Masala", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Malai Kofta", image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Bahubali Kofta Curry", image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Paneer Kofta Curry", image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Kofta E Lazez", image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Nargisi Kofta Curry", image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Lasooni Kofta Curry", image: "https://images.unsplash.com/photo-1641864698573-03719000a6c0?w=400&h=400&fit=crop" },
      { name: "Veg Kadai", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Mix Veg Curry", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Veg Handi", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Veg Kolhapuri", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Veg Makhani", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop" },
      { name: "Chicken Butter Masala", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mutton Rogan Josh", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Chicken Kolhapuri", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "rice",
    title: "Rice",
    emoji: "🍚",
    items: [
      { name: "Plain Rice", image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Curd Rice", image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Lemon Rice", image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Jeera Rice", image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Ghee Rice", image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Kaju Ghee Rice", image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Tomato Rice", image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
      { name: "Basmati Chawal Ka Mazaa", image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "biryani",
    title: "Biryani",
    emoji: "🥘",
    items: [
      { name: "Veg Pulao", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&h=400&fit=crop" },
      { name: "Kashmiri Pulao", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&h=400&fit=crop" },
      { name: "Veg Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Spl Veg Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Paneer Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Mushroom Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Chicken Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Mutton Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Egg Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "noodles",
    title: "Noodles",
    emoji: "🍝",
    items: [
      { name: "Veg Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Mix Veg Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Paneer Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Mushroom Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Chilli Garlic Veg Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Shanghai Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Sesame Garlic Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Singaporean Noodles", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" },
      { name: "Schezwan Noodles", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" },
      { name: "Triple Noodles", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" },
      { name: "Chicken Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Egg Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "fried-rice",
    title: "Fried Rice",
    emoji: "🍳",
    items: [
      { name: "Veg Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Mix Veg Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Paneer Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Mushroom Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Chilli Garlic Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Shanghai Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Sesame Garlic Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Singaporean Fried Rice", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" },
      { name: "Schezwan Fried Rice", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop" },
      { name: "Chicken Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Egg Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "naan-roti",
    title: "Naan & Roti",
    emoji: "🫓",
    items: [
      { name: "Roti", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Butter Naan", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Garlic Naan", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Masala Naan", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Mint Naan", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Methi Paratha", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Butter Kulcha (Plain)", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Masala Kulcha", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
      { name: "Paneer Kulcha", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    emoji: "🍮",
    items: [
      { name: "Veg Custard", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop" },
      { name: "Rabdi", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop" },
      { name: "Rasmalai", image: "https://images.unsplash.com/photo-1630409351218-e21a7ee31f33?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "cold-drinks",
    title: "Cold Drinks",
    emoji: "🥤",
    items: [
      { name: "Plain Cold Drink", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop" },
      { name: "Masala Cold Drink", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop" },
      { name: "Masala Soda", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop" },
    ],
  },
  {
    id: "non-veg",
    title: "Non-Veg",
    emoji: "🍗",
    items: [
      { name: "Chicken Chilli", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Chicken 65", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop" },
      { name: "Fish Tikka", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop" },
      { name: "Chicken Butter Masala", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Mutton Rogan Josh", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Chicken Kolhapuri", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop" },
      { name: "Chicken Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Mutton Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Egg Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop" },
      { name: "Chicken Hot N Sour Soup", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
      { name: "Chicken Sweet Corn Soup", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
      { name: "Chicken Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Egg Noodles", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
      { name: "Chicken Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
      { name: "Egg Fried Rice", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop" },
    ],
  },
];

// Helper function to determine if item is vegetarian
function isVegetarian(name) {
  const nonVegKeywords = ['chicken', 'mutton', 'fish', 'egg', 'prawn', 'lamb', 'beef', 'pork'];
  const lowerName = name.toLowerCase();
  return !nonVegKeywords.some(keyword => lowerName.includes(keyword));
}

async function seedFoodItems() {
  console.log('Starting to seed food items...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const category of menuData) {
    console.log(`Processing category: ${category.title}`);
    
    for (const item of category.items) {
      try {
        const { data, error } = await supabase
          .from('food_items')
          .insert({
            name: item.name,
            category: category.title,
            description: item.description || null,
            base_image: item.image,
            is_veg: isVegetarian(item.name)
          })
          .select()
          .single();
        
        if (error) {
          // Check if it's a duplicate
          if (error.code === '23505') {
            console.log(`  ⚠️  Skipping duplicate: ${item.name}`);
          } else {
            console.error(`  ❌ Error inserting ${item.name}:`, error.message);
            errorCount++;
          }
        } else {
          console.log(`  ✅ Inserted: ${item.name}`);
          successCount++;
        }
      } catch (err) {
        console.error(`  ❌ Exception for ${item.name}:`, err.message);
        errorCount++;
      }
    }
    console.log('');
  }
  
  console.log('========================================');
  console.log('Seeding complete!');
  console.log(`✅ Successfully inserted: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('========================================');
}

// Run the seeding
seedFoodItems().catch(console.error);
