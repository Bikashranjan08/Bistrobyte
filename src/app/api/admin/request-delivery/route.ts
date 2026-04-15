import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

// POST: Send delivery request to all available partners
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

        const adminId = token.value;
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json(
                { message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Verify order exists and is ready for dispatch
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

        if (order.order_status !== 'Ready for Dispatch' && order.order_status !== 'Looking for Driver') {
            return NextResponse.json(
                { message: 'Order must be Ready for Dispatch before requesting delivery' },
                { status: 400 }
            );
        }

        // Fetch all available (online) delivery partners
        const { data: partners, error: partnersError } = await supabase
            .from('delivery_partners')
            .select('id, name, phone, vehicle_type')
            .eq('status', 'approved')
            .eq('is_available', true);

        if (partnersError) {
            console.error('Error fetching partners:', partnersError);
            return NextResponse.json(
                { message: 'Failed to fetch delivery partners' },
                { status: 500 }
            );
        }

        if (!partners || partners.length === 0) {
            return NextResponse.json(
                { message: 'No available delivery partners found' },
                { status: 400 }
            );
        }

        // Calculate incentive
        const deliveryIncentive = Math.floor(Math.random() * 21) + 30; // ₹30-50

        // Update order status to indicate we're looking for a driver
        await supabase
            .from('orders')
            .update({
                order_status: 'Looking for Driver',
                assigned_by: adminId,
                assigned_at: new Date().toISOString(),
                delivery_incentive: deliveryIncentive
            })
            .eq('id', orderId);

        // Create notifications for all available delivery partners
        const notifications = partners.map(partner => ({
            user_id: partner.id,
            type: 'delivery_request',
            title: 'New Delivery Request',
            message: `New delivery from ${order.restaurant_name} to ${order.delivery_address?.street}. Incentive: ₹${deliveryIncentive}. Tap to accept!`,
            order_id: orderId,
            is_read: false
        }));

        const { error: notifError } = await supabase.from('notifications').insert(notifications);
        
        if (notifError) {
            console.error('Error creating notifications:', notifError);
        }

        // Also create notification for customer
        await supabase.from('notifications').insert({
            user_id: order.user_id,
            type: 'order_update',
            title: 'Looking for Delivery Partner',
            message: `We're finding the best delivery partner for your order from ${order.restaurant_name}.`,
            order_id: orderId,
            is_read: false
        });

        return NextResponse.json({ 
            success: true, 
            message: `Delivery request sent to ${partners.length} available partners`,
            partnersCount: partners.length,
            incentive: deliveryIncentive,
            partnerIds: partners.map(p => p.id)
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
