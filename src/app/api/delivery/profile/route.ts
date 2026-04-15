import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
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

        // Fetch full partner profile
        const { data: partner, error } = await supabase
            .from('delivery_partners')
            .select('*')
            .eq('id', partnerId)
            .single();

        if (error || !partner) {
            return NextResponse.json(
                { message: 'Partner not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: partner });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
