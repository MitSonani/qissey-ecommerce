import { fetchApi } from '../../../lib/apiClient';

/**
 * Fetches all cart items for a specific user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getCartItems(userId) {
    if (!userId) return [];
    try {
        const data = await fetchApi('/cart');
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
        const data = await fetchApi('/cart', {
            method: 'POST',
            body: JSON.stringify({
                productId,
                variantId,
                size,
                quantity,
                customMeasurements,
                notes
            })
        });
        return data;
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
        const data = await fetchApi(`/cart/${cartItemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
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
        await fetchApi(`/cart/${cartItemId}`, {
            method: 'DELETE'
        });
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
        await fetchApi('/cart', {
            method: 'DELETE'
        });
        return true;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return false;
    }
}
