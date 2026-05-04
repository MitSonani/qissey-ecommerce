import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// 1. Create Payment Order
app.post('/api/create-payment', async (req, res) => {
    try {
        const { amount, currency = 'INR', cartItems, user_id, shipping_address, accessToken } = req.body;

        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

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
            console.log('Warning: accessToken is missing. Supabase client will use anon key, RLS might not apply as expected for user-specific actions.');
            throw new Error('Failed to create order record: accessToken is missing');
        }

        const supabase = createClient(supabaseUrl, supabaseKey, options);

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

        const instance = new Razorpay({
            key_id: process.env.VITE_RAZORPAY_KEY_ID,
            key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
        });

        const optionsRazorpay = {
            amount: amount,
            currency: currency,
            receipt: orderData.id,
            notes: {
                db_order_id: orderData.id
            }
        };

        const razorpayOrder = await instance.orders.create(optionsRazorpay);

        await supabase
            .from('orders')
            .update({ razorpay_order_id: razorpayOrder.id })
            .eq('id', orderData.id);

        res.status(200).json({
            ...razorpayOrder,
            db_order_id: orderData.id
        });

    } catch (error) {
        console.error('Handler error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Verify Payment
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id, accessToken } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.VITE_RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const supabaseUrl = process.env.VITE_SUPABASE_URL;
            const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseKey) {
                console.error('Supabase credentials missing during verification');
            }

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

            const supabaseAdmin = createClient(supabaseUrl, supabaseKey, options);

            let updateData = {
                status: 'processing',
                payment_status: 'paid',
                payment_method: 'razorpay'
            };

            let updateQuery = supabaseAdmin.from('orders').update(updateData);
            if (db_order_id) {
                updateQuery = updateQuery.eq('id', db_order_id);
            } else {
                updateQuery = updateQuery.eq('razorpay_order_id', razorpay_order_id);
            }

            const { error: updateError } = await updateQuery;

            if (updateError) {
                console.error('Error updating order status:', updateError);
            }

            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, error: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Verify Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Create COD Order
app.post('/api/create-cod-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', cartItems, user_id, shipping_address, accessToken } = req.body;

        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

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

        res.status(200).json({
            success: true,
            db_order_id: orderData.id
        });

    } catch (error) {
        console.error('COD Handler error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for single-page app routing
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
