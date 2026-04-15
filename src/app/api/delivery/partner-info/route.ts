import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const partnerId = searchParams.get('partnerId');

        if (!partnerId) {
            return NextResponse.json(
                { message: 'Partner ID is required' },
                { status: 400 }
            );
        }

        // Fetch partner info (only name and phone for customer view)
        const { data: partner, error } = await supabase
            .from('delivery_partners')
            .select('name, phone')
            .eq('id', partnerId)
            .single();

        if (error || !partner) {
            return NextResponse.json(
                { message: 'Partner not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: partner });
    } catch (error) {
        console.error('Error fetching partner info:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
