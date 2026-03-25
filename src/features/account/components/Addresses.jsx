import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal, Loader2 } from 'lucide-react';
import { useAuth } from '../../auth';
import { fetchUserAddresses, createAddress, deleteAddress } from '../../../services/addressService';
import { toast } from 'sonner';

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export default function Addresses({ user, onBack }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' | 'form'
    const [isSaving, setIsSaving] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [errors, setErrors] = useState({});

    const getInitialPhone = (phoneStr) => {
        if (!phoneStr) return '';
        let s = phoneStr.replace(/[\s-]/g, '');
        if (s.startsWith('+91')) return s.substring(3);
        if (s.startsWith('0') && s.length > 10) return s.substring(1);
        return s;
    };

    const [formData, setFormData] = useState({
        name: user?.user_metadata?.name || '',
        line1: '',
        landmark: '',
        locality: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        phone: getInitialPhone(user?.user_metadata?.phone),
    });

    useEffect(() => {
        loadAddresses();
    }, [user?.id]);

    const loadAddresses = async () => {
        if (!user?.id) return;
        setLoading(true);
        const data = await fetchUserAddresses(user.id);
        setAddresses(data);
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;
        if (name === 'postal_code') {
            newValue = value.replace(/[^0-9]/g, '');
            if (newValue.length > 6) return;
        } else if (name === 'phone') {
            let cleaned = value.replace(/[\s-]/g, ''); // Strip spaces and dashes

            if (cleaned.startsWith('+91')) {
                cleaned = cleaned.substring(3);
            } else if (cleaned.length > 10 && cleaned.startsWith('91')) {
                cleaned = cleaned.substring(2);
            } else if (cleaned.length > 10 && cleaned.startsWith('0')) {
                cleaned = cleaned.substring(1);
            }

            cleaned = cleaned.replace(/[^0-9]/g, '');
            if (cleaned.length > 10) return;
            newValue = cleaned;
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: user?.user_metadata?.name || '',
            line1: '',
            landmark: '',
            locality: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'India',
            phone: getInitialPhone(user?.user_metadata?.phone),
        });
        setErrors({});
    };

    const handleSave = async () => {
        const required = ['name', 'line1', 'city', 'state', 'postal_code', 'phone'];
        const newErrors = {};

        required.forEach(f => {
            if (!formData[f]?.trim()) {
                newErrors[f] = true;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        try {
            await createAddress({
                user_id: user.id,
                ...formData,
            });
            toast.success('Address saved');
            resetForm();
            setView('list');
            await loadAddresses();
        } catch (error) {
            toast.error(error.message || 'Failed to save address');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAddress(id);
            toast.success('Address removed');
            setMenuOpenId(null);
            await loadAddresses();
        } catch (error) {
            toast.error('Failed to delete address');
        }
    };

    // ─── Form View ───
    if (view === 'form') {
        return (
            <div className="pt-8 md:pt-16 max-w-[700px]">
                <button
                    onClick={() => { resetForm(); setView('list'); }}
                    className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors mb-10"
                >
                    <ArrowLeft className="w-4 h-4" />
                    BACK
                </button>

                <p className="text-[13px] md:text-[14px] tracking-[0.2em] uppercase font-bold text-black mb-12">
                    NEW ADDRESS
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <FormField
                        label="NAME"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                    />
                    <FormField
                        label="PINCODE"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        error={errors.postal_code}
                        maxLength={6}
                        inputMode="numeric"
                    />
                    <FormField
                        label="ADDRESS"
                        name="line1"
                        value={formData.line1}
                        onChange={handleInputChange}
                        error={errors.line1}
                    />
                    <FormField
                        label="LANDMARK"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        optional
                    />
                    <FormField
                        label="LOCALITY"
                        name="locality"
                        value={formData.locality}
                        onChange={handleInputChange}
                    />
                    <FormField
                        label="CITY"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        error={errors.city}
                    />
                    {/* State Dropdown */}
                    <div className="flex flex-col gap-1 relative">
                        <label className={`text-[10px] tracking-[0.15em] uppercase ${errors.state ? 'text-red-500' : 'text-black/40'}`}>
                            STATE
                        </label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className={`w-full border-b py-2 text-[12px] md:text-[13px] tracking-wide bg-transparent outline-none transition-colors appearance-none cursor-pointer ${errors.state ? 'border-red-500 text-black' : 'border-black/10 focus:border-black text-black'
                                }`}
                        >
                            <option value="">Select State</option>
                            {INDIAN_STATES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                    </div>

                    <FormField
                        label="REGION"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled
                    />

                    {/* Phone with prefix */}
                    <div className="flex flex-col gap-1 relative">
                        <label className={`text-[10px] tracking-[0.15em] uppercase ${errors.phone ? 'text-red-500' : 'text-black/40'}`}>
                            MOBILE NO
                        </label>
                        <div className="flex gap-3 items-end">
                            <span className={`text-[12px] md:text-[13px] tracking-wide border-b py-2 w-12 ${errors.phone ? 'border-red-500 text-black/40' : 'border-black/10 text-black/40'}`}>
                                +91
                            </span>
                            <input
                                type="tel"
                                inputMode="numeric"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`flex-1 border-b py-2 text-[12px] md:text-[13px] tracking-wide bg-transparent outline-none transition-colors ${errors.phone ? 'border-red-500 text-black' : 'border-black/10 focus:border-black text-black'
                                    }`}
                            />
                        </div>

                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-12 mb-16">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="border border-black px-12 py-3 text-[11px] tracking-[0.2em] uppercase font-bold text-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-40 flex items-center gap-2"
                    >
                        {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                        SAVE
                    </button>
                </div>
            </div>
        );
    }

    // ─── List View ───
    return (
        <div className="pt-8 md:pt-16 max-w-[600px]">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors mb-10"
            >
                <ArrowLeft className="w-4 h-4" />
                BACK
            </button>


            {loading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader2 className="w-5 h-5 animate-spin text-black/20" />
                </div>
            ) : (
                <div className="space-y-8">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="relative">
                            {/* Menu button */}
                            <button
                                onClick={() => setMenuOpenId(menuOpenId === addr.id ? null : addr.id)}
                                className="absolute top-0 right-0 p-1 text-black/30 hover:text-black transition-colors"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {menuOpenId === addr.id && (
                                <div className="absolute top-6 right-0 bg-white border border-black/10 shadow-lg z-10">
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="px-6 py-3 text-[10px] tracking-[0.15em] uppercase text-black hover:bg-black/5 transition-colors w-full text-left"
                                    >
                                        DELETE
                                    </button>
                                </div>
                            )}

                            <div className="text-[12px] md:text-[13px] tracking-wide leading-relaxed text-black font-normal pr-8">
                                <p className="font-bold mb-1">{addr.name}</p>
                                <p>{addr.line1}</p>
                                {addr.landmark && <p>{addr.landmark}</p>}
                                {addr.locality && <p>{addr.locality}</p>}
                                <p>{addr.city} {addr.postal_code}</p>
                                <p className="uppercase">{addr.state}</p>
                                <p>{addr.phone}</p>
                            </div>
                        </div>
                    ))}

                    {addresses.length === 0 && (
                        <p className="text-[11px] tracking-[0.15em] uppercase text-black/30 py-8">
                            No saved addresses
                        </p>
                    )}

                    {/* Add Address Button */}
                    <button
                        onClick={() => setView('form')}
                        className="border border-black px-10 py-3 text-[11px] tracking-[0.2em] uppercase font-bold text-black hover:bg-black hover:text-white transition-all duration-300 mt-4"
                    >
                        ADD ADDRESS
                    </button>
                </div>
            )}
        </div>
    );
}

function FormField({ label, name, value, onChange, optional = false, disabled = false, error, maxLength, inputMode }) {
    return (
        <div className="flex flex-col gap-1 relative">
            <label className={`text-[10px] tracking-[0.15em] uppercase ${error ? 'text-red-500' : 'text-black/40'}`}>
                {label}
                {optional && <span className="ml-2 text-black/20">(Optional)</span>}
            </label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                maxLength={maxLength}
                inputMode={inputMode}
                className={`w-full border-b py-2 text-[12px] md:text-[13px] tracking-wide bg-transparent outline-none transition-colors ${disabled
                    ? 'text-black/40 border-transparent cursor-not-allowed'
                    : error
                        ? 'text-black border-red-500 focus:border-red-500'
                        : 'text-black border-black/10 focus:border-black'
                    }`}
            />
        </div>
    );
}
