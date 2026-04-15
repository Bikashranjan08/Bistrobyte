import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

// GET: Fetch available delivery partners
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token');

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch all approved delivery partners
        const { data: partners, error } = await supabase
            .from('delivery_partners')
            .select('id, name, phone, vehicle_type, is_available')
            .eq('status', 'approved')
            .order('name');

        if (error) {
            console.error('Error fetching partners:', error);
            return NextResponse.json(
                { message: 'Failed to fetch partners' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: partners });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST: Assign a specific delivery partner to an order
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token');

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { orderId, partnerId } = await req.json();

        if (!orderId || !partnerId) {
            return NextResponse.json(
                { message: 'Order ID and Partner ID are required' },
                { status: 400 }
            );
        }

        // Verify order exists and is ready for delivery assignment
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error('Order fetch error:', orderError);
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Allow assignment for orders in these statuses
        const allowedStatuses = ['Ready for Dispatch', 'Looking for Driver', 'Dispatched'];
        if (!allowedStatuses.includes(order.order_status)) {
            console.error('Order status not allowed:', order.order_status, 'Allowed:', allowedStatuses);
            return NextResponse.json(
                { message: `Order status is '${order.order_status}'. Must be Ready for Dispatch to assign a delivery partner.` },
                { status: 400 }
            );
        }

        // Verify delivery partner exists and is available
        const { data: partner, error: partnerError } = await supabase
            .from('delivery_partners')
            .select('id, name, phone, vehicle_type, status, is_available')
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
                { message: 'Delivery partner is not approved' },
                { status: 400 }
            );
        }

        // Calculate delivery incentive
        const deliveryIncentive = Math.floor(Math.random() * 21) + 30; // ₹30-50

        // Update order with assigned delivery partner
        const updateData: any = {
            order_status: 'Assigned to Driver',
            delivery_partner_id: partnerId,
            delivery_incentive: deliveryIncentive
        };

        const { error: updateError } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', orderId);

        if (updateError) {
            console.error('Error updating order:', updateError);
            console.error('Update payload:', updateData);
            return NextResponse.json(
                { message: `Failed to assign delivery partner: ${updateError.message || 'Database error'}` },
                { status: 500 }
            );
        }

        // Create notification for the delivery partner (non-blocking)
        try {
            await supabase.from('notifications').insert({
                user_id: partnerId,
                type: 'order_assigned',
                title: 'New Delivery Assigned',
                message: `You have been assigned to deliver order from ${order.restaurant_name} to ${order.delivery_address?.street}. Incentive: ₹${deliveryIncentive}.`,
                order_id: orderId,
                is_read: false
            });
        } catch (notifError) {
            console.error('Failed to create partner notification:', notifError);
        }

        // Create notification for customer (non-blocking)
        try {
            if (order.user_id) {
                await supabase.from('notifications').insert({
                    user_id: order.user_id,
                    type: 'order_update',
                    title: 'Delivery Partner Assigned',
                    message: `${partner.name} will deliver your order from ${order.restaurant_name}.`,
                    order_id: orderId,
                    is_read: false
                });
            }
        } catch (notifError) {
            console.error('Failed to create customer notification:', notifError);
        }

        // Mark any existing delivery_request notifications as read (non-blocking)
        try {
            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('order_id', orderId)
                .eq('type', 'delivery_request');
        } catch (notifError) {
            console.error('Failed to update notifications:', notifError);
        }

        return NextResponse.json({
            success: true,
            message: `Delivery assigned to ${partner.name}`,
            partner: {
                id: partner.id,
                name: partner.name,
                phone: partner.phone,
                vehicle_type: partner.vehicle_type
            },
            incentive: deliveryIncentive
        });
    } catch (error) {
        console.error('Error in assign-delivery:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        );
    }
}
