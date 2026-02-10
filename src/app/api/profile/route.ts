import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET - Fetch user profile
export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        await dbConnect();

        const user = await User.findById(decoded.userId).select('-password -resetPasswordToken -resetPasswordExpire');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Profile GET Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update user profile
export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        await dbConnect();

        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const { name, email, phone, address, avatar, oldPassword, newPassword } = await req.json();

        // Handle password change
        if (oldPassword && newPassword) {
            if (!user.password) {
                return NextResponse.json({ message: 'Cannot change password for social login accounts' }, { status: 400 });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
            }

            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Check email uniqueness (if changed)
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
            }
            user.email = email;
        }

        // Check phone uniqueness (if changed)
        if (phone !== undefined && phone !== user.phone) {
            if (phone) {
                const existingUser = await User.findOne({ phone });
                if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                    return NextResponse.json({ message: 'Phone number already in use' }, { status: 400 });
                }
            }
            user.phone = phone || undefined;
        }

        // Update other fields
        if (name) user.name = name;
        if (address) user.address = address;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        // Return updated user (without password)
        const updatedUser = await User.findById(user._id).select('-password -resetPasswordToken -resetPasswordExpire');

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Profile PUT Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
