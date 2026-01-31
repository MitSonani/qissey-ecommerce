import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Badge, cn } from '../ui/Primitives';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-gray">
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out",
                            isHovered ? "scale-105 opacity-0" : "scale-100 opacity-100"
                        )}
                    />
                    <img
                        src={product.images[1] || product.images[0]}
                        alt={product.title}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out",
                            isHovered ? "scale-100 opacity-100" : "scale-105 opacity-0"
                        )}
                    />

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.tags?.map(tag => (
                            <Badge key={tag} className="bg-white text-black">{tag}</Badge>
                        ))}
                    </div>

                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-6 left-6 right-6"
                            >
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addToCart(product, product.sizes[0]);
                                    }}
                                    className="w-full bg-white text-brand-charcoal py-4 text-[10px] uppercase font-bold tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-brand-charcoal hover:text-white transition-colors"
                                >
                                    <Plus size={14} /> Quick Add
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Link>

            <div className="mt-6 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <Link to={`/product/${product.id}`} className="text-xs uppercase font-bold tracking-widest hover:underline underline-offset-4">
                        {product.title}
                    </Link>
                    <p className="text-[10px] text-black/40 uppercase font-medium tracking-wider">{product.category}</p>
                </div>
                <p className="text-sm font-bold tracking-tight">${product.price}</p>
            </div>
        </div>
    );
}
