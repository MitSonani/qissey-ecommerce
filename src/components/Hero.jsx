import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const heroSlides = [
    {
        id: 1,
        image: '/images/hero/hero1.png',
        mobileImage: '/images/hero/hero1.png',
        title: 'RAW MINIMAL',
        subtitle: 'Spring Summer 2026 Collection'
    },
    {
        id: 2,
        image: '/images/hero/hero2.png',
        mobileImage: '/images/hero/hero1.png',
        title: 'MODERN LINES',
        subtitle: 'Spring Summer 2026 Collection'
    },
    {
        id: 3,
        image: '/images/hero/hero3.png',
        mobileImage: '/images/hero/hero1.png',
        title: 'ETHYREAL FLOW',
        subtitle: 'Spring Summer 2026 Collection'
    }
];

export default function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative mx-auto max-w-[1080px] h-[79vh] md:h-screen w-full flex flex-col items-center md:justify-center overflow-hidden bg-white">
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={`${currentIndex}-${isMobile}`}
                        src={isMobile ? heroSlides[currentIndex].mobileImage : heroSlides[currentIndex].image}
                        alt="Hero"
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-white/10" />
            </div>




        </section>
    );
}
