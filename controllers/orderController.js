import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';

export const createPayment = async (req, res) => {
    try {
        const { amount, currency = 'INR', cartItems, user_id, shipping_address, accessToken } = req.body;

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
                    customer_email: shipping_address?.email,
                    customer_phone: shipping_address?.phone
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
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id, accessToken } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.VITE_RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
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
};

export const createCodOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', cartItems, user_id, shipping_address, accessToken } = req.body;

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
                    customer_email: shipping_address?.email,
                    customer_phone: shipping_address?.phone
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
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data, error } = await supabaseAdmin
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    variant:product_variants (
                        image_urls
                    )
                )
            `)
            .eq('customer_id', userId)
            .neq("payment_method", null)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Failed to fetch user orders' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const { data, error } = await supabaseAdmin
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    variant:product_variants (
                        image_urls,
                        id,
                        color:colors (
                            name
                        )
                    )
                )
            `)
            .eq('id', orderId)
            .eq('customer_id', userId) // Security check
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
};
