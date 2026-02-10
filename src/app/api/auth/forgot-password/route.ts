import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/nodemailer';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (!user.password && (user.googleId || user.phone)) {
            return NextResponse.json({ message: 'This account uses Google/Phone login. Please sign in using that method.' }, { status: 400 });
        }

        // Generate Token
        // Generate a random string 20 chars long
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash it and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

        await user.save();

        // Create reset url
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

        const message = `
            <h1>Password Reset Request</h1>
            <p>You have requested a password reset. Please click on the link below to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>If you did not make this request, please ignore it.</p>
        `;

        try {
            await sendEmail(email, 'Password Reset Token', message);
            return NextResponse.json({ success: true, message: 'Email sent' });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return NextResponse.json({ message: 'Email could not be sent' }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
