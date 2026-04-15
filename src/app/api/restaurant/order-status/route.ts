import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('restaurant_token');

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Token contains the restaurant ID directly
        const restaurantId = token.value;

        // Verify restaurant exists
        const { data: restaurant, error: profileError } = await supabase
            .from('restaurants')
            .select('id')
            .eq('id', restaurantId)
            .single();

        if (profileError || !restaurant) {
            return NextResponse.json(
                { message: 'Restaurant not found' },
                { status: 404 }
            );
        }

        const { orderId, status } = await req.json();

        if (!orderId || !status) {
            return NextResponse.json(
                { message: 'Order ID and status are required' },
                { status: 400 }
            );
        }

        // Verify the order belongs to this restaurant
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('restaurant_id')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        if (order.restaurant_id !== restaurantId) {
            return NextResponse.json(
                { message: 'Unauthorized - Order does not belong to this restaurant' },
                { status: 403 }
            );
        }

        // Update order status
        const { data: updatedOrder, error } = await supabase
            .from('orders')
            .update({ order_status: status })
            .eq('id', orderId)
            .select()
            .single();

        if (error) {
            console.error('Error updating order status:', error);
            return NextResponse.json(
                { message: 'Failed to update order status' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
