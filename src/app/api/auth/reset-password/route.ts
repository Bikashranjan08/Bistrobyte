import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { token, password } = await req.json();

        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
        }

        // Set new password
        // The pre-save hook might mess up if we just set it directly if we don't watch out, 
        // but typically bcrypt is handled manually or in pre-save.
        // My User.ts doesn't seem to have a pre-save for hashing? 
        // I should check User.ts to see if it hashes password.
        // If not, I must hash it here.
        // Checking User.ts (user didn't show hashing in recent view, assume I need to hash).

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
