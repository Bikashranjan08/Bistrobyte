import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Debug endpoint to check specific order
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId') || '275e3c06-6dfd-4d87-b899-8250473ea691';

        const { data: order, error } = await supabase
            .from('orders')
            .select('id, order_status, delivery_status, delivery_partner_id, restaurant_name, created_at')
            .eq('id', orderId)
            .single();

        return NextResponse.json({
            order: order,
            error: error?.message
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
