import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';


const LoadingDots = () => (
    <div className="flex justify-center items-center gap-1 h-3">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.2
                }}
                className="w-1 h-1 bg-current rounded-full"
            />
        ))}
    </div>
);

const FloatingInput = ({ label, value, onChange, type = "text", required = false, className, prefix, readOnly = false }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={"relative border-b border-[#1A1A1A]/20 py-1 transition-colors group " + (className || "")}>
            <motion.label
                initial={false}
                animate={{
                    y: (isFocused || value) ? -18 : 0,
                    scale: (isFocused || value) ? 0.8 : 1,
                    opacity: (isFocused || value) ? 0.4 : 0.3,
                }}
                className="absolute left-0 top-1 text-[10px] uppercase font-bold tracking-widest pointer-events-none origin-left"
            >
                {label}
            </motion.label>
            <div className="flex items-center">
                {prefix && (
                    <span className="text-[11px] font-medium tracking-wide pt-1 mr-2 opacity-60">{prefix}</span>
                )}
                <input
                    type={type}
                    required={required}
                    value={value}
                    onFocus={() => !readOnly && setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={readOnly ? undefined : onChange}
                    readOnly={readOnly}
                    className={`w-full bg-transparent outline-none text-[11px] font-medium tracking-wide pt-1 ${readOnly ? 'cursor-default' : ''}`}
                />
            </div>
        </div >
    );
};

const CustomCheckbox = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer group select-none py-1">
        <div className={`w-3.5 h-3.5 border border-[#1A1A1A]/20 flex items-center justify-center transition-colors ${checked ? 'bg-[#1A1A1A] border-[#1A1A1A]' : 'bg-transparent'}`}>
            {checked && <div className="w-1.5 h-1.5 bg-white scale-75" />}
        </div>
        <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={onChange}
        />
        <span className="text-[9px] text-[#1A1A1A]/60 font-medium uppercase tracking-tight group-hover:text-[#1A1A1A] transition-colors">
            {label}
        </span>
    </label>
);

