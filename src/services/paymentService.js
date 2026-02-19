import { api } from './api';

export const paymentService = {
    createPaymentOrder: async (amount, currency = 'INR', additionalData = {}) => {
        try {
            const response = await api.post('/.netlify/functions/create-payment', {
                amount,
                currency,
                ...additionalData
            });
            return response;
        } catch (error) {
            console.error('Error creating payment order:', error);
            throw error;
        }
    },

    verifyPayment: async (paymentDetails) => {
        try {
            const response = await api.post('/.netlify/functions/verify-payment', paymentDetails);
            return response;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    },
};
