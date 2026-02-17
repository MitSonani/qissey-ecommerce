import { supabase } from '../../../lib/supabase';

/**
 * Fetches all cart items for a specific user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getCartItems(userId) {
    if (!userId) return [];

    try {
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                *,
                product:products(*),
                variant:product_variants(*, color:colors(*))
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return [];
    }
}

/**
 * Adds an item to the cart or increments quantity if already exists
 * @param {string} userId
 * @param {string} productId
 * @param {string} variantId
 * @param {string} size
 * @param {number} quantity
 * @param {Object} customMeasurements
 * @param {string} notes
 */
export async function addToCartDB(userId, productId, variantId, size, quantity = 1, customMeasurements = null, notes = null) {
    if (!userId) return null;

    try {
        // Fetch items for this product/variant/size to check for a true match
        // We fetch multiple because there might be multiple custom sizes
        const { data: items, error: fetchError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .eq('variant_id', variantId)
            .eq('size', size);

        if (fetchError) throw fetchError;

        // Find match in JS to handle JSON comparison correctly
        const existing = items?.find(item => {
            // If both are null, it's a match
            if (!item.custom_measurements && !customMeasurements) return true;
            // If only one is null, it's not a match
            if (!item.custom_measurements || !customMeasurements) return false;

            // Deep compare measurements (excluding notes if they are part of the object)
            // Actually, let's just stringify for a simple check if they aren't complex
            const m1 = { ...item.custom_measurements };
            const m2 = { ...customMeasurements };
            delete m1.notes;
            delete m2.notes;
            return JSON.stringify(m1) === JSON.stringify(m2);
        });

        if (existing) {
            const { data, error } = await supabase
                .from('cart_items')
                .update({
                    quantity: existing.quantity + quantity,
                    custom_measurements: customMeasurements || existing.custom_measurements,
                    notes: notes || existing.notes,
                    updated_at: new Date()
                })
                .eq('id', existing.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabase
                .from('cart_items')
                .insert([{
                    user_id: userId,
                    product_id: productId,
                    variant_id: variantId,
                    size,
                    quantity,
                    custom_measurements: customMeasurements,
                    notes: notes
                }])
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Error adding to database cart:', error);
        return null;
    }
}

/**
 * Updates item quantity in the database
 * @param {string} cartItemId
 * @param {number} quantity
 */
export async function updateCartQuantityDB(cartItemId, quantity) {
    try {
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity, updated_at: new Date() })
            .eq('id', cartItemId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        return null;
    }
}

/**
 * Removes an item from the cart in the database
 * @param {string} cartItemId
 */
export async function removeFromCartDB(cartItemId) {
    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', cartItemId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing from cart:', error);
        return false;
    }
}

/**
 * Clears the entire cart for a user (e.g., after order placement)
 * @param {string} userId
 */
export async function clearCartDB(userId) {
    if (!userId) return false;

    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return false;
    }
}
