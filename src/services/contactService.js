import { supabase } from '../lib/supabase';

/**
 * Submit a new contact message
 * @param {Object} messageData - The contact form data
 * @returns {Promise<Object>} The inserted data
 */
export async function submitContactMessage(messageData) {
    const { error } = await supabase
        .from('contact_messages')
        .insert(messageData);

    if (error) {
        console.error('Error submitting contact message:', error);
        throw error;
    }

    return true;
}
