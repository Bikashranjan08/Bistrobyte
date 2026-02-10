import { NextResponse } from 'next/server';
import { sendFast2SMS } from '@/lib/fast2sms';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import { otpStore } from '@/lib/otpStore';

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone || phone.length < 10) {
            return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
        }

        // Generate 6-digit OTP (MOCKED)
        const otp = "456789";

        // Store OTP with 5-minute expiry
        otpStore.set(phone, {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        });

        console.log(`Sending MOCK OTP ${otp} to ${phone}`);

        // Send via Fast2SMS (SKIPPED FOR MOCK)
        // const result = await sendFast2SMS(phone, otp);

        // Always succeed for mock
        return NextResponse.json({ message: 'OTP sent successfully (MOCK)' });
    } catch (error) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
