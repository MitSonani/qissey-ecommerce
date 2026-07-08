import { fetchApi } from '../lib/apiClient';

/**
 * Submit a new contact message
 * @param {Object} messageData - The contact form data
 * @returns {Promise<Object>} The inserted data
 */
export async function submitContactMessage(messageData) {
    try {
        await fetchApi('/contact', {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
        return true;
    } catch (error) {
        console.error('Error submitting contact message:', error);
        throw error;
    }
}
