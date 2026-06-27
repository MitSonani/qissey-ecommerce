import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ShoppingBag as BagIcon, Plus, Minus, X, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../features/auth';
import { useCart } from '../features/cart';
import { Button, cn } from '../components/ui/Primitives';
import ShoppingBagSkeleton from '../features/cart/components/ShoppingBagSkeleton';
import YouMayAlsoLike from '../features/products/components/YouMayAlsoLike';
import { useEffect, useState } from 'react';
import { paymentService } from '../services/paymentService';
import { toast } from 'sonner';
const logo = '/logo.PNG';
// import AddressModal from '../components/ui/AddressModal';
import { supabase } from '../lib/supabase';

export default function ShoppingBag() {
    const { cart, updateQuantity, removeFromCart, cartTotal, isLoading, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);



    useEffect(() => {
        // Load HeadlessCheckout script
        const scriptId = 'shiprocket-headless-checkout-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js';
            script.async = true;
            document.body.appendChild(script);
        }

        // Load CSS stylesheet
        const styleId = 'shiprocket-headless-checkout-style';
        if (!document.getElementById(styleId)) {
            const link = document.createElement('link');
            link.id = styleId;
            link.rel = 'stylesheet';
            link.href = 'https://checkout-ui.shiprocket.com/assets/styles/shopify.css';
            document.head.appendChild(link);
        }
    }, []);

    const handleCheckoutClick = async (e) => {
        setIsProcessing(true);
        try {
            const res = await paymentService.createShiprocketCheckoutToken(cart, user?.id);
            if (res.success && res.token) {
                if (window.HeadlessCheckout) {
                    window.HeadlessCheckout.addToCart(e, res.token, {
                        fallbackUrl: res.checkout_url,
                        isInitiatedFromApp: true
                    });
                } else {
                    // Fallback to direct redirect if script is not fully loaded yet
                    window.location.href = res.checkout_url;
                }
            } else {
                toast.error(res.error || 'Failed to initiate checkout session');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Something went wrong during checkout');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return <ShoppingBagSkeleton />;
    }

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-32 px-6 md:px-12 bg-white relative">
            <div className="max-w-[1600px] mx-auto relative">

                {/* Header for Mobile */}
                <div className="flex flex-row items-center justify-between mb-8 md:hidden">
                    <div className="flex gap-1 text-[11px] font-bold uppercase tracking-widest text-black">
                        <span>SHOPPING BAG</span>
                        <span>{cart.length}</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-black/40">
                        <Link to="/saved-products">FAVOURITES</Link>
                    </span>
                </div>

                {/* Main Content Area - Centered Grid (Reverted) */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Left/Main Column: Cart Items Grid */}
                    <div className="flex-grow">
                        {cart.length === 0 ? (
                            <div className="py-6 border-t border-black/5 flex flex-col items-center justify-center text-center">
                                <BagIcon size={48} strokeWidth={1} className="text-black/10 mb-6" />
                                <p className="text-sm font-bold uppercase tracking-widest text-black/40 mb-8">Your bag is currently empty</p>
                                <Button asChild variant="outline" className="rounded-none border-black hover:bg-black hover:text-white transition-colors duration-300">
                                    <Link to="/">Explore Collection</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 md:gap-x-10 md:gap-y-35 lg:mx-[320px]">
                                {[...cart].map((item) => (
                                    <div key={item.cartItemId} className="flex flex-row md:flex-col gap-4 md:gap-0 group relative border-b border-black/5 pb-8 md:border-none md:pb-0">
                                        {/* Product Image */}
                                        <div className="w-[100px] md:w-full aspect-[3/4] bg-[#f5f5f5] max-w-[100px] md:max-w-[150px] md:max-h-[200px] mb-0 md:mb-4 overflow-hidden relative flex-shrink-0">
                                            <Link to={`/product/${item.slug || item.id}`}>
                                                <img
                                                    src={item.variant?.image_urls?.[0] || item.product_variants?.[0]?.image_urls?.[0] || item.images?.[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </Link>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-col items-start gap-1 flex-grow">
                                            <div className="flex flex-col w-full">
                                                <Link to={`/product/${item.slug || item.id}`} className="text-[11px] font-bold uppercase tracking-widest text-black hover:underline decoration-1 underline-offset-4 leading-normal">
                                                    {item.name}
                                                </Link>
                                                <p className="text-[10px] uppercase tracking-widest text-black/60 mt-0.5">
                                                    ₹ {(item.price * item.quantity).toLocaleString('en-IN')}.00
                                                </p>
                                            </div>

                                            <div className="text-[10px] uppercase tracking-widest text-black/60 mt-2 flex flex-col gap-0.5">
                                                <p>{item.size === 'CUSTOM' ? 'Custom Size' : item.size} {item.variant?.color?.name && `| ${item.variant.color.name}`}</p>
                                            </div>


                                            <div className="flex items-center gap-6 mt-4 md:mt-2">
                                                <button
                                                    onClick={() => removeFromCart(item.cartItemId)}
                                                    className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                                                >
                                                    Delete
                                                </button>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.cartItemId, -1)}
                                                        disabled={item.quantity <= 1}
                                                        className="text-black/40 hover:text-black transition-colors disabled:opacity-20"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                    <span className="text-[10px] uppercase tracking-widest font-medium text-black">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.cartItemId, 1)}
                                                        className="text-black/40 hover:text-black transition-colors"
                                                    >
                                                        <Plus size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <YouMayAlsoLike cartItems={cart} />

                {/* Footer Action Bar */}
                {cart.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 py-4 px-6 md:px-12 z-40">
                        <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <p className="text-sm font-bold uppercase tracking-widest">
                                    ₹ {cartTotal.toLocaleString('en-IN')}.00
                                </p>
                                <p className="text-[9px] uppercase tracking-widest text-black/40">
                                    Including GST <br className="hidden md:block" />
                                    * excl Shipping cost
                                </p>
                            </div>

                            <Button
                                onClick={(e) => handleCheckoutClick(e)}
                                disabled={isProcessing}
                                className="h-12 px-8 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-none hover:bg-black/90 transition-opacity disabled:opacity-50"
                            >
                                Checkout
                            </Button>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
}
