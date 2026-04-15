// Add restaurant_id and restaurant_name columns to orders table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumns() {
    console.log('Adding restaurant columns to orders table...');
    
    // Add restaurant_id column
    const { error: error1 } = await supabase
        .from('orders')
        .select('restaurant_id')
        .limit(1);
    
    if (error1 && error1.message.includes('restaurant_id')) {
        console.log('restaurant_id column does not exist, adding it...');
        
        // Use raw SQL via REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey
            },
            body: JSON.stringify({
                query: `ALTER TABLE orders ADD COLUMN IF NOT EXISTS restaurant_id UUID REFERENCES restaurants(id);`
            })
        });
        
        if (!response.ok) {
            console.error('Error adding restaurant_id:', await response.text());
        } else {
            console.log('✅ restaurant_id column added');
        }
    } else {
        console.log('✅ restaurant_id column already exists');
    }
    
    // Add restaurant_name column
    const { error: error2 } = await supabase
        .from('orders')
        .select('restaurant_name')
        .limit(1);
    
    if (error2 && error2.message.includes('restaurant_name')) {
        console.log('restaurant_name column does not exist, adding it...');
        
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey
            },
            body: JSON.stringify({
                query: `ALTER TABLE orders ADD COLUMN IF NOT EXISTS restaurant_name TEXT;`
            })
        });
        
        if (!response.ok) {
            console.error('Error adding restaurant_name:', await response.text());
        } else {
            console.log('✅ restaurant_name column added');
        }
    } else {
        console.log('✅ restaurant_name column already exists');
    }
    
    console.log('\nDone!');
}

addColumns().catch(console.error);
