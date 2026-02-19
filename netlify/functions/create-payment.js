/* eslint-env node */
const Razorpay = require('razorpay');

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { amount, currency = 'INR' } = JSON.parse(event.body);

    const instance = new Razorpay({
        key_id: process.env.VITE_RAZORPAY_KEY_ID,
        key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: amount, // amount in the smallest currency unit
        currency: currency,
    };

    try {
        const order = await instance.orders.create(options);
        return {
            statusCode: 200,
            body: JSON.stringify(order),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
