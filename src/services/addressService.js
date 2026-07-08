import { fetchApi } from '../lib/apiClient';

/**
 * Fetches all addresses for a given user
 * @param {string} userId - The user's UUID
 * @returns {Promise<Array>} Array of address objects
 */
export async function fetchUserAddresses(userId) {
    if (!userId) return [];
    try {
        const data = await fetchApi('/addresses');
        return data || [];
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return [];
    }
}

/**
 * Creates a new address for the user
 * @param {Object} addressData - The address fields
 * @returns {Promise<Object>} The created address
 */
export async function createAddress(addressData) {
    return await fetchApi('/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData)
    });
}

/**
 * Deletes an address by ID
 * @param {string} addressId - The address UUID
 * @returns {Promise<void>}
 */
export async function deleteAddress(addressId) {
    await fetchApi(`/addresses/${addressId}`, {
        method: 'DELETE'
    });
}
