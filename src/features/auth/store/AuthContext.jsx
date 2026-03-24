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
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'TOKEN_REFRESHED' && !session) {
                // Token refresh failed — session expired
                await supabase.auth.signOut();
                setUser(null);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            } else {
                setUser(session?.user ?? null);
            }
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

            // Use RPC to bypass RLS (user is unauthenticated at this point)
            // Try exact match first
            let { data: foundEmail, error: rpcError } = await supabase
                .rpc('get_email_by_phone', { check_phone: cleanIdentifier });

            // If not found and identifier doesn't have a prefix, try adding +91
            if (!foundEmail && !cleanIdentifier.startsWith('+')) {
                const { data: emailWithPrefix } = await supabase
                    .rpc('get_email_by_phone', { check_phone: `+91${cleanIdentifier}` });

                foundEmail = emailWithPrefix;
            }

            if (!foundEmail) {
                throw new Error('No account found with this mobile number.');
            }
            email = foundEmail;
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

    const register = async (email, name, phone) => {
        // Pre-check if email already exists (uses RPC to bypass RLS)
        const { data: emailExists, error: emailCheckError } = await supabase
            .rpc('check_email_exists', { check_email: email });

        if (emailCheckError) throw emailCheckError;
        if (emailExists) {
            throw new Error('This email is already registered. Please log in instead.');
        }

        // Pre-check if phone already exists (uses RPC to bypass RLS)
        const { data: phoneExists, error: phoneCheckError } = await supabase
            .rpc('check_phone_exists', { check_phone: phone });

        if (phoneCheckError) throw phoneCheckError;
        if (phoneExists) {
            throw new Error('This mobile number is already registered. Please use another.');
        }

        // Use OTP-based registration (passwordless)
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
                data: {
                    name: name,
                    phone: phone,
                }
            }
        });

        if (error) throw error;
        return data;
    };

    const verifyOtp = async (email, token) => {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        });
        if (error) {
            if (error.message.toLowerCase().includes('expired')) {
                throw new Error('Your verification code has expired. Please resend a new code.');
            }
            if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('token')) {
                throw new Error('Invalid verification code. Please check and try again.');
            }
            throw error;
        }
        return data;
    };

    const resendOtp = async (email) => {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false,
            }
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
