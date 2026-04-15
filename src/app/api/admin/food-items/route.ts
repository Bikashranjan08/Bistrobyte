import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Helper to verify admin authentication
async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return !!token;
}

// GET /api/admin/food-items - List all food items
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
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = supabase
      .from('food_items')
      .select('*')
      .order('name');

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: foodItems, error } = await query;

    if (error) {
      console.error('Error fetching food items:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch food items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: foodItems
    });

  } catch (error) {
    console.error('Error in GET food items:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/food-items - Create a new food item
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminAuth();
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, category, description, baseImage, isVeg } = body;

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      );
    }

    const { data: foodItem, error } = await supabase
      .from('food_items')
      .insert({
        name,
        category,
        description,
        base_image: baseImage,
        is_veg: isVeg ?? true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating food item:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create food item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Food item created successfully',
      data: foodItem
    });

  } catch (error) {
    console.error('Error in POST food item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/food-items - Update a food item
export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminAuth();
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, category, description, baseImage, isVeg } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Food item ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (name) updates.name = name;
    if (category) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (baseImage !== undefined) updates.base_image = baseImage;
    if (isVeg !== undefined) updates.is_veg = isVeg;

    const { data: foodItem, error } = await supabase
      .from('food_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating food item:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update food item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Food item updated successfully',
      data: foodItem
    });

  } catch (error) {
    console.error('Error in PUT food item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/food-items - Delete a food item
export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminAuth();
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Food item ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('food_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting food item:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete food item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Food item deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE food item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
