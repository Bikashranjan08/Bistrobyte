import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
    try {
        // Fetch all orders, newest first
        const { data: dbOrders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        // Fetch delivery partner details for orders with assigned partners
        const partnerIds = dbOrders
            .filter(o => o.delivery_partner_id)
            .map(o => o.delivery_partner_id);
        
        let partners: any[] = [];
        if (partnerIds.length > 0) {
            const { data: partnersData } = await supabase
                .from('delivery_partners')
                .select('id, name, phone, vehicle_type')
                .in('id', partnerIds);
            partners = partnersData || [];
        }

        const partnersMap = new Map(partners.map(p => [p.id, p]));

        const orders = dbOrders.map(order => {
            const partner = order.delivery_partner_id ? partnersMap.get(order.delivery_partner_id) : null;
            return {
                ...order,
                _id: order.id,
                userId: order.user_id,
                customerName: order.customer_name,
                totalAmount: order.total_amount,
                deliveryAddress: order.delivery_address,
                phoneNumber: order.phone_number,
                paymentMethod: order.payment_method,
                paymentStatus: order.payment_status,
                orderStatus: order.order_status,
                createdAt: order.created_at,
                deliveryCharge: order.delivery_charge,
                deliveryIncentive: order.delivery_incentive,
                restaurant_name: order.restaurant_name,
                delivery_partner_name: partner?.name || null,
                delivery_partner_phone: partner?.phone || null,
                delivery_partner_vehicle: partner?.vehicle_type || null
            };
        });

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
