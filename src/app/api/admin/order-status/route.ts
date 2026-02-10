import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const { orderId, status } = await req.json();

        // Validate Status matches Schema Enum
        const validStatuses = ['Placed', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: status }, // Correct field name
            { returnDocument: 'after' }
        );

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Update Status Error:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
