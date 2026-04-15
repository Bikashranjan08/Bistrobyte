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
            .select('id, status')
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

        // Update order to assign delivery partner and set status
        const { data: order, error } = await supabase
            .from('orders')
            .update({
                delivery_partner_id: partnerId,
                order_status: 'Out for Delivery',
                delivery_status: 'Accepted by Driver'
            })
            .eq('id', orderId)
            .eq('order_status', 'Dispatched') // Only accept if still dispatched
            .select()
            .single();

        if (error) {
            console.error('Error accepting order:', error);
            return NextResponse.json(
                { message: 'Failed to accept order' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
