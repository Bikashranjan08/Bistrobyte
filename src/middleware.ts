import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Custom middleware to handle restaurant and delivery auth
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Protect restaurant routes
  if (pathname.startsWith('/restaurant/dashboard') || pathname.startsWith('/api/restaurant/profile') || 
      pathname.startsWith('/api/restaurant/menu') || pathname.startsWith('/api/restaurant/toggle-status')) {
    const token = req.cookies.get('restaurant_token');
    if (!token) {
      return NextResponse.redirect(new URL('/restaurant/login', req.url));
    }
  }

  // Protect delivery routes
  if (pathname.startsWith('/delivery/dashboard') || pathname.startsWith('/api/delivery/profile') || 
      pathname.startsWith('/api/delivery/toggle-availability')) {
    const token = req.cookies.get('delivery_token');
    if (!token) {
      return NextResponse.redirect(new URL('/delivery/login', req.url));
    }
  }

  // Protect admin routes (except login)
  if ((pathname.startsWith('/admin/dashboard') || pathname.startsWith('/api/admin')) && 
      !pathname.includes('/admin/login')) {
    const token = req.cookies.get('admin_token');
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Standard Next.js/Clerk matcher pattern
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
