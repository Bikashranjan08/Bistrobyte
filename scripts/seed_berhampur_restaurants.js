// ============================================
// Seed 10 Berhampur Restaurants + 10 Delivery Partners
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

// Berhampur Areas for realistic addresses
const berhampurAreas = [
    { area: "Lochapada", landmark: "Near Bus Stand" },
    { area: "Gandhinagar", landmark: "Opposite Market" },
    { area: "Engineering School Road", landmark: "Near College" },
    { area: "Anand Nagar", landmark: "Near Hospital" },
    { area: "Bada Bazar", landmark: "Main Market" },
    { area: "Khallikote College Road", landmark: "Near College" },
    { area: "Berhampur University Area", landmark: "University Campus" },
    { area: "Sivananda Nagar", landmark: "Near Temple" },
    { area: "Ashok Nagar", landmark: "Near Stadium" },
    { area: "Kamapalli", landmark: "Near Railway Station" }
];

// 10 Berhampur Restaurants
const berhampurRestaurants = [
    {
        name: "Berhampur Biryani House",
        email: "berhampurbiryani@example.com",
        phone: "+91 70086 11111",
        address: berhampurAreas[0],
        menuItems: [
            { foodName: "Chicken Biryani", price: 280 },
            { foodName: "Mutton Biryani", price: 380 },
            { foodName: "Veg Biryani", price: 180 },
            { foodName: "Egg Biryani", price: 200 },
            { foodName: "Paneer Biryani", price: 220 },
            { foodName: "Chicken 65", price: 180 },
            { foodName: "Veg Manchow Soup", price: 80 },
            { foodName: "Butter Naan", price: 40 }
        ]
    },
    {
        name: "Odisha Spice Kitchen",
        email: "odishaspice@example.com",
        phone: "+91 70086 22222",
        address: berhampurAreas[1],
        menuItems: [
            { foodName: "Paneer Butter Masala", price: 240 },
            { foodName: "Dal Makhani", price: 170 },
            { foodName: "Butter Naan", price: 35 },
            { foodName: "Veg Fried Rice", price: 140 },
            { foodName: "Chicken Butter Masala", price: 320 },
            { foodName: "Palak Paneer", price: 210 },
            { foodName: "Mix Veg Curry", price: 150 },
            { foodName: "Ghee Rice", price: 130 }
        ]
    },
    {
        name: "Ganjam Dhaba",
        email: "ganjamdhaba@example.com",
        phone: "+91 70086 33333",
        address: berhampurAreas[2],
        menuItems: [
            { foodName: "Chicken Chilli", price: 190 },
            { foodName: "Veg Noodles", price: 110 },
            { foodName: "Chicken Noodles", price: 160 },
            { foodName: "Paneer Chilli", price: 200 },
            { foodName: "Veg Manchow Soup", price: 70 },
            { foodName: "Schezwan Noodles", price: 130 },
            { foodName: "Mushroom Chilli", price: 180 },
            { foodName: "Chicken Fried Rice", price: 170 }
        ]
    },
    {
        name: "Royal Tandoor",
        email: "royaltandoor@example.com",
        phone: "+91 70086 44444",
        address: berhampurAreas[3],
        menuItems: [
            { foodName: "Paneer Tikka Masala", price: 260 },
            { foodName: "Butter Naan", price: 45 },
            { foodName: "Garlic Naan", price: 55 },
            { foodName: "Chicken Tikka", price: 280 },
            { foodName: "Malai Kofta", price: 220 },
            { foodName: "Dal Tadka", price: 140 },
            { foodName: "Paneer Lababdar", price: 250 },
            { foodName: "Roti", price: 20 }
        ]
    },
    {
        name: "Berhampur Chinese Corner",
        email: "berhampurchinese@example.com",
        phone: "+91 70086 55555",
        address: berhampurAreas[4],
        menuItems: [
            { foodName: "Veg Noodles", price: 100 },
            { foodName: "Chicken Noodles", price: 150 },
            { foodName: "Veg Fried Rice", price: 120 },
            { foodName: "Chicken Fried Rice", price: 170 },
            { foodName: "Paneer Chilli", price: 190 },
            { foodName: "Chicken Chilli", price: 180 },
            { foodName: "Veg Manchow Soup", price: 75 },
            { foodName: "Schezwan Fried Rice", price: 140 }
        ]
    },
    {
        name: "South Indian Express",
        email: "southindian@example.com",
        phone: "+91 70086 66666",
        address: berhampurAreas[5],
        menuItems: [
            { foodName: "Plain Dosa", price: 60 },
            { foodName: "Masala Dosa", price: 80 },
            { foodName: "Idli Sambar", price: 50 },
            { foodName: "Vada Sambar", price: 55 },
            { foodName: "Uttapam", price: 70 },
            { foodName: "Onion Dosa", price: 85 },
            { foodName: "Rava Dosa", price: 90 },
            { foodName: "Filter Coffee", price: 30 }
        ]
    },
    {
        name: "Berhampur Fast Food",
        email: "berhampurfastfood@example.com",
        phone: "+91 70086 77777",
        address: berhampurAreas[6],
        menuItems: [
            { foodName: "Veg Burger", price: 80 },
            { foodName: "Chicken Burger", price: 120 },
            { foodName: "French Fries", price: 70 },
            { foodName: "Veg Pizza", price: 150 },
            { foodName: "Chicken Pizza", price: 200 },
            { foodName: "Cold Drink", price: 40 },
            { foodName: "Veg Roll", price: 90 },
            { foodName: "Chicken Roll", price: 130 }
        ]
    },
    {
        name: "Maa Tarini Restaurant",
        email: "maatarini@example.com",
        phone: "+91 70086 88888",
        address: berhampurAreas[7],
        menuItems: [
            { foodName: "Veg Thali", price: 150 },
            { foodName: "Non-Veg Thali", price: 220 },
            { foodName: "Chicken Curry", price: 180 },
            { foodName: "Fish Curry", price: 200 },
            { foodName: "Dal Fry", price: 100 },
            { foodName: "Rice", price: 50 },
            { foodName: "Roti", price: 15 },
            { foodName: "Papad", price: 10 }
        ]
    },
    {
        name: "Berhampur Sweets & Snacks",
        email: "berhampursweets@example.com",
        phone: "+91 70086 99999",
        address: berhampurAreas[8],
        menuItems: [
            { foodName: "Samosa", price: 15 },
            { foodName: "Kachori", price: 15 },
            { foodName: "Jalebi", price: 40 },
            { foodName: "Rasgulla", price: 20 },
            { foodName: "Chaat", price: 50 },
            { foodName: "Pani Puri", price: 30 },
            { foodName: "Dahi Vada", price: 45 },
            { foodName: "Rabdi", price: 60 }
        ]
    },
    {
        name: "New Punjabi Dhaba",
        email: "punjabidhababam@example.com",
        phone: "+91 70086 00000",
        address: berhampurAreas[9],
        menuItems: [
            { foodName: "Paneer Butter Masala", price: 230 },
            { foodName: "Kadai Paneer", price: 240 },
            { foodName: "Butter Naan", price: 40 },
            { foodName: "Chicken Curry", price: 260 },
            { foodName: "Mutton Rogan Josh", price: 380 },
            { foodName: "Dal Makhani", price: 160 },
            { foodName: "Jeera Rice", price: 120 },
            { foodName: "Lassi", price: 50 }
        ]
    }
];

