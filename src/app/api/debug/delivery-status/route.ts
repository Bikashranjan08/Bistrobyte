import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Debug endpoint - remove in production
export async function GET() {
    try {
        // Get all delivery partners with their status
        const { data: partners, error: partnersError } = await supabase
            .from('delivery_partners')
            .select('id, name, phone, status, is_available, created_at');

        // Get approved and available partners
        const availablePartners = (partners || []).filter(p => p.status === 'approved' && p.is_available === true);

        // Get all delivery request notifications with is_read status
        const { data: notifications, error: notificationsError } = await supabase
            .from('notifications')
            .select('*')
            .eq('type', 'delivery_request')
            .order('created_at', { ascending: false })
            .limit(20);

        // Get unread delivery requests
        const unreadNotifications = (notifications || []).filter(n => n.is_read === false);

        // Get orders looking for driver
        const { data: ordersLooking, error: ordersError } = await supabase
            .from('orders')
            .select('id, order_status, restaurant_name, delivery_partner_id')
            .eq('order_status', 'Looking for Driver');

        return NextResponse.json({
            partners: {
                total: partners?.length || 0,
                approved: (partners || []).filter(p => p.status === 'approved').length,
                availableOnline: availablePartners.length,
                data: partners || [],
                error: partnersError?.message
            },
            notifications: {
                total: notifications?.length || 0,
                unread: unreadNotifications.length,
                unreadData: unreadNotifications,
                allData: notifications || [],
                error: notificationsError?.message
            },
            ordersLookingForDriver: {
                count: ordersLooking?.length || 0,
                data: ordersLooking || [],
                error: ordersError?.message
            },
            diagnosis: {
                partnersOnline: availablePartners.length > 0,
                hasUnreadNotifications: unreadNotifications.length > 0,
                hasOrdersLooking: (ordersLooking?.length || 0) > 0,
                issues: []
            }
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
