import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag as BagIcon,
    ArrowRight,
    Truck,
    ShieldCheck
} from 'lucide-react';
import { useCart } from '../features/cart';
import { useAuth } from '../features/auth';
import { Button } from '../components/ui/Primitives';
import PageLoader from '../components/ui/PageLoader';
import { SHOPPING_BAG_MESSAGES } from '../constants/content';

export default function ShoppingBag() {
    const { cart, updateQuantity, removeFromCart, cartTotal, isLoading } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) return <PageLoader />;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6">
                <div className="container max-w-[1080px] mx-auto h-[60vh] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-8">
                        <BagIcon className="w-8 h-8 text-neutral-300" strokeWidth={1} />
                    </div>
                    <h1 className="text-2xl font-display uppercase tracking-wider mb-4 opacity-80">
                        {SHOPPING_BAG_MESSAGES.EMPTY_TITLE}
                    </h1>
                    <p className="text-[12px] uppercase tracking-widest opacity-40 mb-10 max-w-[300px] leading-relaxed">
                        Sign in to sync your bag across devices or explore our latest collection.
                    </p>
                    <Link to="/shop">
                        <Button className="px-12 py-6 bg-black text-white rounded-none uppercase text-[11px] tracking-[0.2em] hover:bg-neutral-900 transition-all">
                            {SHOPPING_BAG_MESSAGES.EXPLORE_ACTION}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 md:pt-40 pb-20 px-6">
            <div className="container max-w-[1080px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Items Section */}
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-12 pb-6 border-b border-black/5">
                            <h1 className="text-2xl md:text-3xl font-display uppercase tracking-widest opacity-80">Shopping Bag ({cart.length})</h1>
                        </div>

                        <div className="space-y-12">
                            {cart.map((item) => (
                                <div key={`${item.product_id}-${item.size}-${item.variant_id}`} className="flex gap-8 group">
                                    {/* Item Image */}
                                    <div className="w-32 md:w-48 aspect-[3/4] bg-neutral-50 overflow-hidden shrink-0 relative group">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <button
                                            onClick={() => removeFromCart(item.product_id, item.size, item.variant_id)}
                                            className="absolute top-2 right-2 p-2 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                        >
                                            <Trash2 size={14} strokeWidth={1.5} />
                                        </button>
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-grow flex flex-col pt-2">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-[14px] font-bold uppercase tracking-widest mb-1 group-hover:opacity-60 transition-opacity">{item.name}</h3>
                                                <p className="text-[11px] uppercase tracking-widest opacity-40">Ref: {item.product_id.slice(0, 8)}</p>
                                            </div>
                                            <p className="text-[14px] font-bold">₹ {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>

                                        <div className="space-y-4 mt-auto">
                                            <div className="flex flex-wrap gap-x-8 gap-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Size:</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.size}</span>
                                                </div>
                                                {item.custom_measurements && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Custom:</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Selected</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Price:</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">₹ {item.price.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-black/5">
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.size, item.variant_id, item.quantity - 1)}
                                                        className="p-2 hover:bg-neutral-50 transition-colors"
                                                    >
                                                        <Minus size={12} strokeWidth={1.5} />
                                                    </button>
                                                    <span className="w-10 text-center text-[10px] font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.size, item.variant_id, item.quantity + 1)}
                                                        className="p-2 hover:bg-neutral-50 transition-colors"
                                                    >
                                                        <Plus size={12} strokeWidth={1.5} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product_id, item.size, item.variant_id)}
                                                    className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30 hover:opacity-100 transition-opacity md:hidden"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:w-[380px] shrink-0">
                        <div className="bg-neutral-50 p-8 pt-10 sticky top-40">
                            <h2 className="text-[14px] font-bold uppercase tracking-[0.2em] mb-10 pb-4 border-b border-black/5">Order Summary</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="opacity-40 font-medium">Subtotal</span>
                                    <span className="font-bold">₹ {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase tracking-widest">
                                    <span className="opacity-40 font-medium">Shipping</span>
                                    <span className="text-green-600 font-bold">Free</span>
                                </div>
                                <div className="pt-6 border-t border-black/10 flex justify-between">
                                    <span className="text-[14px] font-bold uppercase tracking-[0.2em]">Total</span>
                                    <span className="text-[18px] font-bold">₹ {cartTotal.toLocaleString()}</span>
                                </div>
                                <p className="text-[9px] uppercase tracking-widest opacity-40 leading-relaxed pt-2">
                                    Inclusive of all taxes and duties.
                                </p>
                            </div>

                            <Button className="w-full h-14 bg-black text-white rounded-none uppercase text-[11px] tracking-[0.2em] font-bold hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 group">
                                Checkout
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <div className="mt-10 space-y-6">
                                <div className="flex gap-4">
                                    <Truck className="shrink-0 opacity-20" size={18} strokeWidth={1.5} />
                                    <p className="text-[9px] uppercase tracking-widest opacity-40 leading-relaxed font-medium">
                                        {SHOPPING_BAG_MESSAGES.EXPRESS_SHIPPING}
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <ShieldCheck className="shrink-0 opacity-20" size={18} strokeWidth={1.5} />
                                    <p className="text-[9px] uppercase tracking-widest opacity-40 leading-relaxed font-medium">
                                        {SHOPPING_BAG_MESSAGES.SECURE_PAYMENT}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
