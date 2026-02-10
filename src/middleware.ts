import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if accessing admin dashboard
    if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
        const adminToken = request.cookies.get('admin_token');

        if (!adminToken || adminToken.value !== 'valid_admin_token') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/dashboard/:path*',
};
