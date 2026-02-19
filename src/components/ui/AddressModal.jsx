import { X } from 'lucide-react';
import { Button, cn, Spinner } from './Primitives';
import { useState, useEffect } from 'react';

export default function AddressModal({ isOpen, onClose, onSubmit, isProcessing, totalAmount, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        line1: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'IN'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData
            }));
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const requiredFields = ['name', 'email', 'phone', 'line1', 'city', 'state', 'postal_code'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            onSubmit(formData);
        } else {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    const InputField = ({ label, name, type = "text", placeholder, className, disabled = false }) => (
        <div className={cn("flex flex-col gap-2", className)}>
            <label className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-semibold">{label}</label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                disabled={disabled || isProcessing}
                className={cn(
                    "w-full border-b py-2 text-sm font-medium focus:outline-none transition-all duration-300 bg-transparent rounded-none",
                    disabled
                        ? "text-black/40 cursor-not-allowed border-transparent"
                        : "border-black/20 focus:border-black placeholder:text-black/10"
                )}
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>
            <div className="bg-white w-full max-w-[500px] relative shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">

                {/* Header */}
                <div className="px-10 pt-10 pb-2 flex items-center justify-between shrink-0">
                    <p className="text-lg font-medium uppercase tracking-[0.2em] text-black">Shipping Details</p>
                    <button
                        onClick={onClose}
                        className="text-black/20 hover:text-black transition-colors duration-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="px-10 py-6 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="flex flex-col gap-8">
                        {/* Personal Info */}
                        <div className="flex flex-col gap-6">
                            <InputField label="Full Name" name="name" placeholder="JOHN DOE" />
                            <div className="grid grid-cols-2 gap-6">
                                <InputField label="Email" name="email" type="email" placeholder="email@example.com" disabled={true} />
                                <InputField label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" disabled={true} />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex flex-col gap-6">
                            <InputField label="Address Line 1" name="line1" placeholder="FLAT / HOUSE NO / STREET" />
                            <div className="grid grid-cols-2 gap-6">
                                <InputField label="City" name="city" placeholder="MUMBAI" />
                                <InputField label="Pincode" name="postal_code" placeholder="400001" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <InputField label="State" name="state" placeholder="MAHARASHTRA" />
                                <InputField label="Country" name="country" placeholder="INDIA" disabled={true} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-10 py-8 mt-auto shrink-0 bg-neutral-50 border-t border-black/5">
                    <div className="flex justify-between items-end mb-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] uppercase tracking-widest text-black/40">Total Amount</span>
                            <span className="text-xl font-medium uppercase tracking-widest text-black ">
                                ₹ {totalAmount.toLocaleString('en-IN')}.00
                            </span>
                        </div>

                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="w-full h-14 bg-black text-white text-xs font-bold uppercase tracking-[0.25em] rounded-none hover:bg-black/90 transition-all duration-300 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3"
                    >
                        {isProcessing ? (
                            <>
                                <Spinner className="text-white" />
                                <span>PROCESSING...</span>
                            </>
                        ) : 'PROCEED TO PAYMENT'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
