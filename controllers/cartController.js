import { supabaseAdmin } from '../config/supabase.js';

export const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data, error } = await supabaseAdmin
            .from('cart_items')
            .select(`
                *,
                product:products(*, product_collections(collection_id)),
                variant:product_variants(*, color:colors(*))
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, variantId, size, quantity = 1, customMeasurements = null, notes = null } = req.body;

        const { data: items, error: fetchError } = await supabaseAdmin
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .eq('variant_id', variantId)
            .eq('size', size);

        if (fetchError) throw fetchError;

        const existing = items?.find(item => {
            if (!item.custom_measurements && !customMeasurements) return true;
            if (!item.custom_measurements || !customMeasurements) return false;
            
            const m1 = { ...item.custom_measurements };
            const m2 = { ...customMeasurements };
            delete m1.notes;
            delete m2.notes;
            return JSON.stringify(m1) === JSON.stringify(m2);
        });

        if (existing) {
            const { data, error } = await supabaseAdmin
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
            return res.status(200).json(data);
        } else {
            const { data, error } = await supabaseAdmin
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
            return res.status(201).json(data);
        }
    } catch (error) {
        console.error('Error adding to database cart:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        const { data, error } = await supabaseAdmin
            .from('cart_items')
            .update({ quantity, updated_at: new Date() })
            .eq('id', cartItemId)
            // Ideally we also add .eq('user_id', req.user.id) for security, assuming cartItemId exists and belongs to user
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ error: 'Failed to update cart quantity' });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { error } = await supabaseAdmin
            .from('cart_items')
            .delete()
            .eq('id', cartItemId);
            // .eq('user_id', req.user.id) // For better security

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { error } = await supabaseAdmin
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};
