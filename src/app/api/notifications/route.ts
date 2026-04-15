import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

// GET: Fetch notifications for current user
export async function GET() {
    try {
        // Try to get user from Clerk (for customers)
        let userId: string | null = null;
        try {
            const authResult = await auth();
            userId = authResult.userId;
        } catch (e) {
            // Not authenticated with Clerk, check for delivery partner token
        }

        // If no Clerk user, check for delivery partner token
        if (!userId) {
            const cookieStore = await cookies();
            const deliveryToken = cookieStore.get('delivery_token');
            if (deliveryToken) {
                userId = deliveryToken.value;
            }
        }

        // Check for admin token
        if (!userId) {
            const cookieStore = await cookies();
            const adminToken = cookieStore.get('admin_token');
            if (adminToken) {
                userId = 'admin';
            }
        }

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if this is a delivery partner (has delivery_token cookie)
        const cookieStore = await cookies();
        const isDeliveryPartner = !!cookieStore.get('delivery_token');

        // Build query - exclude delivery_request for non-delivery users
        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('is_read', false);

        // If not a delivery partner, exclude delivery_request type notifications
        if (!isDeliveryPartner) {
            query = query.neq('type', 'delivery_request');
        }

        const { data: notifications, error } = await query
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error('Error fetching notifications:', error);
            return NextResponse.json(
                { message: 'Failed to fetch notifications' },
                { status: 500 }
            );
        }

        // Get unread count
        const { count, error: countError } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        return NextResponse.json({ 
            success: true, 
            notifications: notifications || [],
            unreadCount: count || 0
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT: Mark notification as read
export async function PUT(req: Request) {
    try {
        const { notificationId } = await req.json();

        if (!notificationId) {
            return NextResponse.json(
                { message: 'Notification ID is required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .select()
            .single();

        if (error) {
            console.error('Error marking notification as read:', error);
            return NextResponse.json(
                { message: 'Failed to update notification' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE: Mark all notifications as read
export async function DELETE() {
    try {
        // Try to get user from Clerk (for customers)
        let userId: string | null = null;
        try {
            const authResult = await auth();
            userId = authResult.userId;
        } catch (e) {
            // Not authenticated with Clerk
        }

        // If no Clerk user, check for delivery partner token
        if (!userId) {
            const cookieStore = await cookies();
            const deliveryToken = cookieStore.get('delivery_token');
            if (deliveryToken) {
                userId = deliveryToken.value;
            }
        }

        // Check for admin token
        if (!userId) {
            const cookieStore = await cookies();
            const adminToken = cookieStore.get('admin_token');
            if (adminToken) {
                userId = 'admin';
            }
        }

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) {
            console.error('Error marking all notifications as read:', error);
            return NextResponse.json(
                { message: 'Failed to update notifications' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
