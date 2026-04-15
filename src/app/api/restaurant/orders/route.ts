import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('restaurant_token');

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Token contains the restaurant ID directly
        const restaurantId = token.value;

        // Verify restaurant exists
        const { data: restaurant, error: profileError } = await supabase
            .from('restaurants')
            .select('id')
            .eq('id', restaurantId)
            .single();

        if (profileError || !restaurant) {
            return NextResponse.json(
                { message: 'Restaurant not found' },
                { status: 404 }
            );
        }

        // Fetch orders for this restaurant
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error);
            return NextResponse.json(
                { message: 'Failed to fetch orders' },
                { status: 500 }
            );
        }

        // Fetch delivery partner details for orders with assigned partners
        const partnerIds = (orders || [])
            .filter((o: any) => o.delivery_partner_id)
            .map((o: any) => o.delivery_partner_id);
        
        let partners: any[] = [];
        if (partnerIds.length > 0) {
            const { data: partnersData } = await supabase
                .from('delivery_partners')
                .select('id, name, phone, vehicle_type')
                .in('id', partnerIds);
            partners = partnersData || [];
        }

        const partnersMap = new Map(partners.map(p => [p.id, p]));

        const ordersWithPartners = (orders || []).map((order: any) => {
            const partner = order.delivery_partner_id ? partnersMap.get(order.delivery_partner_id) : null;
            return {
                ...order,
                delivery_partner_name: partner?.name || null,
                delivery_partner_phone: partner?.phone || null,
                delivery_partner_vehicle: partner?.vehicle_type || null
            };
        });

        return NextResponse.json({ success: true, data: ordersWithPartners });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
