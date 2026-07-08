import { fetchApi } from '../lib/apiClient';

/**
 * Fetch orders for a specific user including their items and product images
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} Array of order objects with nested items
 */
export const fetchUserOrders = async (userId) => {
    if (!userId) return [];
    try {
        const data = await fetchApi('/orders');
        return data || [];
    } catch (error) {
        console.error('Failed to fetch user orders:', error);
        return [];
    }
};

/**
 * Fetch a single order by ID including items and shipping address
 * @param {string} orderId - Order UUID
 * @returns {Promise<Object|null>} Order object or null
 */
export const fetchOrderById = async (orderId) => {
    if (!orderId) return null;
    try {
        const data = await fetchApi(`/orders/${orderId}`);
        return data;
    } catch (error) {
        console.error('Failed to fetch order details:', error);
        return null;
    }
};
