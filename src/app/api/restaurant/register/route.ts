import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// POST /api/restaurant/register - Register a new restaurant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      address,
      licenseUrl
    } = body;

    // Validation
    if (!name || !email || !password || !phone || !address) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingRestaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('email', email)
      .single();

    if (existingRestaurant) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create restaurant
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .insert({
        name,
        email,
        password_hash: passwordHash,
        phone,
        address,
        license_url: licenseUrl,
        status: 'pending',
        is_online: false
      })
      .select('id, name, email, phone, address, status, is_online, created_at')
      .single();

    if (error) {
      console.error('Error creating restaurant:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create restaurant' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Restaurant registered successfully. Pending admin approval.',
      data: restaurant
    });

  } catch (error) {
    console.error('Error in restaurant registration:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
