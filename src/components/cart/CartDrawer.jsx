import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button, cn } from '../ui/Primitives';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
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
                        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
                    >
                        <div className="p-8 border-b border-black/5 flex items-center justify-between">
                            <h2 className="text-2xl uppercase font-display font-bold tracking-tight">Your bag</h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-brand-gray rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-8">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <ShoppingCart size={48} className="text-brand-gray mb-4" />
                                    <p className="text-brand-charcoal/40 uppercase text-xs font-bold tracking-widest mb-8">
                                        Your bag is currently empty
                                    </p>
                                    <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                                        Start Shopping
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {cart.map((item) => (
                                        <div key={`${item.id}-${item.size}`} className="flex gap-6 group">
                                            <div className="w-24 h-32 bg-brand-gray overflow-hidden">
                                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-sm font-bold uppercase tracking-tight">{item.title}</h3>
                                                        <button onClick={() => removeFromCart(item.id, item.size)} className="text-black/30 hover:text-black">
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-black/50 uppercase font-medium mb-4">Size: {item.size}</p>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center border border-black/10 rounded-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.size, -1)}
                                                            className="p-1 hover:bg-brand-gray px-2"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="text-xs font-bold px-3">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.size, 1)}
                                                            className="p-1 hover:bg-brand-gray px-2"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm font-bold tracking-tight">${item.price * item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-8 border-t border-black/5 bg-brand-gray/30">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-xs uppercase font-bold text-black/40 tracking-widest">Subtotal</span>
                                    <span className="text-2xl font-display font-bold">${cartTotal}</span>
                                </div>
                                <Button className="w-full py-5 text-base">Checkout</Button>
                                <p className="text-[10px] text-center text-black/40 mt-4 uppercase tracking-widest font-bold">
                                    Shipping & taxes calculated at checkout
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
