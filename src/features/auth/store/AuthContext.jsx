import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem('custom_auth_token');

            if (token) {
                try {
                    const res = await fetch('/api/auth/verify-user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to verify user');
                    }

                    setUser(data.user);

                } catch (err) {
                    console.error('Session expired or invalid:', err);

                    localStorage.removeItem('custom_auth_token');
                    setUser(null);
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        };

        checkSession();
    }, []);

    const login = async (identifier) => {
        // identifier is assumed to be phone number
        const response = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: identifier, action: 'login' })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to send OTP');
        }
        return { phone: identifier };
    };

    const register = async (name, phone) => {
        // The previous component passed email, name, phone. We just use name and phone.
        const response = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, name, action: 'register' })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to send OTP');
        }
        return { phone };
    };

    const verifyOtp = async (identifier, otp) => {
        // Previous UI might pass email as identifier, but we need phone.
        // Assuming identifier contains the phone number or the UI has been adapted
        const phone = identifier;

        const response = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, otp })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to verify OTP');
        }

        // Save token
        localStorage.setItem('custom_auth_token', data.session.access_token);

        // Fetch full user details from DB
        const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

        if (userProfile && !error) {
            setUser(userProfile);
        } else {
            setUser(data.session.user);
        }
        return data;
    };

    const resendOtp = async (phone) => {
        return login(phone);
    };

    const logout = async () => {
        localStorage.removeItem('custom_auth_token');
        setUser(null);

    };

    const updateProfile = async (updates) => {
        if (!user?.id) throw new Error('Not logged in');
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        if (error) throw error;
        if (data) {
            setUser(data);
        }
        return data;
    };

    const value = React.useMemo(() => ({
        user,
        loading,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        updateProfile,
        isAuthenticated: !!user
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
