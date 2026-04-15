import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Helper to verify admin authentication
async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return !!token;
}

// GET /api/admin/restaurants - List all restaurants
export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminAuth();
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('restaurants')
      .select('id, name, email, phone, address, license_url, status, is_online, admin_feedback, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: restaurants, error } = await query;

    if (error) {
      console.error('Error fetching restaurants:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch restaurants' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: restaurants
    });

  } catch (error) {
    console.error('Error in GET restaurants:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
