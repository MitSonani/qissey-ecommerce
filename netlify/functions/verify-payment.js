/* eslint-env node */
const crypto = require('crypto');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.VITE_RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
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
};
