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

        const { orderId, foodRating, deliveryRating } = await req.json();

        if (!orderId) {
            return NextResponse.json(
                { message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Verify order belongs to user and is delivered
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        if (order.order_status !== 'Delivered') {
            return NextResponse.json(
                { message: 'Can only rate delivered orders' },
                { status: 400 }
            );
        }

        // Update ratings
        const updates: any = {};
        if (foodRating !== undefined) updates.food_rating = foodRating;
        if (deliveryRating !== undefined) updates.delivery_rating = deliveryRating;

        const { data: updatedOrder, error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', orderId)
            .select()
            .single();

        if (error) {
            console.error('Error updating rating:', error);
            return NextResponse.json(
                { message: 'Failed to update rating' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Error rating order:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
