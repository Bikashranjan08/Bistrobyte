import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as JwtPayload;

        // Validate request body
        const { items, totalAmount, deliveryAddress, phoneNumber } = await req.json();

        if (!items || items.length === 0) { // Original check for empty cart
            return NextResponse.json(
                { message: 'Cart is empty' },
                { status: 400 }
            );
        }

        // New validation for required fields
        if (!items || !totalAmount || !deliveryAddress || !phoneNumber) {
            return NextResponse.json({ message: "Missing required fields (items, total, address, phone)" }, { status: 400 });
        }

        // Validate Address fields
        const { street, city, state, pincode } = deliveryAddress;
        if (!street || !city || !state || !pincode) {
            return NextResponse.json({ message: "Incomplete address details" }, { status: 400 });
        }

        await dbConnect();

        // Check if User exists and update their profile if address/phone is missing
        const user = await User.findById(decoded.userId);
        if (user) {
            let updated = false;
            if (!user.phone) {
                user.phone = phoneNumber;
                updated = true;
            }
            if (!user.address || !user.address.street) { // Check if address or street is missing
                user.address = deliveryAddress;
                updated = true;
            }
            if (updated) await user.save();
        }

        // Ensure all items have an itemId (use name as fallback for static menu items)
        const orderItems = items.map((item: any) => ({
            itemId: item.itemId || item.name, // Fallback to name if itemId is missing
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }));

        const order = await Order.create({
            userId: decoded.userId,
            items: orderItems,
            totalAmount,
            deliveryAddress, // Added deliveryAddress
            phoneNumber,     // Added phoneNumber
            paymentMethod: 'COD', // Currently hardcoded to COD as per requirement
            paymentStatus: 'Pending',
        });

        return NextResponse.json({ order }, { status: 201 });

    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
