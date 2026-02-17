import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag as BagIcon, Plus, Minus, X, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../features/auth';
import { useCart } from '../features/cart';
import { Button } from '../components/ui/Primitives';
import { cn } from '../components/ui/Primitives';
import ShoppingBagSkeleton from '../features/cart/components/ShoppingBagSkeleton';
import { useEffect } from 'react';

export default function ShoppingBag() {
    const { cart, updateQuantity, removeFromCart, cartTotal, isLoading } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/auth');
        }
    }, [user, isLoading, navigate]);

    if (isLoading || !user) {
        return <ShoppingBagSkeleton />;
    }

    return (
        <div className="min-h-screen pt-24 md:pt-48 pb-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    {/* Left Column: Items */}
                    <div className="w-full md:w-3/5">
                        <div className="flex items-end gap-3 mb-12">
                            <p className="text-2xl md:text-4xl font-medium uppercase tracking-tight">Shopping Bag</p>
                        </div>

                        {cart.length === 0 ? (
                            <div className="py-24 border-t border-black/5 flex flex-col items-center justify-center text-center">
                                <BagIcon size={48} strokeWidth={1} className="text-black/10 mb-6" />
                                <p className="text-sm font-bold uppercase tracking-widest text-black/40 mb-8">Your bag is currently empty</p>
                                <Button asChild variant="outline">
                                    <Link to="/">Explore Collection</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {cart.map((item) => (
                                    <div key={item.cartItemId} className="flex flex-col sm:flex-row gap-8 pb-12 border-b border-black/5 group relative">
                                        {/* Product Image */}
                                        <div className="w-full sm:w-48 aspect-[3/4] bg-brand-gray overflow-hidden">
                                            <Link to={`/product/${item.id}`}>
                                                <img
                                                    src={item.variant?.image_urls?.[0] || item.product_variants?.[0]?.image_urls?.[0] || item.images?.[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </Link>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <Link to={`/product/${item.id}`} className="text-lg md:text-xl font-bold uppercase tracking-tight hover:opacity-60 transition-opacity">
                                                            {item.name}
                                                        </Link>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.cartItemId)}
                                                        className="p-2 -mr-2 text-black/20 hover:text-black transition-colors"
                                                    >
                                                        <X size={18} strokeWidth={1} />
                                                    </button>
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="text-[11px] uppercase tracking-widest">Size: <span className="font-bold">{item.size}</span></p>
                                                    <p className="text-[11px] uppercase tracking-widest">Color: <span className="font-bold">{item.variant?.color?.name || 'Standard'}</span></p>
                                                </div>

                                                {((item.size === 'CUSTOM' && item.custom_measurements) || item.notes) && (
                                                    <div className="mt-6 p-4 bg-brand-gray/20 space-y-3">
                                                        {item.size === 'CUSTOM' && item.custom_measurements && (
                                                            <>
                                                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Custom Measurements (IN)</p>
                                                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                                                    {Object.entries(item.custom_measurements).map(([key, value]) => (
                                                                        key !== 'notes' && value && (
                                                                            <div key={key}>
                                                                                <p className="text-[9px] uppercase tracking-tighter text-black/30 font-bold">{key}</p>
                                                                                <p className="text-[11px] font-bold">{value}"</p>
                                                                            </div>
                                                                        )
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                        {(item.notes || item.custom_measurements?.notes) && (
                                                            <div className={cn("pt-2 border-black/5", item.size === 'CUSTOM' ? "border-t" : "")}>
                                                                <p className="text-[9px] uppercase tracking-tighter text-black/30 font-bold mb-1">Additional Notes</p>
                                                                <p className="text-[11px] italic text-black/60">{item.notes || item.custom_measurements.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-8 sm:mt-0 pt-8 sm:pt-0">
                                                <div className="flex items-center border border-black/10 self-start">
                                                    <button
                                                        onClick={() => updateQuantity(item.cartItemId, -1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-brand-gray transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-12 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.cartItemId, 1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-brand-gray transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Summary */}
                    <div className="w-full md:w-1/3 sticky top-32">
                        <div className="bg-brand-gray/30 p-8 md:p-12">
                            <p className="text-xl font-bold uppercase tracking-tight mb-8">Order Summary</p>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-60">
                                    <span>Subtotal</span>
                                    <span>₹ {cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-60">
                                    <span>Shipping</span>
                                    <span className="text-[10px]">Calculated at next step</span>
                                </div>
                                <div className="pt-6 border-t border-black/5 flex justify-between items-end">
                                    <span className="text-sm font-bold uppercase tracking-tight">Total</span>
                                    <span className="text-2xl font-bold">₹ {cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <Button className="w-full py-6 text-sm flex items-center justify-between group">
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </Button>

                            <div className="mt-12 space-y-6">
                                <div className="flex gap-4 items-start">
                                    <Truck size={18} strokeWidth={1} className="shrink-0" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest leading-loose opacity-40">
                                        Free Express Shipping on orders over ₹ 5,000. Delivered in 3-5 business days.
                                    </p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <ShieldCheck size={18} strokeWidth={1} className="shrink-0" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest leading-loose opacity-40">
                                        Secure payment processing via major credit cards and UPI.
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
