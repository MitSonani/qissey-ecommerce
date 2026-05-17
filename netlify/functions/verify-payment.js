import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

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
            const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

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
