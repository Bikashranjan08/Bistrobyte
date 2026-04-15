// ============================================
// Seed Mock Restaurants with Menu Items
// ============================================

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Read from .env.local file
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mock Restaurants Data
const mockRestaurants = [
    {
        name: "Spice Garden",
        email: "spicegarden@example.com",
        phone: "+91 98765 43210",
        address: {
            street: "123 Main Street, Koramangala",
            city: "Bangalore",
            pincode: "560034",
            landmark: "Near Forum Mall"
        },
        licenseUrl: "https://example.com/license1.pdf",
        status: "approved",
        isOnline: true,
        password: "restaurant123",
        menuItems: [
            { foodName: "Paneer Butter Masala", price: 220 },
            { foodName: "Veg Biryani", price: 180 },
            { foodName: "Butter Naan", price: 35 },
            { foodName: "Dal Makhani", price: 160 },
            { foodName: "Chicken Biryani", price: 280 },
            { foodName: "Mushroom Chilli", price: 180 },
            { foodName: "Veg Manchow Soup", price: 80 },
            { foodName: "Ghee Rice", price: 140 }
        ]
    },
    {
        name: "Royal Kitchen",
        email: "royalkitchen@example.com",
        phone: "+91 98765 43211",
        address: {
            street: "456 Park Avenue, Indiranagar",
            city: "Bangalore",
            pincode: "560038",
            landmark: "Near 100 Feet Road"
        },
        licenseUrl: "https://example.com/license2.pdf",
        status: "approved",
        isOnline: true,
        password: "restaurant123",
        menuItems: [
            { foodName: "Paneer Butter Masala", price: 250 },
            { foodName: "Veg Biryani", price: 200 },
            { foodName: "Butter Naan", price: 40 },
            { foodName: "Dal Makhani", price: 180 },
            { foodName: "Chicken Biryani", price: 320 },
            { foodName: "Mutton Rogan Josh", price: 380 },
            { foodName: "Palak Paneer", price: 200 },
            { foodName: "Veg Noodles", price: 120 }
        ]
    },
    {
        name: "Biryani House",
        email: "biryanihouse@example.com",
        phone: "+91 98765 43212",
        address: {
            street: "789 Food Street, Jayanagar",
            city: "Bangalore",
            pincode: "560041",
            landmark: "Near Jayanagar Metro"
        },
        licenseUrl: "https://example.com/license3.pdf",
        status: "approved",
        isOnline: true,
        password: "restaurant123",
        menuItems: [
            { foodName: "Veg Biryani", price: 150 },
            { foodName: "Chicken Biryani", price: 220 },
            { foodName: "Mutton Biryani", price: 350 },
            { foodName: "Egg Biryani", price: 180 },
            { foodName: "Paneer Biryani", price: 200 },
            { foodName: "Spl Veg Biryani", price: 180 },
            { foodName: "Kashmiri Pulao", price: 190 },
            { foodName: "Veg Pulao", price: 140 }
        ]
    },
    {
        name: "Chinese Wok",
        email: "chinesewok@example.com",
        phone: "+91 98765 43213",
        address: {
            street: "321 Chinatown, Whitefield",
            city: "Bangalore",
            pincode: "560066",
            landmark: "Near Phoenix Marketcity"
        },
        licenseUrl: "https://example.com/license4.pdf",
        status: "approved",
        isOnline: true,
        password: "restaurant123",
        menuItems: [
            { foodName: "Veg Manchow Soup", price: 70 },
            { foodName: "Veg Noodles", price: 100 },
            { foodName: "Veg Fried Rice", price: 120 },
            { foodName: "Paneer Chilli", price: 180 },
            { foodName: "Mushroom Chilli", price: 170 },
            { foodName: "Chicken Noodles", price: 150 },
            { foodName: "Chicken Fried Rice", price: 170 },
            { foodName: "Schezwan Noodles", price: 140 }
        ]
    },
    {
        name: "Punjabi Dhaba",
        email: "punjabidhaba@example.com",
        phone: "+91 98765 43214",
        address: {
            street: "555 Highway Road, Electronic City",
            city: "Bangalore",
            pincode: "560100",
            landmark: "Near Electronic City Phase 1"
        },
        licenseUrl: "https://example.com/license5.pdf",
        status: "approved",
        isOnline: true,
        password: "restaurant123",
        menuItems: [
            { foodName: "Paneer Butter Masala", price: 200 },
            { foodName: "Dal Makhani", price: 150 },
            { foodName: "Butter Naan", price: 30 },
            { foodName: "Garlic Naan", price: 50 },
            { foodName: "Palak Paneer", price: 180 },
            { foodName: "Paneer Tikka Masala", price: 220 },
            { foodName: "Malai Kofta", price: 190 },
            { foodName: "Mix Veg Curry", price: 130 }
        ]
    }
];

