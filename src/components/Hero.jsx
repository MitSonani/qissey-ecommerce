import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const heroSlides = [
    {
        id: 1,
        image: '/images/hero/hero1.png',
        title: 'RAW MINIMAL',
        subtitle: 'Spring Summer 2026 Collection'
    },
    {
        id: 2,
        image: '/images/hero/hero2.png',
        title: 'MODERN LINES',
        subtitle: 'Spring Summer 2026 Collection'
    },
    {
        id: 3,
        image: '/images/hero/hero3.png',
        title: 'ETHYREAL FLOW',
        subtitle: 'Spring Summer 2026 Collection'
    }
];

export default function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative mx-auto max-w-[1080px] max-h-[82.5vh] md:h-screen w-full flex flex-col items-center md:items-center md:justify-center overflow-hidden bg-white">
            {/* Hero Background Carousel */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={heroSlides[currentIndex].image}
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

            <div className="block md:hidden pt-20 pb-4 flex justify-center px-6 relative z-10">
                <Link to="/" className="w-full max-w-[180px]">
                    <img
                        src="/logo.PNG"
                        alt="QISSEY"
                        className="w-auto h-12 object-contain filter invert"
                    />
                </Link>
            </div>


        </section>
    );
}
