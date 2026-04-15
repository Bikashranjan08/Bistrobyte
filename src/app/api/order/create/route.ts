import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getRestaurantById, getRestaurantFullAddress } from '@/lib/menuData';

// Helper function to calculate dynamic delivery charge
function calculateDeliveryCharge(): number {
    const baseCharge = 40;
    const distanceFactor = Math.floor(Math.random() * 21); // ₹0-20 variance
    
    // Check if peak hours (12-2 PM or 7-10 PM)
    const hour = new Date().getHours();
    const isPeakHour = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 22);
    const peakHourMultiplier = isPeakHour ? 1.2 : 1.0;
    
    const deliveryCharge = Math.round((baseCharge + distanceFactor) * peakHourMultiplier);
    return deliveryCharge;
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Validate request body
        const { items, totalAmount, deliveryAddress, phoneNumber, paymentMethod, paymentId, paymentStatus } = await req.json();

        if (!items || items.length === 0) { 
            return NextResponse.json(
                { message: 'Cart is empty' },
                { status: 400 }
            );
        }

        // New validation for required fields
        if (!items || !totalAmount || !deliveryAddress || !phoneNumber) {
            return NextResponse.json({ message: "Missing required fields (items, total, address, phone)" }, { status: 400 });
        }

        // Validate Address fields
        const { street, city, state, pincode } = deliveryAddress;
        if (!street || !city || !state || !pincode) {
            return NextResponse.json({ message: "Incomplete address details" }, { status: 400 });
        }

        // Group items by restaurant
        const itemsByRestaurant = items.reduce((acc: any, item: any) => {
            const restaurantId = item.restaurantId || 'default';
            if (!acc[restaurantId]) {
                acc[restaurantId] = {
                    restaurantId: restaurantId,
                    restaurantName: item.restaurantName || 'BistroByte Kitchen',
                    items: [],
                    total: 0
                };
            }
            acc[restaurantId].items.push({
                itemId: item.foodItemId || item.name,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                restaurantId: item.restaurantId,
                restaurantName: item.restaurantName
            });
            acc[restaurantId].total += item.price * item.quantity;
            return acc;
        }, {});

        // Calculate dynamic delivery charge
        const deliveryCharge = calculateDeliveryCharge();
        
        // Fetch user details from Clerk
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const customerName = user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.firstName || user.username || 'Customer';
        
        // Create separate orders for each restaurant
        const createdOrders = [];
        for (const restaurantData of Object.values(itemsByRestaurant)) {
            const subtotal = (restaurantData as any).total;
            const tax = Math.round(subtotal * 0.05);
            const totalWithCharges = subtotal + tax + deliveryCharge;
            
            // Get restaurant details including address
            const restaurantId = (restaurantData as any).restaurantId;
            const restaurantInfo = getRestaurantById(restaurantId);
            
            const { data: order, error } = await supabase
                .from('orders')
                .insert([
                    {
                        user_id: userId,
                        customer_name: customerName,
                        items: (restaurantData as any).items,
                        total_amount: totalWithCharges,
                        delivery_charge: deliveryCharge,
                        delivery_address: deliveryAddress,
                        phone_number: phoneNumber,
                        payment_method: paymentMethod || 'COD',
                        payment_status: paymentStatus || 'Pending',
                        payment_id: paymentId || null,
                        order_status: 'Placed',
                        restaurant_id: restaurantId,
                        restaurant_name: (restaurantData as any).restaurantName,
                        restaurant_address: restaurantInfo?.address || 'LOCHAPADA, BERHAMPUR',
                        restaurant_city: restaurantInfo?.city || 'BERHAMPUR',
                        restaurant_state: restaurantInfo?.state || 'ODISHA',
                        restaurant_pincode: restaurantInfo?.pincode || '760001',
                        restaurant_latitude: restaurantInfo?.latitude || 19.3175,
                        restaurant_longitude: restaurantInfo?.longitude || 84.7950
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Supabase Error:', error);
                throw error;
            }
            createdOrders.push(order);
        }

        // Create notifications for user
        for (const order of createdOrders) {
            await supabase.from('notifications').insert({
                user_id: userId,
                type: 'order_placed',
                title: 'Order Placed Successfully',
                message: `Your order from ${order.restaurant_name} has been placed. Delivery charge: ₹${deliveryCharge}`,
                order_id: order.id
            });
        }

        // Map supabase result structure to frontend expectation
        const mappedOrders = createdOrders.map((order: any) => ({
            ...order,
            _id: order.id,
            totalAmount: order.total_amount,
            deliveryAddress: order.delivery_address,
            phoneNumber: order.phone_number,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            orderStatus: order.order_status,
            createdAt: order.created_at,
            deliveryCharge: order.delivery_charge
        }));

        return NextResponse.json({ orders: mappedOrders, deliveryCharge }, { status: 201 });

    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
