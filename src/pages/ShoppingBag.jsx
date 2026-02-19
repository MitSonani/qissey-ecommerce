import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag as BagIcon, Plus, Minus, X, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../features/auth';
import { useCart } from '../features/cart';
import { Button } from '../components/ui/Primitives';
import ShoppingBagSkeleton from '../features/cart/components/ShoppingBagSkeleton';
import YouMayAlsoLike from '../features/products/components/YouMayAlsoLike';
import { useEffect, useState } from 'react';
import { paymentService } from '../services/paymentService';
import { toast } from 'sonner';
import logo from '../../public/logo.PNG';

export default function ShoppingBag() {
    const { cart, updateQuantity, removeFromCart, cartTotal, isLoading, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            const res = await loadRazorpayScript();

            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                setIsProcessing(false);
                return;
            }

            // Create order on backend
            const orderData = await paymentService.createPaymentOrder(cartTotal * 100, 'INR');

            if (!orderData) {
                toast.error('Server error. Are you online?');
                setIsProcessing(false);
                return;
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Qissey",
                description: `Payment for ${cart.length} item${cart.length !== 1 ? 's' : ''}`,
                image: logo,
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.success) {
                            toast.success('Payment Successful!');
                            clearCart();
                            navigate('/account/orders'); // Redirect to orders page
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error) {
                        console.error("Verification Error", error);
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: user?.user_metadata?.name || user?.email,
                    email: user?.email,
                    contact: user?.user_metadata?.phone || "",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#000000",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Checkout Error", error);
            toast.error('Something went wrong during checkout');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading || !user) {
        return <ShoppingBagSkeleton />;
    }

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-32 px-6 md:px-12 bg-white">
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

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Left/Main Column: Cart Items Grid */}
                    <div className="flex-grow">
                        {cart.length === 0 ? (
                            <div className="py-24 border-t border-black/5 flex flex-col items-center justify-center text-center">
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
                                            <Link to={`/product/${item.id}`}>
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
                                                <Link to={`/product/${item.id}`} className="text-[11px] font-bold uppercase tracking-widest text-black hover:underline decoration-1 underline-offset-4 leading-normal">
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
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 py-4 px-6 md:px-12 z-50">

                        {/* Total & Checkout */}
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
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="h-12 px-8 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-none hover:bg-black/90 transition-opacity disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Checkout'}
                            </Button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
