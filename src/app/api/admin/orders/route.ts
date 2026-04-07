import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
    try {
        // Fetch all orders, newest first
        const { data: dbOrders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        const orders = dbOrders.map(order => ({
            ...order,
            _id: order.id,
            userId: order.user_id, // We'll just map it directly, though previously it was populated.
            totalAmount: order.total_amount,
            deliveryAddress: order.delivery_address,
            phoneNumber: order.phone_number,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            orderStatus: order.order_status,
            createdAt: order.created_at
        }));

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
