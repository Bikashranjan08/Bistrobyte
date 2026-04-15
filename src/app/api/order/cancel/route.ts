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

        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json(
                { message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Fetch order
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

        // Check if order can be cancelled (only Placed or Accepted)
        if (order.order_status !== 'Placed' && order.order_status !== 'Accepted') {
            return NextResponse.json(
                { message: 'Order cannot be cancelled at this stage' },
                { status: 400 }
            );
        }

        // Check if within 1 minute window
        const orderTime = new Date(order.created_at).getTime();
        const now = Date.now();
        const elapsedSeconds = (now - orderTime) / 1000;

        if (elapsedSeconds > 60) {
            return NextResponse.json(
                { message: 'Cancel window has expired (1 minute limit)' },
                { status: 400 }
            );
        }

        // Update order status to Cancelled
        const { data: updatedOrder, error } = await supabase
            .from('orders')
            .update({ order_status: 'Cancelled' })
            .eq('id', orderId)
            .select()
            .single();

        if (error) {
            console.error('Error cancelling order:', error);
            return NextResponse.json(
                { message: 'Failed to cancel order' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Error cancelling order:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
