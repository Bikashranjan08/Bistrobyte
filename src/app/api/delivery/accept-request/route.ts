import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('delivery_token');

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const partnerId = token.value;
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json(
                { message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Verify partner exists and is approved
        const { data: partner, error: partnerError } = await supabase
            .from('delivery_partners')
            .select('id, status, is_available')
            .eq('id', partnerId)
            .single();

        if (partnerError || !partner) {
            return NextResponse.json(
                { message: 'Delivery partner not found' },
                { status: 404 }
            );
        }

        if (partner.status !== 'approved') {
            return NextResponse.json(
                { message: 'Partner not approved' },
                { status: 403 }
            );
        }

        // Fetch order and check if it's still available
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if order is still looking for a driver
        if (order.order_status !== 'Looking for Driver') {
            return NextResponse.json(
                { message: 'This order has already been assigned to another driver' },
                { status: 400 }
            );
        }

        // Try to assign this partner to the order (first come first served)
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({
                delivery_partner_id: partnerId,
                order_status: 'Assigned to Driver',
                delivery_status: 'Pending Acceptance'
            })
            .eq('id', orderId)
            .eq('order_status', 'Looking for Driver') // Only update if still looking
            .select()
            .single();

        if (updateError || !updatedOrder) {
            // Someone else got it first
            return NextResponse.json(
                { message: 'This order was just assigned to another driver. Try another order!' },
                { status: 409 }
            );
        }

        // Create notification for customer
        await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: 'order_update',
            title: 'Delivery Partner Found!',
            message: `A delivery partner has accepted your order from ${order.restaurant_name} and will pick it up soon.`,
            order_id: orderId
        });

        // Create notification for admin
        await supabase.from('notifications').insert({
            user_id: 'admin',
            type: 'delivery_assigned',
            title: 'Driver Assigned',
            message: `Order #${orderId.slice(-6)} has been assigned to a delivery partner.`,
            order_id: orderId
        });

        return NextResponse.json({ 
            success: true, 
            data: updatedOrder,
            message: 'You have successfully accepted this delivery!'
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
