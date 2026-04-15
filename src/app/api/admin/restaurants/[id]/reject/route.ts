import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Helper to verify admin authentication
async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return !!token;
}

// PUT /api/admin/restaurants/[id]/reject - Reject a restaurant
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdminAuth();
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { feedback } = body;

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .update({ 
        status: 'rejected',
        is_online: false,
        admin_feedback: feedback || null
      })
      .eq('id', id)
      .select('id, name, email, status, admin_feedback')
      .single();

    if (error) {
      console.error('Error rejecting restaurant:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to reject restaurant' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Restaurant rejected successfully',
      data: restaurant
    });

  } catch (error) {
    console.error('Error in reject restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
