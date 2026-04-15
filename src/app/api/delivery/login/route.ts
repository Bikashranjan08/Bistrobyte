import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// POST /api/delivery/login - Authenticate delivery partner
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Phone and password are required' },
        { status: 400 }
      );
    }

    // Find partner by phone
    const { data: partner, error } = await supabase
      .from('delivery_partners')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !partner) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if partner is approved
    if (partner.status === 'pending') {
      return NextResponse.json(
        { success: false, error: 'Your account is pending admin approval' },
        { status: 403 }
      );
    }

    if (partner.status === 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Your account has been rejected', feedback: partner.admin_feedback },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, partner.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set authentication cookie
    const cookieStore = await cookies();
    cookieStore.set('delivery_token', partner.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    // Return partner data (excluding password)
    const { password_hash, ...partnerData } = partner;

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: partnerData
    });

  } catch (error) {
    console.error('Error in delivery partner login:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
