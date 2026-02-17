import { ShoppingBag, ArrowRight, X, Check } from 'lucide-react';
import { useCart } from '../store/CartContext';
import { Button } from '../../../components/ui/Primitives';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cart, cartTotal } = useCart();
    const lastItem = cart[cart.length - 1];

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[150] flex justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsCartOpen(false)}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col"
                    >
                        <div className="p-8 border-b border-black/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                    <Check size={12} className="text-white" />
                                </div>
                                <h2 className="text-xs uppercase font-bold tracking-[0.2em]">Added to Bag</h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-brand-gray rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8">
                            {lastItem ? (
                                <div className="flex gap-6">
                                    <div className="w-24 h-32 bg-brand-gray overflow-hidden">
                                        <img
                                            src={lastItem.variant?.image_urls?.[0] || lastItem.product_variants?.[0]?.image_urls?.[0] || lastItem.images?.[0]}
                                            alt={lastItem.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-sm font-bold uppercase tracking-tight mb-1">{lastItem.name}</h3>
                                        <p className="text-[10px] text-black/50 uppercase font-medium mb-4">
                                            Size: {lastItem.size} | Color: {lastItem.variant?.color?.name || 'Standard'}
                                        </p>
                                        <p className="text-sm font-bold">₹ {lastItem.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <ShoppingBag size={48} className="text-brand-gray mb-4" />
                                    <p className="text-brand-charcoal/40 uppercase text-xs font-bold tracking-widest">
                                        Your bag is empty
                                    </p>
                                </div>
                            )}

                            {cart.length > 1 && (
                                <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-black/40 text-center">
                                    + {cart.length - 1} other {cart.length - 1 === 1 ? 'item' : 'items'} in bag
                                </p>
                            )}
                        </div>

                        <div className="p-8 border-t border-black/5 bg-brand-gray/30 space-y-4">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-xs uppercase font-bold text-black/40 tracking-widest">Subtotal</span>
                                <span className="text-xl font-bold">₹ {cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <Button asChild className="w-full py-5 text-xs tracking-widest flex justify-between group" onClick={() => setIsCartOpen(false)}>
                                <Link to="/shopping-bag">
                                    VIEW SHOPPING BAG
                                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full py-5 text-xs tracking-widest" onClick={() => setIsCartOpen(false)}>
                                CONTINUE SHOPPING
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
