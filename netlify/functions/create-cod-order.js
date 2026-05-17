import { createClient } from '@supabase/supabase-js';

export const handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { amount, currency = 'INR', cartItems, user_id, shipping_address, accessToken } = JSON.parse(event.body);

        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials missing');
        }

        const options = accessToken ? {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        } : {};

        if (!accessToken) {
            throw new Error('Failed to create order record: accessToken is missing');
        }

        const supabase = createClient(supabaseUrl, supabaseKey, options);

        // 1. Create Order in Supabase
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    customer_id: user_id,
                    total_amount: amount / 100,
                    currency: currency,
                    status: 'pending',
                    payment_status: 'unpaid',
                    payment_method: 'cod',
                    shipping_address: shipping_address,
                    customer_name: shipping_address?.name,
                    customer_email: shipping_address?.email
                }
            ])
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order in DB:', orderError);
            throw new Error('Failed to create order record: ' + orderError.message);
        }

        // 2. Insert Order Items
        if (cartItems && cartItems.length > 0) {
            const orderItemsData = cartItems.map(item => ({
                order_id: orderData.id,
                product_id: item.product_id || item.id,
                variant_id: item.variant_id,
                product_name: item.name || item.product?.name,
                size: item.size,
                custom_measurements: item.custom_measurements,
                sku: item.variant?.sku || item.product?.sku,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsData);

            if (itemsError) {
                console.error('Error creating order items:', itemsError);
            }
        }



        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                db_order_id: orderData.id
            }),
        };

    } catch (error) {
        console.error('COD Handler error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
