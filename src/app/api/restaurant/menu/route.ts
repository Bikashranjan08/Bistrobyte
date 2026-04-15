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

// GET /api/restaurant/menu - Get restaurant's menu items
export async function GET() {
  try {
    const restaurant = await getAuthenticatedRestaurant();

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: menuItems, error } = await supabase
      .from('restaurant_menu_items')
      .select(`
        *,
        food_item:food_item_id(*)
      `)
      .eq('restaurant_id', restaurant.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching menu items:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch menu items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: menuItems
    });

  } catch (error) {
    console.error('Error in GET menu:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/restaurant/menu - Add a menu item
export async function POST(request: NextRequest) {
  try {
    const restaurant = await getAuthenticatedRestaurant();

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { foodItemId, price, isAvailable, customImage } = body;

    if (!foodItemId || !price) {
      return NextResponse.json(
        { success: false, error: 'Food item ID and price are required' },
        { status: 400 }
      );
    }

    // Check if food item exists
    const { data: foodItem, error: foodError } = await supabase
      .from('food_items')
      .select('id')
      .eq('id', foodItemId)
      .single();

    if (foodError || !foodItem) {
      return NextResponse.json(
        { success: false, error: 'Food item not found' },
        { status: 404 }
      );
    }

    // Check if menu item already exists
    const { data: existingItem } = await supabase
      .from('restaurant_menu_items')
      .select('id')
      .eq('restaurant_id', restaurant.id)
      .eq('food_item_id', foodItemId)
      .single();

    if (existingItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item already exists. Use PUT to update.' },
        { status: 409 }
      );
    }

    const { data: menuItem, error } = await supabase
      .from('restaurant_menu_items')
      .insert({
        restaurant_id: restaurant.id,
        food_item_id: foodItemId,
        price,
        is_available: isAvailable ?? true,
        custom_image: customImage
      })
      .select(`
        *,
        food_item:food_item_id(*)
      `)
      .single();

    if (error) {
      console.error('Error creating menu item:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create menu item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item added successfully',
      data: menuItem
    });

  } catch (error) {
    console.error('Error in POST menu:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/restaurant/menu - Update a menu item
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
    const { menuItemId, price, isAvailable, customImage } = body;

    if (!menuItemId) {
      return NextResponse.json(
        { success: false, error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (price !== undefined) updates.price = price;
    if (isAvailable !== undefined) updates.is_available = isAvailable;
    if (customImage !== undefined) updates.custom_image = customImage;

    const { data: menuItem, error } = await supabase
      .from('restaurant_menu_items')
      .update(updates)
      .eq('id', menuItemId)
      .eq('restaurant_id', restaurant.id)
      .select(`
        *,
        food_item:food_item_id(*)
      `)
      .single();

    if (error) {
      console.error('Error updating menu item:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update menu item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });

  } catch (error) {
    console.error('Error in PUT menu:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/restaurant/menu - Delete a menu item
export async function DELETE(request: NextRequest) {
  try {
    const restaurant = await getAuthenticatedRestaurant();

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const menuItemId = searchParams.get('id');

    if (!menuItemId) {
      return NextResponse.json(
        { success: false, error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('restaurant_menu_items')
      .delete()
      .eq('id', menuItemId)
      .eq('restaurant_id', restaurant.id);

    if (error) {
      console.error('Error deleting menu item:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete menu item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE menu:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
