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
        const { orderId, reason } = await req.json();

        if (!orderId) {
            return NextResponse.json(
                { message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Verify order is assigned to this partner and pending acceptance
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('delivery_partner_id', partnerId)
            .single();

        if (orderError || !order) {
            return NextResponse.json(
                { message: 'Order not found or not assigned to you' },
                { status: 404 }
            );
        }

        if (order.order_status !== 'Assigned to Driver') {
            return NextResponse.json(
                { message: 'Order cannot be rejected at this stage' },
                { status: 400 }
            );
        }

        // Update order: remove assignment, increment rejection count, store reason
        const { data: updatedOrder, error } = await supabase
            .from('orders')
            .update({
                delivery_partner_id: null,
                order_status: 'Ready for Dispatch',
                delivery_status: null,
                rejection_count: (order.rejection_count || 0) + 1,
                rejection_reason: reason || 'No reason provided',
                assigned_by: null,
                assigned_at: null
            })
            .eq('id', orderId)
            .select()
            .single();

        if (error) {
            console.error('Error rejecting order:', error);
            return NextResponse.json(
                { message: 'Failed to reject order' },
                { status: 500 }
            );
        }

        // Create notification for admin
        await supabase.from('notifications').insert({
            user_id: 'admin',
            type: 'delivery_rejected',
            title: 'Delivery Rejected',
            message: `Delivery partner rejected order from ${order.restaurant_name}. Reason: ${reason || 'No reason provided'}`,
            order_id: orderId
        });

        return NextResponse.json({ 
            success: true, 
            data: updatedOrder,
            message: 'Order rejected successfully'
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
