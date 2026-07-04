import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchProductBySlug, saveProduct, unsaveProduct, fetchProductReviews, submitProductReview } from '../services/productService';
import { useAuth } from '../../../features/auth';
import { useCart } from '../../../features/cart';
import { toast } from 'sonner';
import { Button, cn } from '../../../components/ui/Primitives';
import { ChevronDown, ArrowRight, Bookmark, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SideDrawer from '../../../components/ui/SideDrawer';
import RealatedProduct from '../components/RealatedProduct';
import CompleteYourLook from '../components/CompleteYourLook';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import CustomSizeModal from '../components/CustomSizeModal';
import SEO from '../../../components/ui/SEO';


const measurementData = [
    { size: "XS", bust: "32″/81 cm", waist: "24″/61 cm", hips: "34″/86 cm", shoulder: "13.5″/34 cm" },
    { size: "S", bust: "34″/86 cm", waist: "26″/66 cm", hips: "36″/91 cm", shoulder: "14″/36 cm" },
    { size: "M", bust: "36″/91 cm", waist: "28″/71 cm", hips: "38″/97 cm", shoulder: "14.5″/37 cm" },
    { size: "L", bust: "38″/97 cm", waist: "30″/76 cm", hips: "40″/102 cm", shoulder: "15″/39 cm" },
    { size: "XL", bust: "40″/102 cm", waist: "32″/81 cm", hips: "42″/107 cm", shoulder: "15.5″/40 cm" },

];

export default function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [primaryProduct, setPrimaryProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showSizes, setShowSizes] = useState(false);
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [colors, setColors] = useState([])
    const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
    const [activeTab, setActiveTab] = useState('DESCRIPTION');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const sizeSelectorRef = useRef(null);

    // Review System State
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [showReviewDrawer, setShowReviewDrawer] = useState(false);
    
    // Review Form State
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewerName, setReviewerName] = useState(user?.name || '');
    const [submittingReview, setSubmittingReview] = useState(false);

    // Review Slider Position State
    const [reviewSliderIndex, setReviewSliderIndex] = useState(0);

    // Update reviewerName when user logs in or updates profile
    useEffect(() => {
        if (user?.name) {
            setReviewerName(user.name);
        }
    }, [user]);

    // Load reviews when product changes
    useEffect(() => {
        if (product?.id) {
            const loadReviews = async () => {
                try {
                    setReviewsLoading(true);
                    const data = await fetchProductReviews(product.id);
                    setReviews(data || []);
                } catch (err) {
                    console.error('Failed to load reviews:', err);
                } finally {
                    setReviewsLoading(false);
                }
            };
            loadReviews();
        }
    }, [product?.id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        try {
            setSubmittingReview(true);
            const newReview = await submitProductReview(product.id, {
                rating,
                comment: comment.trim(),
                user_name: reviewerName || 'Anonymous'
            });
            
            setReviews(prev => [newReview, ...prev]);
            setShowReviewDrawer(false);
            setComment('');
            setRating(5);
        } catch (err) {
            console.error('Failed to submit review:', err);
        } finally {
            setSubmittingReview(false);
        }
    };

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : null;

    const handleWriteReviewClick = () => {
        if (!user) {
            toast.error('Please log in to write a review');
            navigate('/auth', { state: { from: location } });
            return;
        }
        setShowReviewDrawer(true);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sizeSelectorRef.current && !sizeSelectorRef.current.contains(event.target)) {
                setShowSizes(false);
            }
        };

        if (showSizes && window.innerWidth >= 1024) { // Only for desktop
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSizes]);

    useEffect(() => {
        if (showSizes && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else if (!activeDrawer && !showCustomSizeModal) {
            document.body.style.overflow = 'auto';
        }
    }, [showSizes, activeDrawer, showCustomSizeModal]);


    useEffect(() => {
        if (activeDrawer) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [activeDrawer])

    useEffect(() => {
        if (showCustomSizeModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showCustomSizeModal])


    const findPrimaryProduct = (colorId) => {

        const productData = product?.product_variants?.find((variant) => variant.color_id?.id === colorId)
        setPrimaryProduct(productData)
    }
    useEffect(() => {
        const loadProductData = async () => {
            try {
                setLoading(true);
                setError(null);

                const productData = await fetchProductBySlug(slug, user?.id);

                if (!productData) {
                    setError('Product not found');
                    setLoading(false);
                    return;
                }

                const primaryProductImages = productData?.product_variants?.find((variant) => variant.is_primary)

                const data = productData?.product_variants?.map((variant) => {
                    return variant?.color_id
                })

                const uniqueColors = Array.from(
                    new Map(data.map(item => [item.name, item])).values()
                );

                setColors([...uniqueColors])
                setPrimaryProduct(primaryProductImages)
                setProduct(productData);
                setIsSaved(productData.is_saved || false);

                setLoading(false);
            } catch (err) {
                console.error('Error loading product:', err);
                setError('Failed to load product. Please try again.');
                setLoading(false);
            }
        };

        loadProductData();
    }, [slug, user?.id]);


    const handleToggleSave = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to save products');
            navigate('/auth', { state: { from: location } });
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

    const handleAddToCart = async (size, variantId, customMeasurements = null) => {
        if (!size || !variantId) return;

        await addToCart(product, size, variantId, false, customMeasurements);
        navigate('/shopping-bag');
    };

    const currentProductSizes = product?.product_variants?.filter((variant) => variant?.color_id?.hex === primaryProduct?.color_id?.hex)

    if (loading) {
        return <ProductDetailSkeleton />;
    }

    if (error || !product) {
        return (
            <div className="pt-40 container text-center">
                <p className="text-sm uppercase tracking-widest text-neutral-600">{error || 'Product not found'}</p>
            </div>
        );
    }

    const drawerContent = {
        measurement: {
            title: "Product Measurements",
            content: (
                <div className="space-y-6">
                    <p className="text-[11px] font-light uppercase">
                        This guide provides the exact measurements for this product in each size.
                    </p>

                    <table className="w-full text-left text-[11px] uppercase tracking-wider">
                        <thead className="border-b border-neutral-100">
                            <tr>
                                <th className="py-4  font-bold">SIZE</th>
                                <th className="py-4  font-bold">BUST <br />(inch/ cm)</th>
                                <th className="py-4  font-bold">WAIST <br />(inch/ cm)</th>
                                <th className="py-4  font-bold">HIPS <br />(inch/ cm)</th>
                                <th className="py-4  font-bold">SHOULDER <br />(inch/ cm)</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-50 text-neutral-500">
                            {measurementData.map((item) => (
                                <tr key={item.size}>
                                    <td className="py-4 text-black font-bold">{item.size}</td>
                                    <td className="py-4">{item.bust}</td>
                                    <td className="py-4">{item.waist}</td>
                                    <td className="py-4">{item.hips}</td>
                                    <td className="py-4">{item.shoulder}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        },
        composition: {
            title: "Composition & Care",
            content: (
                <div className="space-y-10">
                    <section>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Composition</p>
                        <p className="text-[11px] text-neutral-600 uppercase tracking-widest">
                            Premium Fabric Crafted For Lasting Comfort, Durability, And Everyday Elegant Wear
                        </p>
                    </section>
                    <section>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Care</p>
                        <div className="space-y-4 text-[11px] text-neutral-600 uppercase tracking-widest">
                            <p>• Machine wash at max. 30ºC/86ºF</p>
                            <p>• Do not use bleach</p>
                            <p>• Iron at a maximum of 110ºC/230ºF</p>
                            <p>• use mild detergent</p>
                            <p>• tumble dry low or hang to dry</p>
                        </div>
                    </section>
                </div>
            )
        },
        shipping: {
            title: "Shipping & Returns",
            content: (
                <div className="space-y-8">
                    <section>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Shipping</p>

                        <p className="text-xs tracking-widest text-neutral-600 leading-relaxed uppercase">
                            Standard delivery within 7-10 business days.<br />

                            <br /> Free delivery at any location.

                            <br />    <br /> Cash on delivery is available.
                        </p>
                    </section>
                    <section>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Returns</p>
                        <p className="text-xs tracking-widest text-neutral-600 leading-relaxed uppercase">
                            You can request a return or exchange within 10 days of delivery, as long as the item is unused and in its original condition.
                            <br />
                            <br />
                            <p className='font-bold'>  A few quick notes:</p>

                            <br />

                            • Custom size products are not eligible for return or exchange.
                            <br />
                            <br />
                            • The item should be unused and in its original condition.
                            <br /><br />
                            For more information visit Return & Exchange Policy.                        </p>
                    </section>
                </div>
            )
        }
    };

    // Dynamic Product Schema
    const productSchema = product ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `https://qissey.com/product/${product.slug}#product`,
        'name': product.name,
        'description': product.description?.substring(0, 200) || '',
        'image': primaryProduct?.image_urls || [],
        'sku': product.sku || product.id?.toString(),
        'brand': {
            '@type': 'Brand',
            'name': 'QISSEY'
        },
        'offers': {
            '@type': 'Offer',
            'price': product.price,
            'priceCurrency': 'INR',
            'availability': 'https://schema.org/InStock',
            'url': `https://qissey.com/product/${product.slug}`
        }
    } : null;

    // Dynamic Breadcrumbs
    const productBreadcrumbs = product ? [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: product.name, path: `/product/${product.slug}` }
    ] : [];

    return (
        <div className="pt-20 md:pt-30 bg-white pb-24 md:pb-0">
            <SEO
                title={product.name}
                description={product.description?.substring(0, 160) || `Buy ${product.name} at QISSEY. Premium sustainable clothing, crafted with care.`}
                image={primaryProduct?.image_urls?.[0]}
                type="product"
                price={product.price?.toString()}
                availability="InStock"
                schema={productSchema}
                breadcrumbs={productBreadcrumbs}
            />
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">

                <div className="space-y-12">
                    {/* Section 1: 1st Image + Product Summary & Description */}
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="w-full lg:w-1/2">
                            {primaryProduct?.image_urls?.[0] && (
                                <div className="bg-neutral-100 overflow-hidden">
                                    <img
                                        src={primaryProduct.image_urls[0]}
                                        alt={`${product.name} - view 1`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="w-full lg:w-1/2 flex flex-col ">
                            <div className="max-w-[500px] ">
                                <div className="hidden lg:block">
                                    <div className='flex justify-between items-center'>
                                        <p className="text-[18px] uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black mb-1">
                                            {product?.name}

                                        </p>
                                        <button
                                            onClick={handleToggleSave}
                                            className={cn("transition-all duration-300 cursor-pointer", isSaved ? "text-black" : "text-neutral-400 hover:text-black")}
                                        >
                                            <Bookmark
                                                size={18}
                                                strokeWidth={1}
                                                fill={isSaved ? "currentColor" : "none"}
                                            />
                                        </button>
                                    </div>
                                    <p className="text-[15px] font-bold tracking-wide opacity-60 hover:opacity-100 mb-1">
                                        ₹ {product?.price.toLocaleString()}
                                    </p>
                                    {averageRating && (
                                        <div 
                                            onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                                            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-500 mb-2 cursor-pointer hover:text-black transition-colors"
                                        >
                                            <div className="flex text-yellow-500">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={11}
                                                        fill={i < Math.round(parseFloat(averageRating)) ? "currentColor" : "none"}
                                                        strokeWidth={1.5}
                                                        className={i < Math.round(parseFloat(averageRating)) ? "text-yellow-500" : "text-neutral-300"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-bold text-black">{averageRating}</span>
                                            <span className="opacity-60">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                                        </div>
                                    )}
                                    <p className="text-[10px] font-medium uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black pb-6">
                                        MRP incl. of all taxes
                                    </p>
                                </div>

                                <div className="border-t border-neutral-200 pt-6 hidden lg:block">
                                    <div className="flex justify-between">
                                        <div className="flex gap-2 mb-[20px]">
                                            {colors?.map((item) => (
                                                <div
                                                    key={item?.id}
                                                    className={cn('w-6 h-6 flex justify-center items-center cursor-pointer', { 'border border-black': item?.id === primaryProduct?.color_id?.id })}
                                                    onClick={() => findPrimaryProduct(item?.id)}
                                                >
                                                    <div
                                                        className="w-4 h-4 shadow-sm"
                                                        style={{ backgroundColor: item?.hex }}
                                                    ></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 hidden lg:block">
                                        <div className="relative min-h-[56px]" ref={sizeSelectorRef}>
                                            <AnimatePresence mode="wait">
                                                {showSizes ? (
                                                    <motion.div
                                                        key="size-list"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="w-full border bg-white z-50 overflow-hidden"
                                                    >
                                                        <div className="flex flex-col max-h-[240px] overflow-y-auto">
                                                            <button
                                                                onClick={() => {
                                                                    setShowCustomSizeModal(true);
                                                                    setShowSizes(false);
                                                                }}
                                                                className="group flex justify-between items-center px-4 py-4 hover:bg-neutral-50 border-b border-neutral-50 last:border-0 transition-colors"
                                                            >
                                                                <span className="text-[11px] uppercase tracking-widest text-black font-light group-hover:font-medium">
                                                                    Custom Size
                                                                </span>
                                                            </button>
                                                            {currentProductSizes?.map(size => (
                                                                <button
                                                                    key={size.size}
                                                                    onClick={() => {
                                                                        setSelectedSize(size.size);
                                                                        setShowSizes(false);
                                                                        handleAddToCart(size.size, size.id);
                                                                    }}
                                                                    className="group flex justify-between items-center px-4 py-4 hover:bg-neutral-50 border-b border-neutral-50 last:border-0 transition-colors"
                                                                >
                                                                    <span className="text-[11px] uppercase tracking-widest text-black font-light group-hover:font-medium">
                                                                        {size.size}
                                                                    </span>
                                                                </button>
                                                            ))}

                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="add-button"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => {
                                                                    setShowSizes(true);
                                                                }}
                                                                className={cn(
                                                                    "flex-grow py-3 rounded-none uppercase text-[11px] tracking-[0.2em] transition-all duration-300 flex justify-center items-center gap-2",
                                                                    "bg-white text-black border border-black hover:bg-neutral-50"
                                                                )}
                                                            >
                                                                Add to cart
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    {/* Mobile Tabs */}
                                    <div className="flex gap-6 lg:hidden mb-6 overflow-x-auto no-scrollbar">
                                        {['DESCRIPTION', 'MEASUREMENTS', 'CARE', 'SHIPPING & RETURNS'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={cn(
                                                    "pb-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-all whitespace-nowrap",
                                                    activeTab === tab ? "text-black font-medium" : "text-neutral-400"
                                                )}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="lg:hidden min-h-[50px]">
                                        {activeTab === 'DESCRIPTION' && (
                                            <div className="pb-8 animate-in fade-in duration-500">
                                                <p className="text-[12px] whitespace-pre-line">
                                                    {product.description}
                                                </p>
                                            </div>
                                        )}

                                        {activeTab === 'MEASUREMENTS' && (
                                            <div className="pb-8 animate-in fade-in duration-500 overflow-x-auto">
                                                {drawerContent.measurement.content}
                                            </div>
                                        )}

                                        {activeTab === 'CARE' && (
                                            <div className="pb-8 animate-in fade-in duration-500">
                                                {drawerContent.composition.content}
                                            </div>
                                        )}

                                        {activeTab === 'SHIPPING & RETURNS' && (
                                            <div className="pb-8 animate-in fade-in duration-500">
                                                {drawerContent.shipping.content}
                                            </div>
                                        )}
                                    </div>

                                    {/* Desktop Content */}
                                    <div className="hidden lg:block">
                                        <div className="pt-4">
                                            <p className="text-[12px] whitespace-pre-line">
                                                {product.description}
                                            </p>
                                        </div>

                                        <CompleteYourLook completeTheLookIds={product?.complete_the_look} />

                                        <div className="border-t border-neutral-100 mt-10 pt-6 space-y-4 max-w-[600px] mx-auto">
                                            <button
                                                onClick={() => setActiveDrawer('measurement')}
                                                className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.15em]  opacity-70 hover:opacity-100 transition-opacity"
                                            >
                                                Product measurements
                                                <ArrowRight size={14} />
                                            </button>
                                            <button
                                                onClick={() => setActiveDrawer('composition')}
                                                className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.15em]  opacity-70 hover:opacity-100 transition-opacity"
                                            >
                                                Composition & Care
                                                <ArrowRight size={14} />
                                            </button>
                                            <button
                                                onClick={() => setActiveDrawer('shipping')}
                                                className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.15em]  opacity-70 hover:opacity-100 transition-opacity"
                                            >
                                                Shipping & Returns
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="w-full lg:w-1/2">
                            <div className="max-w-[500px] lg:ml-auto px-4 lg:px-0 text-center lg:text-left">
                                {
                                    product?.fabrics?.map((fabric, index) => (
                                        <p key={index} className="text-[13px] font-light uppercase">
                                            {fabric}
                                        </p>
                                    ))
                                }

                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            {primaryProduct?.image_urls?.[1] && (
                                <div className="bg-neutral-100 overflow-hidden">
                                    <img
                                        src={primaryProduct.image_urls[1]}
                                        alt={`${product.name} - view 2`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {primaryProduct?.image_urls?.length > 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {primaryProduct.image_urls.slice(2).map((img, idx) => (
                                <div key={idx} className="bg-neutral-100 overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`${product.name} - view ${idx + 3}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div id="reviews-section" className="border-t border-neutral-100 pt-16 mt-16 scroll-mt-24">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-[0.4em] mb-3 text-black/40">Customer Feedback</p>
                                <div className="flex items-baseline gap-4">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">Reviews</h2>
                                    {averageRating && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-bold text-black">{averageRating}</span>
                                            <div className="flex text-yellow-500">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        fill={i < Math.round(parseFloat(averageRating)) ? "currentColor" : "none"}
                                                        strokeWidth={1.5}
                                                        className={i < Math.round(parseFloat(averageRating)) ? "text-yellow-500" : "text-neutral-300"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-neutral-400">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={handleWriteReviewClick}
                                className="bg-black text-white hover:bg-neutral-900 border border-black px-6 py-3 rounded-none uppercase text-[10px] tracking-[0.2em] font-medium transition-all self-start md:self-auto cursor-pointer"
                            >
                                Write A Review
                            </Button>
                        </div>

                        {reviewsLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-16 border border-neutral-100 bg-neutral-50/50">
                                <p className="text-xs uppercase tracking-widest text-neutral-400 font-light mb-4">No reviews yet for this product</p>
                                <button
                                    onClick={handleWriteReviewClick}
                                    className="text-[11px] uppercase tracking-widest font-bold border-b border-black pb-0.5 hover:pb-1 transition-all cursor-pointer"
                                >
                                    Be the first to write a review
                                </button>
                            </div>
                        ) : (
                            <div className="relative overflow-hidden">
                                {/* Review Cards Slider */}
                                <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth no-scrollbar">
                                    {reviews.map((rev) => (
                                        <div
                                            key={rev.id}
                                            className="min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] bg-neutral-50 p-8 border border-neutral-100/50 snap-start flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex gap-1 mb-4 text-yellow-500">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            fill={i < rev.rating ? "currentColor" : "none"}
                                                            strokeWidth={1.5}
                                                            className={i < rev.rating ? "text-yellow-500" : "text-neutral-300"}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-neutral-800 font-light leading-relaxed mb-6 italic">
                                                    "{rev.comment}"
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center mt-auto border-t border-neutral-100 pt-4">
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-black">{rev.user_name}</span>
                                                <span className="text-[9px] uppercase tracking-widest text-neutral-400">
                                                    {new Date(rev.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:hidden mt-8">
                        <CompleteYourLook completeTheLookIds={product?.complete_the_look} />
                        <RealatedProduct collectionId={product?.product_collections?.[0]?.collection_id} productId={product?.id} />
                    </div>


                </div>

                <div className="hidden lg:block">
                    <RealatedProduct collectionId={product?.product_collections?.[0]?.collection_id} productId={product?.id} />
                </div>


                <SideDrawer
                    isOpen={!!activeDrawer}
                    onClose={() => setActiveDrawer(null)}
                    title={activeDrawer ? drawerContent[activeDrawer].title : ""}
                >
                    {activeDrawer && drawerContent[activeDrawer].content}
                </SideDrawer>

                <CustomSizeModal
                    isOpen={showCustomSizeModal}
                    onClose={() => setShowCustomSizeModal(false)}
                    onSave={(data) => {
                        handleAddToCart('CUSTOM', primaryProduct.id, data);
                    }}
                />

                <SideDrawer
                    isOpen={showReviewDrawer}
                    onClose={() => setShowReviewDrawer(false)}
                    title="Write A Review"
                >
                    <form onSubmit={handleSubmitReview} className="space-y-8">
                        <div>
                            <label className="block text-[10px] uppercase font-bold tracking-[0.2em] mb-4 text-neutral-400">Rating</label>
                            <div className="flex gap-2 text-neutral-300">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const starValue = i + 1;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setRating(starValue)}
                                            onMouseEnter={() => setHoverRating(starValue)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <Star
                                                size={32}
                                                fill={starValue <= (hoverRating || rating) ? "#eab308" : "none"}
                                                strokeWidth={1.5}
                                                className={starValue <= (hoverRating || rating) ? "text-yellow-500" : "text-neutral-300"}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reviewer-name" className="block text-[10px] uppercase font-bold tracking-[0.2em] mb-3 text-neutral-400">Your Name</label>
                            <input
                                id="reviewer-name"
                                type="text"
                                value={reviewerName}
                                onChange={(e) => setReviewerName(e.target.value)}
                                className="w-full border-b border-neutral-300 focus:border-black py-2 text-xs uppercase tracking-widest outline-none bg-transparent transition-colors"
                                placeholder="E.g., Aisha R."
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="review-comment" className="block text-[10px] uppercase font-bold tracking-[0.2em] mb-3 text-neutral-400">Review Comments</label>
                            <textarea
                                id="review-comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                className="w-full border border-neutral-200 focus:border-black p-4 text-xs tracking-wider outline-none bg-transparent transition-colors resize-none uppercase"
                                placeholder="Share your experience with this garment's fabric, fit, and style..."
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={submittingReview}
                            className="w-full py-4 bg-black text-white hover:bg-neutral-900 border border-black rounded-none uppercase text-[11px] tracking-[0.2em] transition-all flex justify-center items-center gap-2 cursor-pointer"
                        >
                            {submittingReview ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                                "Submit Review"
                            )}
                        </Button>
                    </form>
                </SideDrawer>


                <motion.div
                    layout
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 1
                    }}
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-4 lg:hidden z-[90] safe-area-inset-bottom"
                >
                    <AnimatePresence initial={false}>
                        {!isScrolled && (
                            <motion.div
                                key="full-bar-details"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                                className="overflow-hidden"
                            >
                                <div className='flex justify-between'>
                                    <div>
                                        <p className="text-[18px] uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black mb-1">
                                            {product?.name}
                                        </p>


                                        <motion.p layoutId="product-price" className="text-[15px] font-bold tracking-wide opacity-60 hover:opacity-100 mb-1">
                                            ₹ {product?.price.toLocaleString()}
                                        </motion.p>
                                        {averageRating && (
                                            <div 
                                                onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                                                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-500 mb-2 cursor-pointer hover:text-black transition-colors"
                                            >
                                                <div className="flex text-yellow-500">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={11}
                                                            fill={i < Math.round(parseFloat(averageRating)) ? "currentColor" : "none"}
                                                            strokeWidth={1.5}
                                                            className={i < Math.round(parseFloat(averageRating)) ? "text-yellow-500" : "text-neutral-300"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-bold text-black">{averageRating}</span>
                                                <span className="opacity-60">({reviews.length})</span>
                                            </div>
                                        )}
                                        <p className="text-[10px] pt-1 font-medium uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black pb-6">
                                            MRP incl. of all taxes
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-6 ">
                                        <div className="flex gap-2">
                                            {[...colors]?.map((item) => (
                                                <div
                                                    key={item?.id}
                                                    className={cn('w-6 h-6 flex justify-center items-center cursor-pointer', { 'border border-black': item?.id === primaryProduct?.color_id?.id })}
                                                    onClick={() => findPrimaryProduct(item?.id)}
                                                >
                                                    <div
                                                        className="w-4 h-4 shadow-sm"
                                                        style={{ backgroundColor: item?.hex }}
                                                    ></div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleToggleSave}
                                            className={cn("pl-1 mt-3 flex items-center gap-2 transition-all duration-300 cursor-pointer", isSaved ? "text-black" : "text-neutral-400")}
                                        >
                                            <Bookmark
                                                size={18}
                                                strokeWidth={1}
                                                fill={isSaved ? "currentColor" : "none"}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div layout className="flex items-center justify-between gap-4">
                        <motion.div
                            layout
                            animate={{ maxWidth: isScrolled ? "340px" : "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex-grow flex gap-2"
                        >
                            <Button
                                onClick={() => {
                                    setShowSizes(true);
                                }}
                                className="flex-grow bg-white text-black border border-black rounded-none h-11 uppercase text-[11px] tracking-[0.2em] hover:bg-neutral-50"
                            >
                                ADD TO CART
                            </Button>

                        </motion.div>

                        <AnimatePresence>
                            {isScrolled && (
                                <motion.div
                                    key="compact-price"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="flex flex-col justify-center"
                                >
                                    <motion.p layoutId="product-price" className="text-[15px] font-bold tracking-wide opacity-60 hover:opacity-100 mb-1">
                                        ₹ {product?.price.toLocaleString()}
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {showSizes && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowSizes(false)}
                                className="fixed inset-0 bg-black/40 z-[100] lg:hidden"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed bottom-0 left-0 right-0 bg-white z-[101] lg:hidden pb-safe-area shadow-[0_-8px_30px_rgb(0,0,0,0.12)]"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <p className="text-[11px] uppercase tracking-[0.2em] font-medium">Select Size</p>
                                        <button onClick={() => setShowSizes(false)} className="text-[10px] uppercase tracking-widest opacity-60">Close</button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => {
                                                setShowCustomSizeModal(true);
                                                setShowSizes(false);
                                            }}
                                            className="w-full py-4 text-[11px] uppercase tracking-widest border border-neutral-100 hover:bg-neutral-50 transition-colors"
                                        >
                                            Custom Size
                                        </button>
                                        {currentProductSizes?.map(size => (
                                            <button
                                                key={size.size}
                                                onClick={() => {
                                                    setSelectedSize(size.size);
                                                    setShowSizes(false);
                                                    handleAddToCart(size.size, size.id);
                                                }}
                                                className={cn(
                                                    "w-full py-4 text-[11px] uppercase tracking-widest border transition-colors",
                                                    selectedSize === size.size ? "bg-black text-white border-black" : "bg-white text-black border-neutral-100 hover:bg-neutral-50"
                                                )}
                                            >
                                                {size.size}
                                            </button>
                                        ))}

                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>




            </div >
        </div >
    );
}
