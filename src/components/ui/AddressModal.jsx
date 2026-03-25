import { X, Check } from 'lucide-react';
import { Button, cn, Spinner } from './Primitives';
import { useState, useEffect } from 'react';
import { fetchUserAddresses, createAddress } from '../../services/addressService';
import { toast } from 'sonner';

const InputField = ({ label, name, type = "text", placeholder, className, disabled = false, formData, onChange, isProcessing }) => (
    <div className={cn("flex flex-col gap-2", className)}>
        <label className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-semibold">{label}</label>
        <input
            type={type}
            name={name}
            value={formData[name] || ''}
            onChange={onChange}
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

export default function AddressModal({ isOpen, onClose, onSubmit, isProcessing, totalAmount, initialData, user }) {
    const [view, setView] = useState('loading'); // 'loading' | 'list' | 'form'
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isSavingAddress, setIsSavingAddress] = useState(false);

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

    useEffect(() => {
        let isMounted = true;
        const loadAddresses = async () => {
            if (user?.id) {
                try {
                    const userAddresses = await fetchUserAddresses(user.id);
                    if (isMounted) {
                        setAddresses(userAddresses);
                        if (userAddresses.length > 0) {
                            setSelectedAddressId(userAddresses[0].id);
                            setView('list');
                        } else {
                            setView('form');
                        }
                    }
                } catch (error) {
                    console.error("Failed to load addresses", error);
                    if (isMounted) setView('form');
                }
            } else {
                if (isMounted) setView('form');
            }
        };
        loadAddresses();
        return () => { isMounted = false; };
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [paymentMethod, setPaymentMethod] = useState('online');

    const handleFormSubmit = async () => {
        if (view === 'list') {
            const selectedAddr = addresses.find(a => a.id === selectedAddressId);
            if (selectedAddr) {
                const shippingData = {
                    name: selectedAddr.name,
                    email: initialData?.email || user?.email,
                    phone: selectedAddr.phone,
                    line1: selectedAddr.line1,
                    city: selectedAddr.city,
                    state: selectedAddr.state,
                    postal_code: selectedAddr.postal_code,
                    country: selectedAddr.country || 'IN',
                    paymentMethod
                };
                onSubmit(shippingData);
            } else {
                toast.error("Please select an address");
            }
        } else if (view === 'form') {
            const requiredFields = ['name', 'phone', 'line1', 'city', 'state', 'postal_code'];
            const missingFields = requiredFields.filter(field => !formData[field]);

            if (missingFields.length > 0) {
                toast.error(`Please fill in all required address fields`);
                return;
            }

            setIsSavingAddress(true);
            try {
                if (user?.id) {
                    await createAddress({
                        user_id: user.id,
                        name: formData.name,
                        phone: formData.phone,
                        line1: formData.line1,
                        city: formData.city,
                        state: formData.state,
                        postal_code: formData.postal_code,
                        country: formData.country || 'IN',
                        is_default: addresses.length === 0
                    });
                }
            } catch (error) {
                console.error("Error saving address to DB:", error);
            } finally {
                setIsSavingAddress(false);
                onSubmit({ ...formData, paymentMethod, email: initialData?.email || user?.email });
            }
        }
    };

    const isGlobalProcessing = isProcessing || isSavingAddress;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={!isGlobalProcessing ? onClose : undefined}
            ></div>
            <div className="bg-white w-full max-w-[500px] relative shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">

                {/* Header */}
                <div className="px-10 pt-10 pb-2 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        {view === 'form' && addresses.length > 0 && (
                            <button
                                onClick={() => setView('list')}
                                className="text-xs uppercase font-bold tracking-widest text-black/40 hover:text-black transition-colors"
                            >
                                ← Back
                            </button>
                        )}
                        <p className="text-lg font-medium uppercase tracking-[0.2em] text-black">
                            {view === 'list' ? 'Select Address' : 'Shipping Details'}
                        </p>
                    </div>
                    <button
                        onClick={!isGlobalProcessing ? onClose : undefined}
                        disabled={isGlobalProcessing}
                        className="text-black/20 hover:text-black transition-colors duration-300 disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="px-10 py-6 overflow-y-auto custom-scrollbar flex-grow">

                    {view === 'loading' && (
                        <div className="flex justify-center items-center py-20">
                            <Spinner className="text-black w-8 h-8" />
                        </div>
                    )}

                    {view === 'list' && (
                        <div className="flex flex-col gap-4">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => setSelectedAddressId(addr.id)}
                                    className={cn(
                                        "border p-5 cursor-pointer transition-all duration-300 relative",
                                        selectedAddressId === addr.id ? "border-black bg-neutral-50" : "border-black/10 hover:border-black/40"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-xs tracking-wider uppercase">{addr.name}</p>
                                        {selectedAddressId === addr.id && <Check size={16} className="text-black" />}
                                    </div>
                                    <div className="text-[10px] text-black/60 uppercase tracking-widest space-y-1.5 mt-4">
                                        <p>{addr.line1}</p>
                                        {addr.landmark && <p>{addr.landmark}</p>}
                                        <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                                        <p>{addr.country || 'IN'}</p>
                                        <p className="mt-3 text-black/80 font-medium">PHONE: {addr.phone}</p>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setView('form')}
                                className="w-full py-6 mt-2 border border-dashed border-black/20 text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black hover:border-black hover:bg-neutral-50 transition-all duration-300"
                            >
                                + Add New Address
                            </button>
                        </div>
                    )}

                    {view === 'form' && (
                        <div className="flex flex-col gap-8">
                            {/* Personal Info */}
                            <div className="flex flex-col gap-6">
                                <InputField
                                    label="Full Name"
                                    name="name"
                                    placeholder="JOHN DOE"
                                    formData={formData}
                                    onChange={handleInputChange}
                                    isProcessing={isGlobalProcessing}
                                />
                                <div className="grid grid-cols-2 gap-6">
                                    <InputField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        disabled={true}
                                        formData={formData}
                                        onChange={handleInputChange}
                                        isProcessing={isGlobalProcessing}
                                    />
                                    <InputField
                                        label="Phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        formData={formData}
                                        onChange={handleInputChange}
                                        isProcessing={isGlobalProcessing}
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex flex-col gap-6">
                                <InputField
                                    label="Address Line 1"
                                    name="line1"
                                    placeholder="FLAT / HOUSE NO / STREET"
                                    formData={formData}
                                    onChange={handleInputChange}
                                    isProcessing={isGlobalProcessing}
                                />
                                <div className="grid grid-cols-2 gap-6">
                                    <InputField
                                        label="City"
                                        name="city"
                                        placeholder="MUMBAI"
                                        formData={formData}
                                        onChange={handleInputChange}
                                        isProcessing={isGlobalProcessing}
                                    />
                                    <InputField
                                        label="Pincode"
                                        name="postal_code"
                                        placeholder="400001"
                                        formData={formData}
                                        onChange={handleInputChange}
                                        isProcessing={isGlobalProcessing}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <InputField
                                        label="State"
                                        name="state"
                                        placeholder="MAHARASHTRA"
                                        formData={formData}
                                        onChange={handleInputChange}
                                        isProcessing={isGlobalProcessing}
                                    />
                                    <InputField
                                        label="Country"
                                        name="country"
                                        placeholder="INDIA"
                                        disabled={true}
                                        formData={formData}
                                        onChange={handleInputChange}
                                        isProcessing={isGlobalProcessing}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {view !== 'loading' && (
                    <div className="px-10 py-8 mt-auto shrink-0 bg-neutral-50 border-t border-black/5">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] uppercase tracking-widest text-black/40">Total Amount</span>
                                <span className="text-xl font-medium uppercase tracking-widest text-black ">
                                    ₹ {totalAmount.toLocaleString('en-IN')}.00
                                </span>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPaymentMethod('online')}
                                    disabled={isGlobalProcessing}
                                    className={cn(
                                        "px-4 py-2 border text-[9px] font-bold uppercase tracking-widest transition-all duration-300 rounded-full",
                                        paymentMethod === 'online'
                                            ? "border-black bg-black text-white"
                                            : "border-black/10 text-black/40 hover:border-black/40"
                                    )}
                                >
                                    Online
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('cod')}
                                    disabled={isGlobalProcessing}
                                    className={cn(
                                        "px-4 py-2 border text-[9px] font-bold uppercase tracking-widest transition-all duration-300 rounded-full",
                                        paymentMethod === 'cod'
                                            ? "border-black bg-black text-white"
                                            : "border-black/10 text-black/40 hover:border-black/40"
                                    )}
                                >
                                    COD
                                </button>
                            </div>
                        </div>

                        <Button
                            onClick={handleFormSubmit}
                            disabled={isGlobalProcessing}
                            className="w-full h-14 bg-black text-white text-xs font-bold uppercase tracking-[0.25em] rounded-none hover:bg-black/90 transition-all duration-300 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3"
                        >
                            {isGlobalProcessing ? (
                                <>
                                    <Spinner className="text-white" />
                                    <span>PROCESSING...</span>
                                </>
                            ) : (
                                paymentMethod === 'online' ? 'PROCEED TO PAYMENT' : 'PLACE ORDER (COD)'
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

