import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

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

        // Verify partner exists
        const { data: partner, error: partnerError } = await supabase
            .from('delivery_partners')
            .select('id')
            .eq('id', partnerId)
            .single();

        if (partnerError || !partner) {
            return NextResponse.json(
                { message: 'Delivery partner not found' },
                { status: 404 }
            );
        }

        // Fetch all completed deliveries for this partner
        const { data: orders, error } = await supabase
            .from('orders')
            .select('id, restaurant_name, delivery_address, delivery_incentive, created_at, delivery_status, order_status')
            .eq('delivery_partner_id', partnerId)
            .eq('delivery_status', 'Delivered')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching delivery history:', error);
            return NextResponse.json(
                { message: 'Failed to fetch delivery history' },
                { status: 500 }
            );
        }

        // Calculate total earnings
        const totalEarnings = (orders || []).reduce((sum, o) => sum + (o.delivery_incentive || 0), 0);

        return NextResponse.json({
            success: true,
            data: orders || [],
            totalEarnings,
            totalDeliveries: orders?.length || 0
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
