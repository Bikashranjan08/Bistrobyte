import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { amount, currency = 'INR', receipt } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { message: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: receipt || `order_${Date.now()}`,
            payment_capture: 1, // Auto capture payment
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json(
            { message: 'Failed to create payment order' },
            { status: 500 }
        );
    }
}