// 10 Delivery Partners
const deliveryPartners = [
    { name: "Ramesh Kumar", phone: "+91 70000 11111", email: "ramesh@delivery.com", vehicle_type: "bike" },
    { name: "Suresh Patnaik", phone: "+91 70000 22222", email: "suresh@delivery.com", vehicle_type: "bike" },
    { name: "Pradeep Das", phone: "+91 70000 33333", email: "pradeep@delivery.com", vehicle_type: "scooter" },
    { name: "Manoj Sahoo", phone: "+91 70000 44444", email: "manoj@delivery.com", vehicle_type: "bike" },
    { name: "Bikash Nayak", phone: "+91 70000 55555", email: "bikash@delivery.com", vehicle_type: "bike" },
    { name: "Sanjay Behera", phone: "+91 70000 66666", email: "sanjay@delivery.com", vehicle_type: "scooter" },
    { name: "Amit Panda", phone: "+91 70000 77777", email: "amit@delivery.com", vehicle_type: "bike" },
    { name: "Dinesh Rout", phone: "+91 70000 88888", email: "dinesh@delivery.com", vehicle_type: "bike" },
    { name: "Pritam Mohanty", phone: "+91 70000 99999", email: "pritam@delivery.com", vehicle_type: "scooter" },
    { name: "Gopal Swain", phone: "+91 70000 00000", email: "gopal@delivery.com", vehicle_type: "bike" }
];