async function seedMockRestaurants() {
    console.log('Starting to seed mock restaurants...\n');
    
    let restaurantCount = 0;
    let menuItemCount = 0;
    let errorCount = 0;

    // Get all food items from database
    const { data: foodItems, error: foodError } = await supabase
        .from('food_items')
        .select('id, name');

    if (foodError) {
        console.error('Error fetching food items:', foodError.message);
        return;
    }

    const foodItemMap = new Map(foodItems.map(fi => [fi.name, fi.id]));

    for (const restaurantData of mockRestaurants) {
        try {
            console.log(`Creating restaurant: ${restaurantData.name}`);
            
            // Hash password
            const passwordHash = await bcrypt.hash(restaurantData.password, 10);
            
            // Create restaurant
            const { data: restaurant, error: restaurantError } = await supabase
                .from('restaurants')
                .insert({
                    name: restaurantData.name,
                    email: restaurantData.email,
                    phone: restaurantData.phone,
                    address: restaurantData.address,
                    license_url: restaurantData.licenseUrl,
                    status: restaurantData.status,
                    is_online: restaurantData.isOnline,
                    password_hash: passwordHash
                })
                .select()
                .single();

            if (restaurantError) {
                if (restaurantError.code === '23505') {
                    console.log(`  ⚠️  Restaurant ${restaurantData.name} already exists, skipping...`);
                    
                    // Get existing restaurant
                    const { data: existingRestaurant } = await supabase
                        .from('restaurants')
                        .select('id')
                        .eq('email', restaurantData.email)
                        .single();
                    
                    if (existingRestaurant) {
                        // Add menu items to existing restaurant
                        for (const menuItem of restaurantData.menuItems) {
                            const foodItemId = foodItemMap.get(menuItem.foodName);
                            if (!foodItemId) {
                                console.log(`    ⚠️  Food item not found: ${menuItem.foodName}`);
                                continue;
                            }

                            const { error: menuError } = await supabase
                                .from('restaurant_menu_items')
                                .insert({
                                    restaurant_id: existingRestaurant.id,
                                    food_item_id: foodItemId,
                                    price: menuItem.price,
                                    is_available: true
                                })
                                .select()
                                .single();

                            if (menuError) {
                                if (menuError.code === '23505') {
                                    console.log(`    ⚠️  Menu item already exists: ${menuItem.foodName}`);
                                } else {
                                    console.error(`    ❌ Error adding ${menuItem.foodName}:`, menuError.message);
                                    errorCount++;
                                }
                            } else {
                                console.log(`    ✅ Added: ${menuItem.foodName} - ₹${menuItem.price}`);
                                menuItemCount++;
                            }
                        }
                    }
                    continue;
                }
                console.error(`  ❌ Error creating restaurant:`, restaurantError.message);
                errorCount++;
                continue;
            }

            console.log(`  ✅ Restaurant created: ${restaurant.name} (ID: ${restaurant.id})`);
            restaurantCount++;

            // Add menu items
            for (const menuItem of restaurantData.menuItems) {
                const foodItemId = foodItemMap.get(menuItem.foodName);
                if (!foodItemId) {
                    console.log(`    ⚠️  Food item not found: ${menuItem.foodName}`);
                    continue;
                }

                const { error: menuError } = await supabase
                    .from('restaurant_menu_items')
                    .insert({
                        restaurant_id: restaurant.id,
                        food_item_id: foodItemId,
                        price: menuItem.price,
                        is_available: true
                    })
                    .select()
                    .single();

                if (menuError) {
                    console.error(`    ❌ Error adding ${menuItem.foodName}:`, menuError.message);
                    errorCount++;
                } else {
                    console.log(`    ✅ Added: ${menuItem.foodName} - ₹${menuItem.price}`);
                    menuItemCount++;
                }
            }

        } catch (error) {
            console.error(`  ❌ Exception:`, error.message);
            errorCount++;
        }
        console.log('');
    }

    console.log('========================================');
    console.log('Mock Restaurants Seeding Complete!');
    console.log(`✅ Restaurants created: ${restaurantCount}`);
    console.log(`✅ Menu items added: ${menuItemCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('========================================');
    console.log('\nLogin credentials for all restaurants:');
    console.log('Email: [restaurant-email]');
    console.log('Password: restaurant123');
}

// Run the seeding
seedMockRestaurants().catch(console.error);
