import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('delivery_token');

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const partnerId = token.value;
        const { orderId, deliveryStatus, orderStatus: explicitOrderStatus } = await req.json();

        if (!orderId) {
            return NextResponse.json(
                { message: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Verify the order belongs to this delivery partner
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('delivery_partner_id, order_status, user_id, restaurant_name')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        if (order.delivery_partner_id !== partnerId) {
            return NextResponse.json(
                { message: 'Unauthorized - Order not assigned to you' },
                { status: 403 }
            );
        }

        // Define valid delivery status flow
        const validStatuses = ['Accepted by Driver', 'Arrived at Restaurant', 'Order Picked Up', 'Arrived at Location', 'Delivered'];
        
        // Only validate deliveryStatus if it's provided
        if (deliveryStatus && !validStatuses.includes(deliveryStatus)) {
            return NextResponse.json(
                { message: 'Invalid delivery status' },
                { status: 400 }
            );
        }

        // Must have at least one status to update
        if (!deliveryStatus && !explicitOrderStatus) {
            return NextResponse.json(
                { message: 'Either deliveryStatus or orderStatus is required' },
                { status: 400 }
            );
        }

        // Update order
        const updates: any = {};
        
        // If explicit orderStatus provided, use it
        if (explicitOrderStatus) {
            updates.order_status = explicitOrderStatus;
        }
        
        // If deliveryStatus provided, set it
        if (deliveryStatus) {
            updates.delivery_status = deliveryStatus;
        }
        
        // Map delivery status to order status (only if no explicit orderStatus)
        let orderStatus = null;
        let notificationTitle = '';
        let notificationMessage = '';
        
        // Only process delivery status if provided and no explicit order status
        if (deliveryStatus && !explicitOrderStatus) {
            switch (deliveryStatus) {
                case 'Order Picked Up':
                    orderStatus = 'Out for Delivery';
                    notificationTitle = 'Order Picked Up';
                    notificationMessage = `Your order from ${order.restaurant_name} has been picked up and is on the way!`;
                    break;
                case 'Delivered':
                    orderStatus = 'Delivered';
                    notificationTitle = 'Order Delivered!';
                    notificationMessage = `Your order from ${order.restaurant_name} has been delivered. Enjoy your meal!`;
                    break;
                case 'Arrived at Restaurant':
                    notificationTitle = 'Driver at Restaurant';
                    notificationMessage = `Your delivery partner has arrived at ${order.restaurant_name} to pick up your order.`;
                    break;
                case 'Arrived at Location':
                    notificationTitle = 'Driver at Your Location';
                    notificationMessage = `Your delivery partner has arrived at your location. Please collect your order.`;
                    break;
            }
            
            if (orderStatus) {
                updates.order_status = orderStatus;
            }
        }
        
        // Handle explicit order status notifications
        if (explicitOrderStatus === 'Out for Delivery') {
            notificationTitle = 'Out for Delivery';
            notificationMessage = `Your order from ${order.restaurant_name} is now out for delivery!`;
        }

        const { data: updatedOrder, error } = await supabase
            .from('orders')
            .update(updates)
            .eq('id', orderId)
            .select()
            .single();

        if (error) {
            console.error('Error updating delivery status:', error);
            console.error('Update data:', updates);
            return NextResponse.json(
                { message: `Failed to update status: ${error.message || 'Database error'}` },
                { status: 500 }
            );
        }
        
        console.log('Order updated successfully:', { orderId, orderStatus: updates.order_status, deliveryStatus: updates.delivery_status });

        // Send notification to customer (non-blocking)
        if (notificationTitle && order.user_id) {
            try {
                await supabase.from('notifications').insert({
                    user_id: order.user_id,
                    type: 'order_update',
                    title: notificationTitle,
                    message: notificationMessage,
                    order_id: orderId,
                    is_read: false
                });
            } catch (notifError) {
                console.error('Failed to create notification:', notifError);
            }
        }

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
