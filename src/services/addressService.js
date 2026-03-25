import { supabase } from '../lib/supabase';

/**
 * Fetches all addresses for a given user
 * @param {string} userId - The user's UUID
 * @returns {Promise<Array>} Array of address objects
 */
export async function fetchUserAddresses(userId) {
    const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching addresses:', error);
        return [];
    }
    return data || [];
}

/**
 * Creates a new address for the user
 * @param {Object} addressData - The address fields
 * @returns {Promise<Object>} The created address
 */
export async function createAddress(addressData) {
    const { data, error } = await supabase
        .from('user_addresses')
        .insert(addressData)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Deletes an address by ID
 * @param {string} addressId - The address UUID
 * @returns {Promise<void>}
 */
export async function deleteAddress(addressId) {
    const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId);

    if (error) throw error;
}
