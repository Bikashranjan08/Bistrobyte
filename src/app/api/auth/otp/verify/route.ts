import { NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({ message: 'Phone and OTP are required' }, { status: 400 });
        }

        // Verify OTP
        const storedOtpData = otpStore.get(phone);

        if (!storedOtpData) {
            return NextResponse.json({ message: 'OTP expired or not requested' }, { status: 400 });
        }

        if (storedOtpData.otp !== otp) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        if (Date.now() > storedOtpData.expires) {
            otpStore.delete(phone);
            return NextResponse.json({ message: 'OTP expired' }, { status: 400 });
        }

        // OTP Valid - Clear it
        otpStore.delete(phone);

        // Find or Create User
        let user = await User.findOne({ phone });

        if (!user) {
            // Check if email exists with this phone (implied logic: maybe ask for email later? For now, create placeholders)
            // Actually, if we just have phone, we create a user with a placeholder name/email or just phone.
            // But our User model requires email/name. 
            // Strategy: Create a partial user where email is generated or asked later. 
            // For simplicity: Generate a dummy email and ask user to update profile later.
            const dummyEmail = `${phone}@phone.auth.user`;
            user = await User.create({
                name: `User ${phone.slice(-4)}`,
                email: dummyEmail,
                phone,
                phoneVerified: true,
                role: 'user'
            });
        } else {
            // Mark verified if not
            if (!user.phoneVerified) {
                user.phoneVerified = true;
                await user.save();
            }
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        // Set Cookie
        (await cookies()).set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.json({
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error('OTP Verify Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
