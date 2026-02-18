import { Link } from 'react-router-dom';
import { ShoppingCart, Bookmark, Plus } from 'lucide-react';
import { useCart } from '../../../features/cart';
import { Badge, cn } from '../../../components/ui/Primitives';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth';
import { saveProduct, unsaveProduct } from '../../../features/products/services/productService';
import { toast } from 'sonner';
import CustomSizeModal from './CustomSizeModal';

export default function ProductCard({ product, isCompleteTheLook = false, isCartProduct = false, onToggleSave }) {
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [showSizes, setShowSizes] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isSaved, setIsSaved] = useState(product.is_saved || false);
    const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);

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
                if (!success) {
                    setIsSaved(previousState);
                } else if (onToggleSave) {
                    onToggleSave(false);
                }
            } else {
                const success = await saveProduct(user.id, product.id);
                if (!success) {
                    setIsSaved(previousState);
                } else if (onToggleSave) {
                    onToggleSave(true);
                }
            }
        } catch (error) {
            console.error('Error toggling save status:', error);
            setIsSaved(previousState);
        }
    };

    const displayedColorId = product?.product_variants?.[0]?.color_id?.id;

    const availableSizes = product?.product_variants?.filter(
        v => v.color_id?.id === displayedColorId && v.size
    ) || [];

    const uniqueSizes = [...new Map(availableSizes.map(item => [item.size, item])).values()];

    const handleAddToCart = async (e, variant) => {
        e.preventDefault();
        e.stopPropagation();

        if (!variant) return;

        try {
            await addToCart(product, variant.size, variant.id);
            toast.success(`Added to cart`);
            setShowSizes(false);
        } catch (error) {
            console.error("Failed to add to cart", error);
            toast.error("Failed to add to cart");
        }
    };


    const handleSaveCustomSize = async (data) => {
        try {
            const variantId = product?.product_variants?.[0]?.id;

            if (!variantId) {
                toast.error("Cannot add custom size: Product variant not found");
                return;
            }

            await addToCart(product, 'CUSTOM', variantId, false, data);
            toast.success('Added custom size to cart');
        } catch (error) {
            console.error("Failed to add custom size", error);
            toast.error("Failed to add custom size to cart");
        }
    };

    return (
        <>
            <CustomSizeModal
                isOpen={showCustomSizeModal}
                onClose={() => setShowCustomSizeModal(false)}
                onSave={handleSaveCustomSize}
            />
            <div
                className="group relative flex flex-col"
                onMouseEnter={() => !isCompleteTheLook && setIsHovered(true)}
                onMouseLeave={() => {
                    if (!isCompleteTheLook) setIsHovered(false);
                    setShowSizes(false);
                }}
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
                        {showSizes && (
                            <div
                                className="absolute bottom-0 right-0 bg-white backdrop-blur-sm border-t border-l border-black/5 shadow-sm z-30 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowCustomSizeModal(true);
                                        setShowSizes(false);
                                    }}
                                    className=" min-w-[182px] flex justify-center items-center py-3 text-[9px] font-bold hover:bg-black hover:text-white uppercase tracking-widest  transition-colors border-t border-black/10 bg-gray-50/50"
                                >
                                    Custom Size
                                </button>
                                {uniqueSizes.length > 0 ? (
                                    uniqueSizes.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={(e) => handleAddToCart(e, variant)}
                                            className=" py-3 text-[9px] font-bold hover:bg-black hover:text-white uppercase tracking-widest  transition-colors border-t border-black/10 bg-gray-50/50"
                                        >
                                            {variant.size}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-[10px] text-gray-500 whitespace-nowrap">No sizes</div>
                                )}

                            </div>
                        )}
                    </div>
                </Link>

                {!isCompleteTheLook && <div className="mt-4 flex flex-col gap-1.5 px-0.5">
                    <div className="flex justify-between items-start relative">
                        <Link
                            to={`/product/${product.id}`}
                            className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black max-w-[85%] leading-relaxed"
                        >
                            {product.name}
                        </Link>

                        {isCartProduct ? (
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowSizes(!showSizes);
                                    }}
                                    className="text-brand-charcoal hover:text-black transition-colors duration-300 cursor-pointer"
                                    aria-label="Add to cart"
                                >
                                    <Plus size={16} strokeWidth={1} />
                                </button>
                            </div>
                        ) : (
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
                        )}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black">
                        ₹ {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div>}
            </div >
        </>
    );
}
