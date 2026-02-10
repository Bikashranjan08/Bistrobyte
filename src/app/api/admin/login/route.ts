import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        console.log('Admin Login Attempt:', { username, password }); // Debug Log

        // Hardcoded Credentials (SIMPLIFIED)
        // Username: admin123 (case-insensitive)
        // Password: admin123 OR adminispassword123
        if (username?.trim().toLowerCase() === 'admin123' && (password?.trim() === 'admin123' || password?.trim() === 'adminispassword123')) {
            const cookieStore = await cookies();

            // Set cookie securely (httpOnly=false so client can verify existence)
            cookieStore.set('admin_token', 'valid_admin_token', {
                httpOnly: false, // Changed to false so client JS can read it for protection
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24, // 1 day
            });

            return NextResponse.json({ success: true, message: 'Login successful' });
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
