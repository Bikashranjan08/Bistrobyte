import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

// GET: Fetch delivery requests for current delivery partner
export async function GET() {
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

        // Fetch unread delivery request notifications for this partner
        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', partnerId)
            .eq('type', 'delivery_request')
            .eq('is_read', false)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching delivery requests:', error);
            return NextResponse.json(
                { message: 'Failed to fetch delivery requests' },
                { status: 500 }
            );
        }

        // Filter out stale requests - only show requests for orders that are still "Looking for Driver"
        const validRequests = [];
        for (const notification of (notifications || [])) {
            const { data: order } = await supabase
                .from('orders')
                .select('order_status')
                .eq('id', notification.order_id)
                .single();
            
            if (order && order.order_status === 'Looking for Driver') {
                validRequests.push(notification);
            } else {
                // Mark stale notification as read
                await supabase
                    .from('notifications')
                    .update({ is_read: true })
                    .eq('id', notification.id);
            }
        }

        return NextResponse.json({
            success: true,
            requests: validRequests
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
