import React, { useState } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../auth';
import { toast } from 'sonner';
import Addresses from './Addresses';

export default function MyDetails({ user }) {
    const { updateProfile, logout } = useAuth();
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [activeView, setActiveView] = useState('details'); // 'details' | 'addresses'

    const userName = user?.user_metadata?.name || '';
    const userPhone = user?.user_metadata?.phone || '';

    const handleEditClick = (field, currentValue) => {
        setEditingField(field);
        setEditValue(currentValue);
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue('');
    };

    const handleSave = async () => {
        const trimmed = editValue.trim();
        if (!trimmed) {
            toast.error(`${editingField} cannot be empty`);
            return;
        }

        setIsSaving(true);
        try {
            const updateData = {
                name: userName,
                phone: userPhone,
            };
            updateData[editingField] = trimmed;
            await updateProfile(updateData);
            toast.success(`${editingField.charAt(0).toUpperCase() + editingField.slice(1)} updated`);
            setEditingField(null);
            setEditValue('');
        } catch (error) {
            toast.error(error.message || 'Failed to update');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await logout();
        } catch (error) {
            toast.error('Failed to sign out');
        }
    };

    // ─── Addresses View ───
    if (activeView === 'addresses') {
        return <Addresses user={user} onBack={() => setActiveView('details')} />;
    }

    // ─── Details View ───
    return (
        <div className="pt-8 md:pt-16 max-w-[600px]">
            {/* User Name */}
            <p className="text-[13px] md:text-[14px] tracking-[0.2em] uppercase font-bold text-black mb-12">
                {userName || 'USER'}
            </p>

            {/* Navigation Rows */}
            <div className="border-t border-black/5">
                <LinkRow label="ADDRESSES" onClick={() => setActiveView('addresses')} />
            </div>

            {/* Personal Details Section */}
            <div className="mt-12">
                <p className="text-[11px] md:text-[12px] tracking-[0.2em] uppercase font-bold text-black mb-6">
                    PERSONAL DETAILS
                </p>

                <div className="border-t border-black/5">

                    {/* Phone */}
                    <DetailRow
                        label="PHONE"
                        value={userPhone}
                        isEditing={editingField === 'phone'}
                        editValue={editValue}
                        onEditChange={setEditValue}
                        onClick={() => handleEditClick('phone', userPhone)}
                        onCancel={handleCancel}
                        onSave={handleSave}
                        isSaving={isSaving}
                        isReadOnly
                    />

                    {/* Name */}
                    <DetailRow
                        label="NAME"
                        value={userName}
                        isEditing={editingField === 'name'}
                        editValue={editValue}
                        onEditChange={setEditValue}
                        onClick={() => handleEditClick('name', userName)}
                        onCancel={handleCancel}
                        onSave={handleSave}
                        isSaving={isSaving}
                    />
                </div>
            </div>
        </div>
    );
}

function LinkRow({ label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between py-5 border-b border-black/5 group text-left"
        >
            <span className="text-[11px] md:text-[12px] tracking-[0.15em] uppercase text-black font-normal group-hover:opacity-60 transition-opacity">
                {label}
            </span>
            <ChevronRight className="w-4 h-4 text-black/30 group-hover:text-black/60 transition-colors" />
        </button>
    );
}

function DetailRow({
    label,
    value,
    isEditing,
    editValue,
    onEditChange,
    onClick,
    onCancel,
    onSave,
    isSaving,
    isReadOnly = false,
}) {
    if (isEditing) {
        return (
            <div className="py-5 border-b border-black/5">
                <p className="text-[10px] tracking-[0.15em] uppercase text-black/40 mb-2">
                    {label}
                </p>
                <input
                    type="text"
                    value={editValue}
                    onChange={(e) => onEditChange(e.target.value)}
                    autoFocus
                    className="w-full text-[12px] md:text-[13px] tracking-wide text-black bg-transparent border-b border-black/20 focus:border-black outline-none pb-2 mb-4 transition-colors"
                />
                <div className="flex gap-6">
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="text-[10px] tracking-[0.15em] uppercase font-bold text-black hover:opacity-60 transition-opacity disabled:opacity-40 flex items-center gap-2"
                    >
                        {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                        SAVE
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="text-[10px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors disabled:opacity-40"
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={isReadOnly ? undefined : onClick}
            className={`w-full flex items-center justify-between py-5 border-b border-black/5 text-left group ${isReadOnly ? 'cursor-default' : ''}`}
        >
            <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-black/40 mb-1">
                    {label}
                </p>
                <p className="text-[12px] md:text-[13px] tracking-wide text-black font-normal">
                    {value || <span className="text-black/20 italic">Not provided</span>}
                </p>
            </div>
            {!isReadOnly && (
                <ChevronRight className="w-4 h-4 text-black/30 group-hover:text-black/60 transition-colors flex-shrink-0" />
            )}
        </button>
    );
}
