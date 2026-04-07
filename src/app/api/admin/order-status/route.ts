import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: Request) {
    try {
        const { orderId, status } = await req.json();

        // Validate Status matches Schema Enum
        const validStatuses = ['Placed', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        const { data: order, error } = await supabase
            .from('orders')
            .update({ order_status: status })
            .eq('id', orderId)
            .select()
            .single();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ message: 'Order not found or error occurred' }, { status: 404 });
        }

        const mappedOrder = {
            ...order,
            _id: order.id,
            totalAmount: order.total_amount,
            deliveryAddress: order.delivery_address,
            phoneNumber: order.phone_number,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            orderStatus: order.order_status,
            createdAt: order.created_at
        };

        return NextResponse.json({ success: true, order: mappedOrder });
    } catch (error) {
        console.error("Update Status Error:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
