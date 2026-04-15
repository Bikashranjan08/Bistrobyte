import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Helper to get authenticated restaurant
async function getAuthenticatedRestaurant() {
  const cookieStore = await cookies();
  const token = cookieStore.get('restaurant_token');
  
  if (!token) {
    return null;
  }

  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select('id, status')
    .eq('id', token.value)
    .single();

  if (error || !restaurant) {
    return null;
  }

  return restaurant;
}

// PUT /api/restaurant/toggle-status - Toggle online/offline status
export async function PUT(request: NextRequest) {
  try {
    const restaurant = await getAuthenticatedRestaurant();

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if restaurant is approved
    if (restaurant.status !== 'approved') {
      return NextResponse.json(
        { success: false, error: 'Restaurant must be approved to go online' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { isOnline } = body;

    if (typeof isOnline !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isOnline must be a boolean' },
        { status: 400 }
      );
    }

    const { data: updatedRestaurant, error } = await supabase
      .from('restaurants')
      .update({ is_online: isOnline })
      .eq('id', restaurant.id)
      .select('id, name, is_online, status')
      .single();

    if (error) {
      console.error('Error toggling restaurant status:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Restaurant is now ${isOnline ? 'online' : 'offline'}`,
      data: updatedRestaurant
    });

  } catch (error) {
    console.error('Error in toggle status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
