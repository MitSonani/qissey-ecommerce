import { supabaseAdmin } from '../config/supabase.js';

export const submitContactMessage = async (req, res) => {
    try {
        const messageData = req.body;
        const { error } = await supabaseAdmin
            .from('contact_messages')
            .insert(messageData);

        if (error) throw error;
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error submitting contact message:', error);
        res.status(500).json({ error: 'Failed to submit contact message' });
    }
};
