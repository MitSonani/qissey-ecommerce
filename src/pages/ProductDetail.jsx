import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { Button, Badge, cn } from '../components/ui/Primitives';
import { ChevronRight, Plus, Minus, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const product = products.find(p => p.id === parseInt(id));
    const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
    const [activeImage, setActiveImage] = useState(0);

    if (!product) return <div className="pt-40 container text-center">Product not found</div>;

    const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

    return (
        <div className="pt-20">
            <div className="container px-6 md:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] bg-brand-gray overflow-hidden">
                            <img
                                src={product.images[activeImage]}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={cn(
                                        "aspect-square bg-brand-gray overflow-hidden border-2 transition-all",
                                        activeImage === idx ? "border-brand-charcoal" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <img src={img} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col py-6">
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <Badge className="bg-brand-gray text-brand-charcoal">Free Shipping</Badge>
                                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-black/40">{product.category}</p>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">{product.title}</h1>
                            <p className="text-3xl font-display font-medium">${product.price}</p>
                        </div>

                        <div className="mb-12">
                            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] mb-6">Select Size</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={cn(
                                            "w-12 h-12 flex items-center justify-center text-xs font-bold transition-all border",
                                            selectedSize === size
                                                ? "bg-brand-charcoal text-white border-brand-charcoal"
                                                : "bg-transparent border-black/10 hover:border-black"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 mb-16">
                            <Button
                                onClick={() => addToCart(product, selectedSize)}
                                className="flex-grow py-6 text-base"
                            >
                                Add to Bag
                            </Button>
                        </div>

                        <div className="space-y-8 border-t border-black/5 pt-12 text-sm text-black/70">
                            <p className="leading-relaxed">{product.description}</p>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest">
                                    <Truck size={16} /> Worldwide Shipping Available
                                </div>
                                <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest">
                                    <RefreshCw size={16} /> 14-Day Boutique Return
                                </div>
                                <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest">
                                    <ShieldCheck size={16} /> 100% Authentic Quality
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <section className="mt-40">
                    <div className="flex justify-between items-end mb-16">
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Wear it With</h2>
                        <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-black/40">Curated Style</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
