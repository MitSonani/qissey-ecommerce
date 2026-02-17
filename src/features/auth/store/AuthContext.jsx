import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (identifier) => {
        let email = identifier;

        // Check if identifier is a phone number (not containing @)
        if (!identifier.includes('@')) {
            // Remove any spaces or dashes for comparison
            const cleanIdentifier = identifier.replace(/[\s-]/g, '');

            // Try exact match first
            let { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('email')
                .eq('phone', cleanIdentifier)
                .maybeSingle();

            // If not found and identifier doesn't have a prefix, try adding +91
            if (!profile && !cleanIdentifier.startsWith('+')) {
                const { data: profileWithPrefix } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('phone', `+91${cleanIdentifier}`)
                    .maybeSingle();
                profile = profileWithPrefix;
            }

            if (!profile) {
                throw new Error('No account found with this mobile number.');
            }
            email = profile.email;
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                // This ensures we get a token/OTP instead of a magic link if configured correctly in Supabase
                shouldCreateUser: false,
            }
        });

        if (error) {
            if (error.message === 'Signups not allowed for otp') {
                throw new Error('This email is not registered. Please register first.');
            }
            throw error;
        }
        return { email };
    };

    const register = async (email, password, name, phone) => {
        // Pre-check if email or phone already exists in our profiles table
        const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('email, phone')
            .or(`email.eq.${email},phone.eq.${phone}`)
            .single();

        if (existingProfile) {
            if (existingProfile.email === email) {
                throw new Error('This email is already registered. Please log in instead.');
            }
            if (existingProfile.phone === phone) {
                throw new Error('This mobile number is already registered. Please use another.');
            }
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    phone: phone,
                }
            }
        });

        if (error) throw error;

        // Fallback for email check (if enumeration protection is on and trigger hasn't fired yet)
        if (data?.user?.identities?.length === 0) {
            throw new Error('This email is already registered. Please log in instead.');
        }

        return data;
    };

    const verifyOtp = async (email, token, type = 'signup') => {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type,
        });
        if (error) throw error;
        return data;
    };

    const resendOtp = async (email, type = 'signup') => {
        const { data, error } = await supabase.auth.resend({
            email,
            type,
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const value = React.useMemo(() => ({
        user,
        loading,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        isAuthenticated: !!user
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
