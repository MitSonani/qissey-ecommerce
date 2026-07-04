import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../features/products';
import Hero from '../components/Hero';
import { fetchNewArrivalProducts, fetchAllCollections, fetchRecentReviews, productCache, fetchProducts, submitProductReview } from '../features/products/services/productService';
import SEO from '../components/ui/SEO';
import { useAuth } from '../features/auth';
import SideDrawer from '../components/ui/SideDrawer';
import { toast } from 'sonner';

const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://qissey.com/#organization',
    'name': 'QISSEY',
    'alternateName': 'QISSEY Creative Studio',
    'url': 'https://qissey.com',
    'logo': 'https://qissey.com/logo.PNG',
    'description': 'Refined minimalist fashion studio based in India, specializing in sustainable luxury clothing for women.',
    'foundingDate': '2024',
    'sameAs': [
        'https://www.instagram.com/qissey._/',
        'https://www.facebook.com/people/Qissey/61586697613049/'
    ]
};

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://qissey.com/#website',
    'name': 'QISSEY',
    'url': 'https://qissey.com',
    'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://qissey.com/shop?q={search_term_string}',
        'query-input': 'required name=search_term_string'
    }
};

export default function Home() {
    const [testimonials, setTestimonials] = useState([]);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Review system state
    const [showReviewDrawer, setShowReviewDrawer] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchProductQuery, setSearchProductQuery] = useState('');

    // Review form state
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewerName, setReviewerName] = useState(user?.name || '');
    const [submittingReview, setSubmittingReview] = useState(false);

    // Update reviewerName when user logs in or updates profile
    useEffect(() => {
        if (user?.name) {
            setReviewerName(user.name);
        }
    }, [user]);

    // Load products for review search when drawer opens
    useEffect(() => {
        if (showReviewDrawer) {
            const loadProductsForReview = async () => {
                try {
                    setLoadingProducts(true);
                    const data = await fetchProducts();
                    setAllProducts(data || []);
                } catch (err) {
                    console.error("Failed to load products for review:", err);
                } finally {
                    setLoadingProducts(false);
                }
            };
            loadProductsForReview();
        }
    }, [showReviewDrawer]);

    const handleWriteReviewClick = () => {
        if (!user) {
            toast.error('Please log in to write a review');
            navigate('/auth', { state: { from: location } });
            return;
        }
        setShowReviewDrawer(true);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!selectedProduct) {
            toast.error('Please select a product to review');
            return;
        }
        if (!comment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        try {
            setSubmittingReview(true);
            await submitProductReview(selectedProduct.id, {
                rating,
                comment: comment.trim(),
                user_name: reviewerName || 'Anonymous'
            });

            // Reload reviews to show the new one
            const updatedReviews = await fetchRecentReviews(6);
            setTestimonials(updatedReviews || []);
            setActiveTestimonial(0);

            // Reset form state
            setShowReviewDrawer(false);
            setComment('');
            setRating(5);
            setSelectedProduct(null);
            setSearchProductQuery('');
        } catch (err) {
            console.error('Failed to submit review:', err);
        } finally {
            setSubmittingReview(false);
        }
    };

    const filteredProducts = allProducts.filter(p =>
        p.name?.toLowerCase().includes(searchProductQuery.toLowerCase())
    );

    // Fetch actual reviews from the server
    useEffect(() => {
        const loadReviews = async () => {
            try {
                const reviews = await fetchRecentReviews(6);
                setTestimonials(reviews || []);
            } catch (err) {
                console.error("Failed to load homepage reviews:", err);
            }
        };
        loadReviews();
    }, []);

    // Auto rotate every 7 seconds
    useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const handlePrevTestimonial = () => {
        setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleNextTestimonial = () => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const [productsS, setProducts] = useState(() => {
        if (productCache.newArrivals.data) {
            return productCache.newArrivals.data;
        }
        return [];
    });

    const [collections, setCollections] = useState(() => {
        if (productCache.collections.data) {
            return productCache.collections.data.filter(c => c.name.toLowerCase() !== 'new arrival');
        }
        return [];
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsRes, collectionsRes] = await Promise.all([
                    fetchNewArrivalProducts(6),
                    fetchAllCollections()
                ]);
                setProducts(productsRes);
                const filterCollection = collectionsRes.filter(c => c.name.toLowerCase() !== 'new arrival');
                setCollections(filterCollection);
            } catch (error) {
                console.error('Error loading home data:', error);
            }
        };

        loadData();
    }, []);


    return (
        <div className="relative overflow-hidden mx-2 md:mx-24 mt-20 md:my-34">
            <SEO
                title="Refined Minimalist Fashion | Sustainable Luxury Clothing"
                description="Discover QISSEY — a refined minimalist fashion studio in India. Sustainable luxury clothing for women. Shop elegant tops, dresses, and formal wear crafted with care."
                schema={[homeSchema, websiteSchema]}
            />
            <h1 className="sr-only">Refined Minimalist Fashion for the Modern Woman — QISSEY</h1>
            <Hero />

            {/* New Arrivals Slider */}
            {!!productsS?.length && <section className="md:px-8 overflow-hidden mt-20">
                <div className="container">
                    <div className="mb-12">
                        <p className="text-[10px] uppercase font-bold tracking-[0.4em] mb-4 text-black/40">The Latest Drops</p>
                        <div className="flex justify-between  gap-4">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-lg">New Arrivals</h2>
                            <div className='flex justify-center items-center'>  <Link
                                to="/new-arrivals"
                                className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:pb-2 transition-all whitespace-nowrap"
                            >
                                View All
                            </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 ">
                        {productsS.slice(0, 6).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>}

            {/* Featured Collections Tiles */}
            <section className="py-16 md:px-8 bg-white mt-8 md:mt-16">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">
                        {[...collections].map((collection) => (
                            <Link
                                key={collection.id}
                                to={`/collection/${collection.id}`}
                                className="text-xs uppercase font-bold tracking-widest border-b-2 border-white pb-1 hover:pb-2 transition-all inline-block "
                            >
                                <div className="relative aspect-[3/4] bg-brand-gray overflow-hidden group">
                                    {collection.image_url ? (
                                        <img
                                            src={collection.image_url}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            alt={collection.name}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-brand-gray" />
                                    )}
                                    <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:bg-black/20" />
                                    <div className="absolute bottom-12 left-0 right-0 text-center text-white">
                                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                                            {collection.name}
                                        </h2>
                                        <p>
                                            view collection
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 md:py-24 md:px-8 bg-neutral-50/50 border-t border-neutral-100/60 mt-8 md:mt-16">
                <div className="container max-w-4xl mx-auto px-4 text-center">
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] mb-4 text-black/40">Loved by Our Customers</p>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter drop-shadow-md mb-12">What They Say</h2>

                    {testimonials.length > 0 ? (
                        <>
                            <div className="relative min-h-[220px] flex items-center justify-center">
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
                                                    fill={i < testimonials[activeTestimonial].rating ? "currentColor" : "none"}
                                                    strokeWidth={1.5}
                                                    className={i < testimonials[activeTestimonial].rating ? "text-yellow-500" : "text-neutral-300"}
                                                />
                                            ))}
                                        </div>

                                        {/* Comment */}
                                        <p className="text-base md:text-lg font-light text-neutral-800 italic leading-relaxed max-w-2xl mb-6">
                                            "{testimonials[activeTestimonial].comment}"
                                        </p>

                                        {/* Author */}
                                        <p className="text-xs uppercase font-bold tracking-widest text-black">
                                            — {testimonials[activeTestimonial].user_name}
                                        </p>

                                        {/* Reviewed Product */}
                                        {testimonials[activeTestimonial].products && (
                                            <Link
                                                to={`/product/${testimonials[activeTestimonial].products.slug}`}
                                                className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black mt-2 transition-colors border-b border-transparent hover:border-black pb-0.5"
                                            >
                                                Reviewed {testimonials[activeTestimonial].products.name}
                                            </Link>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Navigation Dots & Arrows */}
                            {testimonials.length > 1 && (
                                <div className="flex items-center justify-center gap-6 mt-10">
                                    <button
                                        onClick={handlePrevTestimonial}
                                        className="p-2 border border-black/5 hover:border-black/20 hover:bg-white text-black transition-all rounded-full cursor-pointer"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <div className="flex gap-2">
                                        {testimonials.map((_, idx) => (
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
                            onClick={handleWriteReviewClick}
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
                    setSelectedProduct(null);
                    setSearchProductQuery('');
                    setComment('');
                    setRating(5);
                }}
                title="Write A Review"
            >
                <form onSubmit={handleSubmitReview} className="space-y-6">
                    {/* Step 1: Select Product */}
                    <div>
                        <label className="block text-[10px] uppercase font-bold tracking-[0.2em] mb-3 text-neutral-400">
                            Select Product to Review
                        </label>

                        {selectedProduct ? (
                            <div className="flex items-center justify-between p-4 border border-black/10 bg-neutral-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-16 bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100">
                                        {selectedProduct.product_variants?.[0]?.image_urls?.[0] ? (
                                            <img
                                                src={selectedProduct.product_variants[0].image_urls[0]}
                                                alt={selectedProduct.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-100" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs uppercase font-bold tracking-wider text-black">
                                            {selectedProduct.name}
                                        </p>
                                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5">
                                            ₹ {selectedProduct.price?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedProduct(null)}
                                    className="text-[9px] uppercase tracking-widest font-bold border-b border-black pb-0.5 hover:pb-1 transition-all cursor-pointer text-neutral-500 hover:text-black"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="SEARCH PRODUCT..."
                                    value={searchProductQuery}
                                    onChange={(e) => setSearchProductQuery(e.target.value)}
                                    className="w-full px-4 py-3 border border-black/15 bg-white text-[11px] uppercase tracking-widest focus:outline-none focus:border-black transition-colors"
                                />

                                {loadingProducts ? (
                                    <div className="flex justify-center items-center py-6">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                                    </div>
                                ) : (
                                    <div className="max-h-[220px] overflow-y-auto border border-black/10 divide-y divide-black/5 no-scrollbar">
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map((prod) => (
                                                <button
                                                    key={prod.id}
                                                    type="button"
                                                    onClick={() => setSelectedProduct(prod)}
                                                    className="w-full flex items-center justify-between p-3 hover:bg-neutral-50/80 text-left transition-colors cursor-pointer group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-10 bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100">
                                                            {prod.product_variants?.[0]?.image_urls?.[0] ? (
                                                                <img
                                                                    src={prod.product_variants[0].image_urls[0]}
                                                                    alt={prod.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-neutral-100" />
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] uppercase tracking-widest text-neutral-600 group-hover:text-black transition-colors">
                                                            {prod.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 group-hover:text-black">
                                                        Select
                                                    </span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-[10px] text-neutral-400 uppercase tracking-widest">
                                                No products found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Review Details (shown once product is selected) */}
                    {selectedProduct && (
                        <div className="space-y-6 pt-4 border-t border-black/5 animate-in fade-in duration-300">
                            {/* Star Rating */}
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400 mb-2">
                                    Your Rating
                                </label>
                                <div className="flex gap-2 justify-center py-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="text-yellow-500 transition-colors focus:outline-none cursor-pointer"
                                        >
                                            <Star
                                                size={28}
                                                fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reviewer Name */}
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={reviewerName}
                                    onChange={(e) => setReviewerName(e.target.value)}
                                    placeholder="ENTER YOUR NAME"
                                    required
                                    className="w-full px-4 py-3 border border-black/15 bg-white text-[11px] uppercase tracking-widest focus:outline-none focus:border-black transition-colors"
                                />
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400 mb-2">
                                    Your Review
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="WRITE YOUR REVIEW HERE..."
                                    rows={4}
                                    required
                                    className="w-full px-4 py-3 border border-black/15 bg-white text-[11px] uppercase tracking-widest focus:outline-none focus:border-black transition-colors resize-none leading-relaxed"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="w-full py-4 bg-black text-white uppercase text-[11px] tracking-[0.2em] font-medium transition-colors hover:bg-neutral-900 cursor-pointer disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {submittingReview ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                                        SUBMITTING...
                                    </>
                                ) : (
                                    "SUBMIT REVIEW"
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </SideDrawer>
        </div>
    );
}
