import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchHeroSlides } from '../features/products/services/heroService';

export default function Hero() {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSlides = async () => {
            try {
                const data = await fetchHeroSlides();
                setSlides(data);
            } catch (error) {
                console.error('Failed to load hero slides:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSlides();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!slides.length) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (loading) {
        return (
            <section className="relative mx-auto max-w-[1080px] h-[79vh] md:h-[calc(100vh-8.6rem)] w-full flex items-center justify-center bg-white/50 animate-pulse">
                <div className="w-full h-full bg-gray-100" />
            </section>
        );
    }

    if (!slides.length) return null;

    const currentSlide = slides[currentIndex];
    const imageSrc = isMobile ? (currentSlide.mobile_image_url || currentSlide.desktop_image_url) : currentSlide.desktop_image_url;

    const ctaLabel = currentSlide.cta_label || 'Shop Now';

    const SlideContent = (
        <div className="absolute inset-0 z-0">
            {/* Full-bleed image with crossfade */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={`${currentIndex}-${isMobile}`}
                    src={imageSrc}
                    alt={currentSlide.title || 'Hero Slide'}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                />
            </AnimatePresence>

            {/* Subtle gradient scrim at the bottom for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Minimal CTA overlay — bottom aligned */}
            <motion.div
                key={`cta-${currentIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
                className="absolute bottom-8 md:bottom-12 left-0 right-0 flex flex-col items-center gap-3 text-white text-center px-4 pointer-events-none"
            >
                {currentSlide.subtitle && (
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-semibold opacity-80">
                        {currentSlide.subtitle}
                    </p>
                )}
                <span className="inline-flex items-center gap-2 text-[11px] md:text-xs uppercase tracking-[0.35em] font-bold border-b border-white/60 pb-0.5">
                    {ctaLabel} &rarr;
                </span>
            </motion.div>

            {/* Slide dots indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                    {slides.map((_, i) => (
                        <span
                            key={i}
                            className={`block rounded-full transition-all duration-500 ${
                                i === currentIndex
                                    ? 'w-5 h-[3px] bg-white'
                                    : 'w-[3px] h-[3px] bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <section className="relative mx-auto max-w-[1080px] h-[79vh] md:h-[calc(100vh-8.6rem)] w-full flex flex-col items-center md:justify-center overflow-hidden bg-white mt-5 md:mt-[20px]">
            {currentSlide.link_url ? (
                <Link to={currentSlide.link_url} className="absolute inset-0 block cursor-pointer">
                    {SlideContent}
                </Link>
            ) : (
                SlideContent
            )}
        </section>
    );
}
