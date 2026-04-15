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

        // Get delivery partner ID from token
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

        // Fetch orders assigned to this delivery partner
        // Status can be: 'Assigned to Driver', 'Out for Delivery'
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('delivery_partner_id', partnerId)
            .in('order_status', ['Assigned to Driver', 'Out for Delivery', 'Dispatched'])
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            return NextResponse.json(
                { message: 'Failed to fetch orders' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
