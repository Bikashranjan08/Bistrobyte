import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// POST /api/delivery/register - Register a new delivery partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      password,
      vehicleType,
      licenseUrl
    } = body;

    // Validation
    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and password are required' },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const { data: existingPartner } = await supabase
      .from('delivery_partners')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingPartner) {
      return NextResponse.json(
        { success: false, error: 'Phone number already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create delivery partner
    const { data: partner, error } = await supabase
      .from('delivery_partners')
      .insert({
        name,
        phone,
        email,
        password_hash: passwordHash,
        vehicle_type: vehicleType || 'bike',
        license_url: licenseUrl,
        status: 'pending',
        is_available: false
      })
      .select('id, name, phone, email, vehicle_type, status, is_available, created_at')
      .single();

    if (error) {
      console.error('Error creating delivery partner:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create delivery partner' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Pending admin approval.',
      data: partner
    });

  } catch (error) {
    console.error('Error in delivery partner registration:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
