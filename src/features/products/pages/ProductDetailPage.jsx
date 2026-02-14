import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { products } from '../services/productService';
import { useCart } from '../../../features/cart';
import { Button, cn } from '../../../components/ui/Primitives';
import { Plus, ChevronDown, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import SideDrawer from '../../../components/ui/SideDrawer';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const product = products.find(p => p.id === parseInt(id));
    const [selectedSize, setSelectedSize] = useState(null);
    const [showSizes, setShowSizes] = useState(false);
    const [activeDrawer, setActiveDrawer] = useState(null);

    if (!product)
        return (
            <div className="pt-40 container text-center">
                Product not found
            </div>
        );

    const relatedProducts = products
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    const drawerContent = {
        measurement: {
            title: "Product Measurements",
            content: (
                <div className="space-y-6">
                    <p className="text-sm text-neutral-600 font-light">This guide provides the exact measurements for this product in each size.</p>
                    <table className="w-full text-left text-[11px] uppercase tracking-wider">
                        <thead className="border-b border-neutral-100">
                            <tr>
                                <th className="py-4 font-bold">SIZE</th>
                                <th className="py-4 font-bold">CHEST</th>
                                <th className="py-4 font-bold">LENGTH</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50 text-neutral-500">
                            <tr><td className="py-4 text-black font-bold">S</td><td className="py-4">102 cm</td><td className="py-4">70 cm</td></tr>
                            <tr><td className="py-4 text-black font-bold">M</td><td className="py-4">106 cm</td><td className="py-4">72 cm</td></tr>
                            <tr><td className="py-4 text-black font-bold">L</td><td className="py-4">110 cm</td><td className="py-4">74 cm</td></tr>
                            <tr><td className="py-4 text-black font-bold">XL</td><td className="py-4">114 cm</td><td className="py-4">76 cm</td></tr>
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
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Composition</h3>
                        <p className="text-xs uppercase tracking-widest text-black mb-2">100% Organic Cotton</p>
                        <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                            We work with monitoring programmes to ensure compliance with safety, health and quality standards for our products.
                            Grown without synthetic pesticides or fertilizers and without genetically modified seeds.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Care</h3>
                        <div className="space-y-4 text-[11px] text-neutral-600 uppercase tracking-widest">
                            <p>• Machine wash at max. 30ºC/86ºF</p>
                            <p>• Do not use bleach</p>
                            <p>• Iron at a maximum of 110ºC/230ºF</p>
                            <p>• Do not dry clean</p>
                            <p>• Do not tumble dry</p>
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
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Shipping</h3>
                        <p className="text-xs tracking-widest text-neutral-600 leading-relaxed uppercase">
                            Standard delivery within 3-5 business days. Free for orders over ₹ 2,990.
                        </p>
                    </section>
                    <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Returns</h3>
                        <p className="text-xs tracking-widest text-neutral-600 leading-relaxed uppercase">
                            Free exchanges and returns within 30 days of purchase. Simply visit any of our stores or request a home pick-up.
                        </p>
                    </section>
                </div>
            )
        }
    };

    return (
        <div className="pt-30 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">

                <div className="flex flex-col lg:flex-row gap-10">

                    <div className="w-full lg:w-1/2 space-y-6">
                        {product.images.map((img, idx) => (
                            <div
                                key={idx}
                                className="bg-neutral-100 overflow-hidden"
                            >
                                <img
                                    src={img}
                                    alt={`${product.title} - view ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col">
                        <div className="sticky top-24 space-y-8">

                            <div>


                                <p className="text-[18px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block text-black mb-2">
                                    {product.title}
                                </p>

                                <p className="text-[15px] font-bold tracking-wide  opacity-60 hover:opacity-100 ">
                                    ₹ {product.price.toLocaleString()}
                                </p>

                                <p className="text-[10px] font-medium uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block text-black mt-1">
                                    MRP incl. of all taxes
                                </p>
                            </div>

                            <div className="border-t border-neutral-200 pt-6">
                                <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block text-black mb-6">
                                    {product.color || 'BROWN'}
                                </p>

                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {showSizes && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex flex-col gap-2 pb-4">
                                                    {product.sizes.map(size => (
                                                        <button
                                                            key={size}
                                                            onClick={() => {
                                                                setSelectedSize(size);
                                                                addToCart(product, size);
                                                                setShowSizes(false);
                                                            }}
                                                            className={cn(
                                                                "w-full py-4 text-[11px] uppercase tracking-widest border border-neutral-200 transition-all hover:bg-black hover:text-white hover:border-black",
                                                                selectedSize === size && "bg-black text-white border-black"
                                                            )}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Button
                                        onClick={() => setShowSizes(!showSizes)}
                                        className="w-full py-6 bg-transparent hover:bg-black hover:text-white text-black border border-black rounded-none uppercase text-xs tracking-widest transition-colors duration-300 flex justify-center items-center gap-2"
                                    >
                                        Add {showSizes && <ChevronDown size={14} className="animate-bounce" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6 text-[11px] leading-relaxed font-light text-neutral-800">
                                <p className='text-[14px] uppercase tracking-wider'>QISSEY {product.category} COLLECTION</p>
                                <p className='text-[13px]'>{product.description}</p>
                            </div>

                            <div className="border-t border-neutral-100 pt-6 space-y-4">
                                <button
                                    onClick={() => setActiveDrawer('measurement')}
                                    className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.15em] font-medium opacity-70 hover:opacity-100 transition-opacity"
                                >
                                    Product measurements
                                    <ArrowRight size={14} />
                                </button>
                                <button
                                    onClick={() => setActiveDrawer('composition')}
                                    className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.15em] font-medium opacity-70 hover:opacity-100 transition-opacity"
                                >
                                    Composition & Care
                                    <ArrowRight size={14} />
                                </button>
                                <button
                                    onClick={() => setActiveDrawer('shipping')}
                                    className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.15em] font-medium opacity-70 hover:opacity-100 transition-opacity"
                                >
                                    Shipping & Returns
                                    <ArrowRight size={14} />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <section className="mt-24 border-t border-neutral-100 pt-20">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block text-black mb-12">
                        Related Products
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>

                <SideDrawer
                    isOpen={!!activeDrawer}
                    onClose={() => setActiveDrawer(null)}
                    title={activeDrawer ? drawerContent[activeDrawer].title : ""}
                >
                    {activeDrawer && drawerContent[activeDrawer].content}
                </SideDrawer>

            </div>
        </div>
    );
}
