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
    .select('id, name, email, phone, address, license_url, status, is_online, admin_feedback, created_at, updated_at')
    .eq('id', token.value)
    .single();

  if (error || !restaurant) {
    return null;
  }

  return restaurant;
}

// GET /api/restaurant/profile - Get restaurant profile
export async function GET() {
  try {
    const restaurant = await getAuthenticatedRestaurant();

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: restaurant
    });

  } catch (error) {
    console.error('Error fetching restaurant profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/restaurant/profile - Update restaurant profile
export async function PUT(request: NextRequest) {
  try {
    const restaurant = await getAuthenticatedRestaurant();

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, address, licenseUrl } = body;

    const updates: any = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (licenseUrl !== undefined) updates.license_url = licenseUrl;

    const { data: updatedRestaurant, error } = await supabase
      .from('restaurants')
      .update(updates)
      .eq('id', restaurant.id)
      .select('id, name, email, phone, address, license_url, status, is_online, created_at, updated_at')
      .single();

    if (error) {
      console.error('Error updating restaurant:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedRestaurant
    });

  } catch (error) {
    console.error('Error updating restaurant profile:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
