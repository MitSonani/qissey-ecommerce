import { supabase } from '../lib/supabase';

/**
 * Fetch orders for a specific user including their items and product images
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} Array of order objects with nested items
 */
export const fetchUserOrders = async (userId) => {
    if (!userId) return [];

    try {
        const { data, error } = await supabase
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

        if (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }

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
        const { data, error } = await supabase
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
            .single();

        if (error) {
            console.error('Error fetching order by ID:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch order details:', error);
        return null;
    }
};
