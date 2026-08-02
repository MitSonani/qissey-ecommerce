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
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [newName, setNewName] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [showReviewDrawer, setShowReviewDrawer] = useState(false);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const sizeSelectorRef = useRef(null);

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

                // Fetch product reviews
                const reviewsData = await fetchProductReviews(productData.id);
                setReviews(reviewsData || []);
                if (reviewsData && reviewsData.length > 0) {
                    const avg = reviewsData.reduce((acc, r) => acc + r.rating, 0) / reviewsData.length;
                    setAverageRating(avg.toFixed(1));
                } else {
                    setAverageRating(null);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error loading product:', err);
                setError('Failed to load product. Please try again.');
                setLoading(false);
            }
        };

        loadProductData();
    }, [slug, user?.id]);

    // Auto rotate reviews every 7 seconds
    useEffect(() => {
        if (reviews.length <= 1) return;
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % reviews.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [reviews.length]);

    const handlePrevTestimonial = () => {
        setActiveTestimonial((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const handleNextTestimonial = () => {
        setActiveTestimonial((prev) => (prev + 1) % reviews.length);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        try {
            setSubmittingReview(true);
            const reviewData = {
                rating: newRating,
                comment: newComment,
                user_name: newName || (user?.name) || 'Anonymous'
            };

            const submitted = await submitProductReview(product.id, reviewData);
            if (submitted) {
                const updatedReviews = [submitted, ...reviews];
                setReviews(updatedReviews);
                const avg = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
                setAverageRating(avg.toFixed(1));
                setActiveTestimonial(0);

                // Reset form state
                setShowReviewDrawer(false);
                setNewComment('');
                setNewName('');
                setNewRating(5);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmittingReview(false);
        }
    };


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
        measurement: (() => {
            const measurements = product?.product_measurements;
            const sizeChartObj = (Array.isArray(measurements) ? measurements[0] : measurements)?.size_chart;

            if (!sizeChartObj || !sizeChartObj.inches) {
                return {
                    title: "Product Measurements",
                    content: (
                        <div className="space-y-6 text-center py-8">
                            <p className="text-[11px] font-light uppercase text-neutral-500">
                                No measurements available for this product.
                            </p>
                        </div>
                    )
                };
            }

            const columns = sizeChartObj.columns || ['chest', 'waist', 'hips'];
            const inchesChart = sizeChartObj.inches || [];
            const cmChart = sizeChartObj.cm || [];

            return {
                title: "Product Measurements",
                content: (
                    <div className="space-y-6">
                        <p className="text-[11px] font-light uppercase">
                            This guide provides the exact measurements for this product in each size.
                        </p>

                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left text-[11px] uppercase tracking-wider min-w-max">
                                <thead className="border-b border-neutral-100">
                                    <tr>
                                        <th className="py-4 px-2 font-bold">SIZE</th>
                                        {columns.map(col => (
                                            <th key={col} className="py-4 px-2 font-bold">{col} <br />(inch/ cm)</th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-neutral-50 text-neutral-500">
                                    {inchesChart.map((inchRow, idx) => {
                                        const cmRow = cmChart[idx] || {};
                                        return (
                                            <tr key={inchRow.size || idx}>
                                                <td className="py-4 px-2 text-black font-bold">{inchRow.size}</td>
                                                {columns.map(col => {
                                                    const inchVal = inchRow[col] || '-';
                                                    const cmVal = cmRow[col] || '-';
                                                    return (
                                                        <td key={col} className="py-4 px-2 whitespace-nowrap">
                                                            {inchVal === '-' && cmVal === '-' ? '-' : `${inchVal}″ / ${cmVal} cm`}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            };
        })(),
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
                                    <p className="text-[10px] font-medium uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black pb-1">
                                        MRP incl. of all taxes
                                    </p>
                                    <p className="text-[9px] uppercase tracking-[0.1em] text-neutral-500 pb-6">
                                        Enjoy 5% off on prepaid orders
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

                                        {/* Quiet Trust Cues Section */}
                                        <div className="border-t border-neutral-100 mt-10 pt-8 grid grid-cols-2 gap-4 text-[9px] uppercase tracking-wider text-neutral-500 font-light">
                                            <div className="space-y-1">
                                                <p className="text-black font-semibold">✦ Free Shipping</p>
                                                <p className="opacity-75">7-10 Days Delivery</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-black font-semibold">✦ Easy Exchanges</p>
                                                <p className="opacity-75">10-Day Policy</p>
                                            </div>
                                            <div className="space-y-1 mt-2">
                                                <p className="text-black font-semibold">✦ Secure Payments</p>
                                                <p className="opacity-75">UPI, Cards, COD</p>
                                            </div>
                                            <div className="space-y-1 mt-2">
                                                <p className="text-black font-semibold">✦ Customer Support</p>
                                                <p className="opacity-75">Instagram & email</p>
                                            </div>
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
                                        <p key={index} className="text-[16px] font-light uppercase">
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


                    <div className="lg:hidden mt-8">
                        <CompleteYourLook completeTheLookIds={product?.complete_the_look} />
                        <RealatedProduct collectionId={product?.product_collections?.[0]?.collection_id} productId={product?.id} />
                    </div>


                </div>

                <div className="hidden lg:block">
                    <RealatedProduct collectionId={product?.product_collections?.[0]?.collection_id} productId={product?.id} />
                </div>

                {/* Testimonials Section */}
                <section id="reviews-section" className="py-16 md:py-24 md:px-8 bg-neutral-50/50 border-t border-neutral-100/60 mt-8 md:mt-16">
                    <div className="container max-w-4xl mx-auto px-4 text-center">
                        <p className="text-[10px] uppercase font-bold tracking-[0.4em] mb-4 text-black/40">Product Journal</p>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter drop-shadow-md mb-12">Customer Journal</h2>

                        {reviews.length > 0 ? (
                            <>
                                <div className="relative min-h-[200px] flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTestimonial}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -15 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="w-full flex flex-col items-center"
                                        >
                                            {/* Stars */}
                                            <div className="flex gap-1 mb-6 text-yellow-500">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        fill={i < reviews[activeTestimonial].rating ? "currentColor" : "none"}
                                                        strokeWidth={1.5}
                                                        className={i < reviews[activeTestimonial].rating ? "text-yellow-500" : "text-neutral-300"}
                                                    />
                                                ))}
                                            </div>

                                            {/* Comment */}
                                            <p className="text-base md:text-lg font-light text-neutral-800 italic leading-relaxed max-w-2xl mb-6">
                                                "{reviews[activeTestimonial].comment}"
                                            </p>

                                            {/* Author */}
                                            <p className="text-xs uppercase font-bold tracking-widest text-black">
                                                — {reviews[activeTestimonial].user_name}
                                            </p>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Navigation Dots & Arrows */}
                                {reviews.length > 1 && (
                                    <div className="flex items-center justify-center gap-6 mt-10">
                                        <button
                                            onClick={handlePrevTestimonial}
                                            className="p-2 border border-black/5 hover:border-black/20 hover:bg-white text-black transition-all rounded-full cursor-pointer"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <div className="flex gap-2">
                                            {reviews.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveTestimonial(idx)}
                                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeTestimonial === idx ? 'bg-black w-4' : 'bg-black/20'}`}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleNextTestimonial}
                                            className="p-2 border border-black/5 hover:border-black/20 hover:bg-white text-black transition-all rounded-full cursor-pointer"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-sm font-light text-neutral-500 uppercase tracking-widest mb-6">No reviews yet. Share your experience with us!</p>
                            </div>
                        )}

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => setShowReviewDrawer(true)}
                                className="bg-black text-white hover:bg-neutral-900 border border-black px-6 py-3 rounded-none uppercase text-[10px] tracking-[0.2em] font-medium transition-all cursor-pointer"
                            >
                                Write A Review
                            </button>
                        </div>
                    </div>
                </section>

                {/* Review Submission Drawer */}
                <SideDrawer
                    isOpen={showReviewDrawer}
                    onClose={() => {
                        setShowReviewDrawer(false);
                        setNewComment('');
                        setNewName('');
                        setNewRating(5);
                    }}
                    title="Write A Review"
                >
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] uppercase font-bold tracking-[0.2em] mb-3 text-neutral-400">
                                Rating
                            </label>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewRating(star)}
                                        className="text-yellow-500 hover:scale-110 transition-transform cursor-pointer"
                                    >
                                        <Star
                                            size={20}
                                            fill={star <= newRating ? "currentColor" : "none"}
                                            strokeWidth={1.5}
                                            className={star <= newRating ? "text-yellow-500" : "text-neutral-300"}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase font-bold tracking-[0.2em] mb-3 text-neutral-400">
                                Your Name
                            </label>
                            <input
                                type="text"
                                placeholder="ENTER YOUR NAME..."
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full px-4 py-3 border border-black/15 bg-white text-[11px] uppercase tracking-widest focus:outline-none focus:border-black transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase font-bold tracking-[0.2em] mb-3 text-neutral-400">
                                Comment
                            </label>
                            <textarea
                                placeholder="SHARE YOUR EXPERIENCE..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 border border-black/15 bg-white text-[11px] focus:outline-none focus:border-black transition-colors resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={submittingReview}
                            className="w-full bg-black text-white hover:bg-neutral-900 border border-black h-12 rounded-none uppercase text-[10px] tracking-[0.2em] font-medium transition-all"
                        >
                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </form>
                </SideDrawer>


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
                                        <p className="text-[10px] pt-1 font-medium uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black pb-1">
                                            MRP incl. of all taxes
                                        </p>
                                        <p className="text-[9px] uppercase tracking-[0.1em] text-neutral-500  pb-6">
                                            Enjoy 5% off on prepaid orders
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
