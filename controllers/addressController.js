import { supabaseAdmin } from '../config/supabase.js';

export const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data, error } = await supabaseAdmin
            .from('user_addresses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
};

export const createAddress = async (req, res) => {
    try {
        const addressData = req.body;
        // Ensure user ID is the one from the token
        addressData.user_id = req.user.id;
        
        const { data, error } = await supabaseAdmin
            .from('user_addresses')
            .insert(addressData)
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({ error: 'Failed to create address' });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.id;
        
        // Ensure the address belongs to the user
        const { error } = await supabaseAdmin
            .from('user_addresses')
            .delete()
            .eq('id', addressId)
            .eq('user_id', userId);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ error: 'Failed to delete address' });
    }
};
