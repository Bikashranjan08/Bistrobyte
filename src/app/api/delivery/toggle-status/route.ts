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
        const { isAvailable } = await req.json();

        // Verify partner exists and is approved
        const { data: partner, error: partnerError } = await supabase
            .from('delivery_partners')
            .select('id, status')
            .eq('id', partnerId)
            .single();

        if (partnerError || !partner) {
            return NextResponse.json(
                { message: 'Delivery partner not found' },
                { status: 404 }
            );
        }

        if (partner.status !== 'approved') {
            return NextResponse.json(
                { message: 'Partner not approved' },
                { status: 403 }
            );
        }

        // Update availability status
        const { data: updatedPartner, error } = await supabase
            .from('delivery_partners')
            .update({ is_available: isAvailable })
            .eq('id', partnerId)
            .select()
            .single();

        if (error) {
            console.error('Error updating status:', error);
            return NextResponse.json(
                { message: 'Failed to update status' },
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            data: updatedPartner,
            message: isAvailable ? 'You are now online' : 'You are now offline'
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