async function seedData() {
    console.log('Starting to seed Berhampur restaurants and delivery partners...\n');
    
    let restaurantCount = 0;
    let menuItemCount = 0;
    let partnerCount = 0;

    // Get all food items from database
    const { data: foodItems, error: foodError } = await supabase
        .from('food_items')
        .select('id, name');

    if (foodError) {
        console.error('Error fetching food items:', foodError.message);
        return;
    }

    const foodItemMap = new Map(foodItems.map(fi => [fi.name, fi.id]));

    // Seed Restaurants
    console.log('=== SEEDING BERHAMPUR RESTAURANTS ===\n');
    
    for (const restaurantData of berhampurRestaurants) {
        try {
            console.log(`Creating: ${restaurantData.name}`);
            
            const passwordHash = await bcrypt.hash('restaurant123', 10);
            
            const { data: restaurant, error: restaurantError } = await supabase
                .from('restaurants')
                .insert({
                    name: restaurantData.name,
                    email: restaurantData.email,
                    phone: restaurantData.phone,
                    address: {
                        street: restaurantData.address.area,
                        city: "Berhampur",
                        pincode: "760001",
                        landmark: restaurantData.address.landmark
                    },
                    license_url: "https://example.com/license.pdf",
                    status: "approved",
                    is_online: true,
                    password_hash: passwordHash
                })
                .select()
                .single();

            if (restaurantError) {
                if (restaurantError.code === '23505') {
                    console.log(`  ⚠️  Already exists, skipping...`);
                    continue;
                }
                console.error(`  ❌ Error:`, restaurantError.message);
                continue;
            }

            console.log(`  ✅ Created: ${restaurant.name}`);
            restaurantCount++;

            // Add menu items
            for (const menuItem of restaurantData.menuItems) {
                const foodItemId = foodItemMap.get(menuItem.foodName);
                if (!foodItemId) {
                    console.log(`    ⚠️  Food not found: ${menuItem.foodName}`);
                    continue;
                }

                const { error: menuError } = await supabase
                    .from('restaurant_menu_items')
                    .insert({
                        restaurant_id: restaurant.id,
                        food_item_id: foodItemId,
                        price: menuItem.price,
                        is_available: true
                    });

                if (menuError && menuError.code !== '23505') {
                    console.error(`    ❌ Error adding ${menuItem.foodName}:`, menuError.message);
                } else {
                    console.log(`    ✅ ${menuItem.foodName} - ₹${menuItem.price}`);
                    menuItemCount++;
                }
            }
        } catch (error) {
            console.error(`  ❌ Exception:`, error.message);
        }
        console.log('');
    }

    // Seed Delivery Partners
    console.log('=== SEEDING DELIVERY PARTNERS ===\n');
    
    for (const partnerData of deliveryPartners) {
        try {
            console.log(`Creating: ${partnerData.name}`);
            
            const passwordHash = await bcrypt.hash('delivery123', 10);
            
            const { data: partner, error: partnerError } = await supabase
                .from('delivery_partners')
                .insert({
                    name: partnerData.name,
                    phone: partnerData.phone,
                    email: partnerData.email,
                    vehicle_type: partnerData.vehicle_type,
                    license_url: "https://example.com/license.pdf",
                    status: "approved",
                    is_available: true,
                    password_hash: passwordHash
                })
                .select()
                .single();

            if (partnerError) {
                if (partnerError.code === '23505') {
                    console.log(`  ⚠️  Already exists, skipping...`);
                    continue;
                }
                console.error(`  ❌ Error:`, partnerError.message);
                continue;
            }

            console.log(`  ✅ Created: ${partner.name} (${partner.vehicle_type})`);
            partnerCount++;
        } catch (error) {
            console.error(`  ❌ Exception:`, error.message);
        }
    }

    console.log('\n========================================');
    console.log('SEEDING COMPLETE!');
    console.log(`✅ Restaurants created: ${restaurantCount}`);
    console.log(`✅ Menu items added: ${menuItemCount}`);
    console.log(`✅ Delivery partners created: ${partnerCount}`);
    console.log('========================================');
    console.log('\n--- RESTAURANT LOGIN ---');
    console.log('Email: [restaurant-email]');
    console.log('Password: restaurant123');
    console.log('\n--- DELIVERY PARTNER LOGIN ---');
    console.log('Phone: [partner-phone]');
    console.log('Password: delivery123');
}

seedData().catch(console.error);
