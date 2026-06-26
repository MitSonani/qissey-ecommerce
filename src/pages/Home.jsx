import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../features/products';
import Hero from '../components/Hero';
import { fetchNewArrivalProducts, fetchAllCollections, fetchRecentReviews, productCache } from '../features/products/services/productService';
import SEO from '../components/ui/SEO';

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

    // Fetch actual reviews from the server
    useEffect(() => {
        const loadReviews = async () => {
            try {
                const reviews = await fetchRecentReviews(5);
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

            {/* Testimonials Slider */}
            {testimonials.length > 0 && (
                <section className="py-16 md:py-24 md:px-8 bg-neutral-50/50 border-t border-neutral-100/60 mt-8 md:mt-16">
                    <div className="container max-w-4xl mx-auto px-4 text-center">
                        <p className="text-[10px] uppercase font-bold tracking-[0.4em] mb-4 text-black/40">Loved by Our Customers</p>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter drop-shadow-md mb-12">What They Say</h2>

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
                    </div>
                </section>
            )}
        </div>
    );
}
