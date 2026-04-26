import { supabase } from '../../../lib/supabase';

/**
 * Fetch all active hero slides from Supabase
 * @returns {Promise<Array>} Array of hero slide objects
 */
export const fetchHeroSlides = async () => {
    try {
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true });

        if (error) throw error;
        
        return data || [];
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        return [];
    }
};