export default function Auth() {
    const { user } = useAuth();

    const [authStep, setAuthStep] = useState('login'); // 'login', 'register', 'verify'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phonePrefix: '+91',
        phone: '',
        otp: '',
        acceptNews: false,
        acceptPrivacy: false
    });
    const { login, register, verifyOtp, resendOtp } = useAuth();
    const navigate = useNavigate();

    // Clear error when switching steps
    useEffect(() => {
        if (user) navigate('/');
        setError(null);
    }, [authStep]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (authStep === 'login') {
                const { email } = await login(formData.email);
                setFormData(prev => ({ ...prev, email }));
                setAuthStep('verify');
            } else if (authStep === 'register') {
                if (!formData.acceptPrivacy) {
                    throw new Error('Please accept the privacy statement');
                }
                const fullPhone = `${formData.phonePrefix}${formData.phone}`;
                await register(formData.email, formData.password, formData.name, fullPhone);
                setAuthStep('verify');
            } else if (authStep === 'verify') {
                // If we were in register step, use 'signup', otherwise use 'email' for login
                const type = (formData.name) ? 'signup' : 'email';
                await verifyOtp(formData.email, formData.otp, type);

                if (type === 'signup') {
                    toast.success('Welcome to Qissey! Your account has been created.');
                } else {
                    toast.success('Welcome back!');
                }

                navigate('/');
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const type = (formData.name) ? 'signup' : 'email';
            await resendOtp(formData.email, type);
            toast.success('OTP resent to your email');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-[#1A1A1A]">
            {authStep !== 'login' && (
                <header className="fixed top-0 w-full z-50 px-6 md:px-12 h-20 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-8 pointer-events-auto mt-[10px]">
                        <Link to="/" className="block">
                            <img src="/logo.PNG" alt="QISSEY" className="h-20 w-auto brightness-0" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-8 opacity-40 hover:opacity-100 transition-opacity pointer-events-auto">
                        <Link to="/shop" className="text-[10px] uppercase font-bold tracking-widest">
                            Back to Shop
                        </Link>
                        {authStep === 'register' && (
                            <button onClick={() => setAuthStep('login')} className="text-[14px] uppercase tracking-widest border-b border-black/10">
                                Log In
                            </button>
                        )}
                        {authStep === 'verify' && (
                            <button onClick={() => setAuthStep('register')} className="text-[10px] uppercase font-bold tracking-widest border-b border-black/10">
                                Back to Register
                            </button>
                        )}
                    </div>
                </header>
            )}

            <AnimatePresence mode="wait">
                {authStep === 'login' ? (
                    /* LOGIN VIEW: Two Column */
                    <motion.div
                        key="login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-grow flex flex-col lg:flex-row items-stretch overflow-hidden"
                    >
                        <div className="w-full lg:w-1/2 p-10 md:px-20 md:pb-20 md:pt-10 flex flex-col justify-center">
                            <div className="max-w-sm w-full mx-auto lg:ml-0">
                                {/* Logo for Login Page */}
                                <div className="mb-10 ">
                                    <Link to="/" className="block">
                                        <img src="/logo.PNG" alt="QISSEY" className="h-20 w-auto brightness-0" />
                                    </Link>
                                </div>
                                <h2 className="text-[16px] uppercase font-bold tracking-[0.1em] mb-10">Log In</h2>
                                <form onSubmit={handleSubmit} className="space-y-12">
                                    <FloatingInput
                                        label="Email or Mobile Number"
                                        type="text"
                                        className={"mb-8"}
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    {error && (
                                        <div className="text-red-500 text-[10px] uppercase font-bold tracking-tight bg-red-50 p-3">
                                            {error}
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-3 pt-5">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#1A1A1A] text-white py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex justify-center items-center"
                                        >
                                            {isLoading ? <LoadingDots /> : 'Log In'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAuthStep('register')}
                                            className="w-full border border-[#1A1A1A] py-2.75 text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all"
                                        >
                                            Register
                                        </button>
                                    </div>
                                </form>


                            </div>
                        </div>
                        <div className="hidden lg:block w-1/2 bg-[#F5F5F5] overflow-hidden">
                            <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.5 }}
                                src="/qissey-auth.png"
                                className="w-full h-full object-cover grayscale contrast-125"
                                alt="QISSEY Editorial"
                            />
                        </div>
                    </motion.div>
                ) : authStep === 'register' ? (
                    /* REGISTER VIEW: Single Column Center */
                    <motion.div
                        key="register"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex-grow flex flex-col items-center justify-start pt-40 px-6 overflow-y-auto pb-20"
                    >
                        <div className="max-w-md w-full space-y-16">
                            <div>
                                <h2 className="text-[14px] uppercase font-black tracking-[0.2em] mb-12">Personal Details</h2>
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <FloatingInput
                                        label="E-mail"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <FloatingInput
                                        label="Password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <FloatingInput
                                        label="Name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <div className="flex gap-4">
                                        <FloatingInput
                                            label="Prefix"
                                            className="w-20"
                                            value={formData.phonePrefix}
                                            readOnly
                                        />
                                        <FloatingInput
                                            label="Mobile Number"
                                            className="flex-grow"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-4 space-y-6">
                                        <p className="text-[9px] text-[#1A1A1A]/40 uppercase font-bold tracking-tight">
                                            We will send you an SMS to verify your phone number
                                        </p>

                                        <div className="space-y-4">
                                            <CustomCheckbox
                                                label="I wish to receive Qissey news on my e-mail"
                                                checked={formData.acceptNews}
                                                onChange={() => setFormData({ ...formData, acceptNews: !formData.acceptNews })}
                                            />
                                            <CustomCheckbox
                                                label={<span>I accept the <span className="underline">privacy statement</span></span>}
                                                checked={formData.acceptPrivacy}
                                                onChange={() => setFormData({ ...formData, acceptPrivacy: !formData.acceptPrivacy })}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-[10px] uppercase font-bold tracking-tight bg-red-50 p-3 max-w-sm">
                                            {error}
                                        </div>
                                    )}
                                    <div className="pt-10">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-52 border border-[#1A1A1A] py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all disabled:opacity-50 flex justify-center items-center"
                                        >
                                            {isLoading ? <LoadingDots /> : 'Create Account'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* OTP VERIFICATION VIEW */
                    <motion.div
                        key="verify"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex-grow flex flex-col items-center justify-center px-6"
                    >
                        <div className="max-w-md w-full space-y-12 text-center">
                            <div>
                                <h2 className="text-[16px] uppercase font-bold tracking-[0.2em] mb-4">Verify Your Account</h2>
                                <p className="text-[11px] text-[#1A1A1A]/60 uppercase font-medium tracking-wide">
                                    We've sent a 6-digit verification code to <span className="text-[#1A1A1A] font-bold">{formData.email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <FloatingInput
                                    label="6-Digit Code"
                                    required
                                    value={formData.otp}
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                />

                                {error && (
                                    <div className="text-red-500 text-[10px] uppercase font-bold tracking-tight bg-red-50 p-3">
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col items-center gap-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-52 bg-[#1A1A1A] text-white py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex justify-center items-center"
                                    >
                                        {isLoading ? <LoadingDots /> : 'Verify & Log In'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={isLoading}
                                        className="text-[10px] uppercase font-bold tracking-widest border-b border-black/10 hover:border-black transition-colors disabled:opacity-50"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div>
    );
}
