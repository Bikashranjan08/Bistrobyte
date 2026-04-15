import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json(
                { message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Fetch order
        const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('user_id', userId)
            .single();

        if (error || !order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Map to frontend format
        const mappedOrder = {
            ...order,
            _id: order.id,
            totalAmount: order.total_amount,
            deliveryAddress: order.delivery_address,
            phoneNumber: order.phone_number,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            orderStatus: order.order_status,
            createdAt: order.created_at,
            restaurant_name: order.restaurant_name,
            restaurant_id: order.restaurant_id,
            deliveryCharge: order.delivery_charge
        };

        return NextResponse.json({ order: mappedOrder });
    } catch (error) {
        console.error('Error tracking order:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
