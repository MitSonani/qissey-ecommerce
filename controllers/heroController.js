import { supabaseAdmin } from '../config/supabase.js';

let heroCache = {
    data: null,
    timestamp: null
};

const CACHE_DURATION = 5 * 60 * 1000;

export const clearHeroCache = () => {
    heroCache.data = null;
    heroCache.timestamp = null;
};

export const getHeroSlides = async (req, res) => {
    try {
        if (heroCache.data && (Date.now() - heroCache.timestamp < CACHE_DURATION)) {
            return res.json(heroCache.data);
        }

        const { data, error } = await supabaseAdmin
            .from('hero_slides')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true });

        if (error) throw error;

        heroCache = {
            data: data || [],
            timestamp: Date.now()
        };

        res.json(heroCache.data);
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        res.status(500).json({ error: 'Failed to fetch hero slides' });
    }
};
