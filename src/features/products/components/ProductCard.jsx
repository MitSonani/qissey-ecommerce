import { Link } from 'react-router-dom';
import { ShoppingCart, Bookmark } from 'lucide-react';
import { useCart } from '../../../features/cart';
import { Badge, cn } from '../../../components/ui/Primitives';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth';
import { saveProduct, unsaveProduct } from '../../../features/products/services/productService';
import { toast } from 'sonner';

export default function ProductCard({ product, isCompleteTheLook = false }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isSaved, setIsSaved] = useState(product.is_saved || false);
    const { user } = useAuth();

    useEffect(() => {
        setIsSaved(product.is_saved || false);
    }, [product.is_saved]);

    const handleToggleSave = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to save products');
            return;
        }

        const previousState = isSaved;
        setIsSaved(!previousState);

        try {
            if (previousState) {
                const success = await unsaveProduct(user.id, product.id);
                if (!success) setIsSaved(previousState);
            } else {
                const success = await saveProduct(user.id, product.id);
                if (!success) setIsSaved(previousState);
            }
        } catch (error) {
            console.error('Error toggling save status:', error);
            setIsSaved(previousState);
        }
    };

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
                        className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black max-w-[85%] leading-relaxed"
                    >
                        {product.name}
                    </Link>
                    <button
                        onClick={handleToggleSave}
                        className={cn(
                            "transition-all duration-300 cursor-pointer",
                            isSaved ? "text-black" : "text-brand-charcoal hover:opacity-50"
                        )}
                        aria-label={isSaved ? "Remove from saved" : "Save product"}
                    >
                        <Bookmark
                            size={16}
                            strokeWidth={1}
                            fill={isSaved ? "currentColor" : "none"}
                        />
                    </button>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black">
                    ₹ {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
            </div>}
        </div>
    );
}
