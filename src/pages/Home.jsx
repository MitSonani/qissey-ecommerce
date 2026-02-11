import { useState, useEffect } from 'react';
import { ArrowRight, Play, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { products, ProductCard } from '../features/products';
import { Button } from '../components/ui/Primitives';
import Hero from '../components/Hero';

export default function Home() {
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="relative overflow-hidden mx-2 md:mx-24 mt-20 mb-16 md:my-34">
            <Hero />

            {/* Featured Collections Tiles */}
            <section className="py-32  md:px-8 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="col-span-1 lg:col-span-2 relative aspect-[16/9] bg-brand-gray overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                alt="Category"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/30" />
                            <div className="absolute bottom-12 left-12 text-white">
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Essentials</h2>
                                <Link to="/shop" className="text-xs uppercase font-bold tracking-widest border-b-2 border-white pb-1 hover:pb-2 transition-all">Explore</Link>
                            </div>
                        </div>
                        <div className="relative aspect-square md:aspect-auto lg:aspect-[3/4] bg-brand-gray overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1539106609512-71714f291077?q=80&w=1000&auto=format&fit=crop"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                alt="Category"
                            />
                            <div className="absolute top-12 left-12 text-white">
                                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Outerwear</h2>
                                <Link to="/shop" className="text-xs uppercase font-bold tracking-widest border-b-2 border-white pb-1 hover:pb-2 transition-all">Shop Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals Slider */}
            <section className="pb-32 md:px-8 overflow-hidden ">
                <div className="container">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-[0.4em] mb-4 text-black/40">The Latest Drops</p>
                            <h2 className="text-5xl font-black uppercase tracking-tighter">New Arrivals</h2>
                        </div>
                        <Link to="/shop" className="text-[10px] uppercase font-bold tracking-[0.4em] mb-4 text-black/40 hover:opacity-50 transition-opacity">
                            View All
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
