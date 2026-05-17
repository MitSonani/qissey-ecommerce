const API_URL = '/api/hero';

/**
 * Fetch all active hero slides from backend API
 * @returns {Promise<Array>} Array of hero slide objects
 */
export const fetchHeroSlides = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return [];
    }
};
