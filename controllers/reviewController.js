import { supabaseAdmin } from '../config/supabase.js';

/**
 * Fetch recent reviews across all products (for the homepage slider)
 */
export const getRecentReviews = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;

        const { data, error } = await supabaseAdmin
            .from('product_reviews')
            .select(`
                id,
                rating,
                comment,
                user_name,
                created_at,
                product_id,
                products (
                    name,
                    slug
                )
            `)
            .order('created_at', { ascending: false })
            .eq('status', 'approved')
            .limit(limit);

        if (error) throw error;

        res.json(data || []);
    } catch (error) {
        console.error('Error fetching recent reviews:', error);
        res.status(500).json({ error: 'Failed to fetch recent reviews' });
    }
};

/**
 * Fetch reviews for a specific product
 */
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const { data, error } = await supabaseAdmin
            .from('product_reviews')
            .select('*')
            .eq('product_id', productId)
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data || []);
    } catch (error) {
        console.error('Error fetching product reviews:', error);
        res.status(500).json({ error: 'Failed to fetch product reviews' });
    }
};

/**
 * Create a new product review
 */
export const createProductReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment, user_name } = req.body;
        const userId = req.user?.id || null;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
        }

        if (!comment || comment.trim() === '') {
            return res.status(400).json({ error: 'Comment is required' });
        }

        // Get user's name if user_name is not provided
        let finalName = user_name;
        if (!finalName || finalName.trim() === '') {
            if (userId) {
                const { data: user, error: userError } = await supabaseAdmin
                    .from('users')
                    .select('name')
                    .eq('id', userId)
                    .single();

                if (userError) {
                    console.error('Error fetching user for review name:', userError);
                }
                finalName = user?.name || 'Verified User';
            } else {
                finalName = 'Anonymous';
            }
        }

        const { data, error } = await supabaseAdmin
            .from('product_reviews')
            .insert({
                product_id: productId,
                user_id: userId,
                rating,
                comment: comment.trim(),
                user_name: finalName.trim()
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating product review:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
};
