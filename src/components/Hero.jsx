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

    const SlideContent = (
        <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
                <motion.img
                    key={`${currentIndex}-${isMobile}`}
                    src={imageSrc}
                    alt={currentSlide.title || 'Hero Slide'}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/5" />

            {/* Added overlay content support if needed in future */}
            {(currentSlide.title || currentSlide.subtitle) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                    {currentSlide.title && (
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            key={`title-${currentIndex}`}
                            className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-2xl mb-4"
                        >
                            {currentSlide.title}
                        </motion.h2>
                    )}
                    {currentSlide.subtitle && (
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            key={`subtitle-${currentIndex}`}
                            className="text-xs md:text-sm uppercase tracking-[0.4em] font-bold"
                        >
                            {currentSlide.subtitle}
                        </motion.p>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <section className="relative mx-auto max-w-[1080px] h-[79vh] md:h-[calc(100vh-8.6rem)] w-full flex flex-col items-center md:justify-center overflow-hidden bg-white mt-5 md:mt-[20px]">
            {currentSlide.link_url ? (
                <Link to={currentSlide.link_url} className="absolute inset-0 block">
                    {SlideContent}
                </Link>
            ) : (
                SlideContent
            )}
        </section>
    );
}
