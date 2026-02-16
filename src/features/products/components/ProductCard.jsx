import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../../../features/cart';
import { Badge, cn } from '../../../components/ui/Primitives';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductCard({ product, isCompleteTheLook = false }) {
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative flex flex-col"
            onMouseEnter={() => !isCompleteTheLook && setIsHovered(true)}
            onMouseLeave={() => !isCompleteTheLook && setIsHovered(false)}
        >
            <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-gray group">
                    <img
                        src={product?.product_variants[0]?.image_urls[0]}
                        alt={product.title}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out",
                            isHovered ? "scale-105 opacity-0" : "scale-100 opacity-100"
                        )}
                    />
                    <img
                        src={product?.product_variants[0]?.image_urls[1] || product?.product_variants[0]?.image_urls[0]}
                        alt={product.title}
                        className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out",
                            isHovered ? "scale-100 opacity-100" : "scale-105 opacity-0"
                        )}
                    />
                </div>
            </Link>

            {!isCompleteTheLook && <div className="mt-4 flex flex-col gap-1.5 px-0.5">
                <div className="flex justify-between items-start">
                    <Link
                        to={`/product/${product.id}`}
                        className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block text-black max-w-[85%] leading-relaxed"
                    >
                        {product.name}
                    </Link>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product, product.sizes[0]);
                        }}
                        className="text-brand-charcoal hover:opacity-50 transition-opacity"
                        aria-label="Add to cart"
                    >
                        <Plus size={16} strokeWidth={1} />
                    </button>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block text-black">
                    ₹ {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
            </div>}
        </div>
    );
}
