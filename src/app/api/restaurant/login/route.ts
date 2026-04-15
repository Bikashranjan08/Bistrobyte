import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// POST /api/restaurant/login - Authenticate restaurant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find restaurant by email
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !restaurant) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if restaurant is approved
    if (restaurant.status === 'pending') {
      return NextResponse.json(
        { success: false, error: 'Your account is pending admin approval' },
        { status: 403 }
      );
    }

    if (restaurant.status === 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Your account has been rejected', feedback: restaurant.admin_feedback },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, restaurant.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set authentication cookie
    const cookieStore = await cookies();
    cookieStore.set('restaurant_token', restaurant.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Return restaurant data (excluding password)
    const { password_hash, ...restaurantData } = restaurant;

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: restaurantData
    });

  } catch (error) {
    console.error('Error in restaurant login:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
