import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

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
        const { items, totalAmount, deliveryAddress, phoneNumber } = await req.json();

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

        // Ensure all items have an itemId (use name as fallback for static menu items)
        const orderItems = items.map((item: any) => ({
            itemId: item.itemId || item.name, // Fallback to name if itemId is missing
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }));

        const { data: order, error } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: userId,
                    items: orderItems,
                    total_amount: totalAmount,
                    delivery_address: deliveryAddress,
                    phone_number: phoneNumber,
                    payment_method: 'COD',
                    payment_status: 'Pending',
                    order_status: 'Placed'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        // Map supabase result structure to frontend expectation (frontend expects _id instead of id)
        const mappedOrder = {
            ...order,
            _id: order.id,
            totalAmount: order.total_amount,
            deliveryAddress: order.delivery_address,
            phoneNumber: order.phone_number,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            orderStatus: order.order_status,
            createdAt: order.created_at
        };

        return NextResponse.json({ order: mappedOrder }, { status: 201 });

    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
