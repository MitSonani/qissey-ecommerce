import { ArrowRight, Play, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products, ProductCard } from '../features/products';
import { Button } from '../components/ui/Primitives';

export default function Home() {
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
                <div className="relative z-10 text-center text-black px-4 max-w-5xl">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-[10px] md:text-[12px] uppercase font-bold tracking-[0.4em] mb-6 text-black/60"
                    >
                        Spring Summer 2026 Collection
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-6xl md:text-[10rem] font-black uppercase leading-[0.85] tracking-tighter mb-12"
                    >
                        RAW<br />MINIMAL
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link to="/shop">
                            <Button size="lg" className="bg-black text-white hover:bg-black/80 px-12 group rounded-none border-none">
                                Shop Collection
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Featured Collections Tiles */}
            <section className="py-32 px-6 md:px-12 bg-white">
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
            <section className="pb-32 px-6 md:px-12 overflow-hidden">
                <div className="container">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-[0.4em] mb-4 text-black/40">The Latest Drops</p>
                            <h2 className="text-5xl font-black uppercase tracking-tighter">New Arrivals</h2>
                        </div>
                        <Link to="/shop" className="text-xs uppercase font-bold tracking-widest border-b border-black pb-1 hover:opacity-50 transition-opacity">
                            View All
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Brands Philosophy */}
            <section className="py-40 bg-white border-t border-black/5 flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight max-w-4xl leading-tight mb-12">
                    WE BELIEVE IN CLOTHING THAT CELEBRATES THE INDIVIDUAL THROUGH REFINED MATERIALITY AND MINIMAL DESIGN.
                </h2>
                <Link to="/about">
                    <Button variant="outline" className="px-16 border-black text-black hover:bg-black hover:text-white transition-colors">Our Philosophy</Button>
                </Link>
            </section>
        </div>
    );
}
