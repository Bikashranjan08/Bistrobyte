import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { message: 'Missing payment verification details' },
                { status: 400 }
            );
        }

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully',
                paymentId: razorpay_payment_id,
            });
        } else {
            return NextResponse.json(
                { message: 'Invalid payment signature' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { message: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}
