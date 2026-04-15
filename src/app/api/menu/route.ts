import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/menu - Get all food items with their restaurant options
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const restaurantId = searchParams.get('restaurantId');

    // Build the query for food items
    let foodItemsQuery = supabase
      .from('food_items')
      .select('*')
      .order('name');

    if (category && category !== 'all') {
      foodItemsQuery = foodItemsQuery.eq('category', category);
    }

    if (search) {
      foodItemsQuery = foodItemsQuery.ilike('name', `%${search}%`);
    }

    const { data: foodItems, error: foodError } = await foodItemsQuery;

    if (foodError) {
      console.error('Error fetching food items:', foodError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch food items' },
        { status: 500 }
      );
    }

    // Get all approved and online restaurants with their menu items
    let menuQuery = supabase
      .from('restaurant_menu_items')
      .select(`
        *,
        food_item:food_item_id(*),
        restaurant:restaurant_id(*)
      `)
      .eq('is_available', true)
      .eq('restaurant.status', 'approved')
      .eq('restaurant.is_online', true);

    if (restaurantId) {
      menuQuery = menuQuery.eq('restaurant_id', restaurantId);
    }

    const { data: menuItems, error: menuError } = await menuQuery;

    if (menuError) {
      console.error('Error fetching menu items:', menuError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch menu items' },
        { status: 500 }
      );
    }

    // Group menu items by food item
    const menuByFoodItem = new Map();
    
    menuItems?.forEach((item: any) => {
      const foodId = item.food_item_id;
      if (!menuByFoodItem.has(foodId)) {
        menuByFoodItem.set(foodId, []);
      }
      menuByFoodItem.get(foodId).push({
        menuItem: item,
        restaurant: item.restaurant,
        foodItem: item.food_item
      });
    });

    // Build the response with food items and their restaurant options
    const result = foodItems?.map((foodItem: any) => {
      const restaurants = menuByFoodItem.get(foodItem.id) || [];
      const prices = restaurants.map((r: any) => r.menuItem.price);
      
      return {
        foodItem: {
          id: foodItem.id,
          name: foodItem.name,
          category: foodItem.category,
          description: foodItem.description,
          image: foodItem.base_image,
          isVeg: foodItem.is_veg
        },
        restaurants: restaurants.map((r: any) => ({
          restaurant: {
            id: r.restaurant.id,
            name: r.restaurant.name,
            address: r.restaurant.address,
            phone: r.restaurant.phone,
            isOnline: r.restaurant.is_online
          },
          menuItem: {
            id: r.menuItem.id,
            price: r.menuItem.price,
            customImage: r.menuItem.custom_image
          }
        })),
        lowestPrice: prices.length > 0 ? Math.min(...prices) : null,
        highestPrice: prices.length > 0 ? Math.max(...prices) : null
      };
    }).filter((item: any) => item.restaurants.length > 0); // Only show items with available restaurants

    // Group by category for easier frontend consumption
    const groupedByCategory = result?.reduce((acc: any, item: any) => {
      const category = item.foodItem.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        items: result,
        groupedByCategory,
        totalItems: result?.length || 0
      }
    });

  } catch (error) {
    console.error('Error in menu API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
