import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { createShiprocketOrder } from './utils/shiprocket.js';

export const handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id, accessToken } = JSON.parse(event.body);

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

            try {
                let orderQuery = supabaseAdmin.from('orders').select('*');
                if (db_order_id) orderQuery = orderQuery.eq('id', db_order_id);
                else orderQuery = orderQuery.eq('razorpay_order_id', razorpay_order_id);

                const { data: order, error: orderFetchError } = await orderQuery.single();

                if (order && !orderFetchError) {
                    const { data: orderItems, error: itemsFetchError } = await supabaseAdmin
                        .from('order_items')
                        .select('*')
                        .eq('order_id', order.id);

                    if (orderItems && !itemsFetchError) {
                        console.log('Starting Shiprocket Automation for Order:', order.id);

                        const shipRes = await createShiprocketOrder(order, orderItems);
                        console.log('Shiprocket Result:', shipRes);

                        const shippingUpdate = {
                            shiprocket_order_id: shipRes.shiprocket_order_id,
                            shiprocket_shipment_id: shipRes.shiprocket_shipment_id,
                            shiprocket_awb: shipRes.awb_code,
                            status: 'pending',
                            label_url: shipRes.label_url,
                        };

                        const { error: shipUpdateError } = await supabaseAdmin
                            .from('orders')
                            .update(shippingUpdate)
                            .eq('id', order.id);

                        if (shipUpdateError) {
                            console.error('Error updating order with Shiprocket details:', shipUpdateError);
                        } else {
                            console.log('Successfully updated order with Shiprocket details:', shippingUpdate);
                        }
                    }
                }
            } catch (shippingError) {
                console.error('Shiprocket Automation Failed:', shippingError);
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, error: 'Invalid signature' }),
            };
        }
    } catch (error) {
        console.error('Verify Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
