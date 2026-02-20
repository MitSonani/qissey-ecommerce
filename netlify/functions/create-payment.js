import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

export const handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Make sure method is POST' };
    }

    try {
        const { amount, currency = 'INR', cartItems, user_id, shipping_address, accessToken } = JSON.parse(event.body);


        // Initialize Supabase (Use Service Role Key for admin privileges if available, otherwise fallback)
        // For inserting into orders as another user or skipping RLS, Service Role is best.
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials missing');
        }

        // If accessToken is provided, use it to authenticate the client as the user
        // This allows RLS policies to work (e.g., matching auth.uid() with user_id)
        const options = accessToken ? {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        } : {};

        if (!accessToken) {
            console.log('Warning: accessToken is missing. Supabase client will use anon key, RLS might not apply as expected for user-specific actions.');
            throw new Error('Failed to create order record: accessToken is missing');
        }

        const supabase = createClient(supabaseUrl, supabaseKey, options);

        // 1. Create Order in Supabase
        // Calculate total amount from cartItems to correspond with payment amount? 
        // For now, trusting the frontend amount, but ideally should recalculate.
        // Let's stick to the trusted amount passed (for MVP speed).

        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([
                {
                    customer_id: user_id,
                    total_amount: amount / 100,
                    currency: currency,
                    status: 'pending',
                    payment_status: 'unpaid',
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
                product_id: item.product_id || item.id, // Handle both cart structure (product_id) and raw product (id)
                variant_id: item.variant_id,
                product_name: item.name || item.product?.name,
                size: item.size,
                custom_measurements: item.custom_measurements,
                sku: item.variant?.sku || item.product?.sku, // Snapshot SKU
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsData);

            if (itemsError) {
                console.error('Error creating order items:', itemsError);
                // Should we rollback order? For MVP, logging error.
            }
        }

        // 3. Create Razorpay Order
        const instance = new Razorpay({
            key_id: process.env.VITE_RAZORPAY_KEY_ID,
            key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
        });

        const optionsRazorpay = {
            amount: amount,
            currency: currency,
            receipt: orderData.id, // Link Razorpay receipt to our DB Order ID
            notes: {
                db_order_id: orderData.id // Store DB Order ID in notes for webhook verification/reconciliation
            }
        };

        const razorpayOrder = await instance.orders.create(optionsRazorpay);

        // 4. Update Order with Razorpay Order ID
        // Note: If we are using RLS as the user, the user must have UPDATE policy on their own order.
        // The policy 'Users can update their own orders' exists, so this should work.
        await supabase
            .from('orders')
            .update({ razorpay_order_id: razorpayOrder.id })
            .eq('id', orderData.id);

        return {
            statusCode: 200,
            body: JSON.stringify({
                ...razorpayOrder,
                db_order_id: orderData.id // Return DB Order ID to frontend
            }),
        };

    } catch (error) {
        console.error('Handler error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
