import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User'; // Ensure User model is registered

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Fetch all orders, newest first
        const orders = await Order.find({})
            .populate('userId', 'name phone') // Populate user details (corrected path)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
