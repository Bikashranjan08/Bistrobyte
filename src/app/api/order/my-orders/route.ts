import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { data: dbOrders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        // Fetch delivery partner details for orders with assigned partners
        const partnerIds = (dbOrders || [])
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
                totalAmount: order.total_amount,
                deliveryAddress: order.delivery_address,
                phoneNumber: order.phone_number,
                paymentMethod: order.payment_method,
                paymentStatus: order.payment_status,
                orderStatus: order.order_status,
                deliveryStatus: order.delivery_status,
                createdAt: order.created_at,
                restaurant_name: order.restaurant_name,
                restaurant_id: order.restaurant_id,
                restaurantAddress: order.restaurant_address,
                restaurantCity: order.restaurant_city,
                restaurantState: order.restaurant_state,
                restaurantPincode: order.restaurant_pincode,
                restaurantLatitude: order.restaurant_latitude,
                restaurantLongitude: order.restaurant_longitude,
                foodRating: order.food_rating,
                deliveryRating: order.delivery_rating,
                deliveryCharge: order.delivery_charge,
                deliveryIncentive: order.delivery_incentive,
                delivery_partner_name: partner?.name || null,
                delivery_partner_phone: partner?.phone || null,
                delivery_partner_vehicle: partner?.vehicle_type || null
            };
        });

        return NextResponse.json({ orders }, { status: 200 });

    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
