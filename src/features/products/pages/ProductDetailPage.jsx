import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchProductById } from '../services/productService';
import { Button, cn } from '../../../components/ui/Primitives';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SideDrawer from '../../../components/ui/SideDrawer';
import RealatedProduct from '../components/RealatedProduct';
import CompleteYourLook from '../components/CompleteYourLook';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [primaryProduct, setPrimaryProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showSizes, setShowSizes] = useState(false);
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [colors, setColors] = useState([])
    const sizeSelectorRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sizeSelectorRef.current && !sizeSelectorRef.current.contains(event.target)) {
                setShowSizes(false);
            }
        };

        if (showSizes) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSizes]);

    useEffect(() => {
        window.scroll(0, 0)
    }, [])


    const findPrimaryProduct = (colorId) => {

        const productData = product?.product_variants?.find((variant) => variant.color_id?.id === colorId)
        setPrimaryProduct(productData)
    }
    useEffect(() => {
        const loadProductData = async () => {
            try {
                setLoading(true);
                setError(null);

                const productData = await fetchProductById(id);

                const primaryProductImages = productData?.product_variants?.find((variant) => variant.is_primary)

                const data = productData?.product_variants?.map((variant) => {
                    return variant?.color_id
                })

                const uniqueColors = Array.from(
                    new Map(data.map(item => [item.name, item])).values()
                );

                setColors([...uniqueColors])

                setPrimaryProduct(primaryProductImages)

                if (!productData) {
                    setError('Product not found');
                    setLoading(false);
                    return;
                }

                setProduct(productData)

                setLoading(false);
            } catch (err) {
                console.error('Error loading product:', err);
                setError('Failed to load product. Please try again.');
                setLoading(false);
            }
        };

        loadProductData();
    }, [id]);


    const currentProductSizes = product?.product_variants?.filter((variant) => variant?.color_id?.hex === primaryProduct?.color_id?.hex)

    if (loading) {
        return <ProductDetailSkeleton />;
    }

    if (error || !product) {
        return (
            <div className="pt-40 container text-center">
                <p className="text-sm uppercase tracking-widest text-neutral-600">{error || 'Product not found'}</p>
            </div>
        );
    }

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

                <div className="space-y-12">
                    {/* Section 1: 1st Image + Product Summary & Description */}
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="w-full lg:w-1/2">
                            {primaryProduct?.image_urls?.[0] && (
                                <div className="bg-neutral-100 overflow-hidden">
                                    <img
                                        src={primaryProduct.image_urls[0]}
                                        alt={`${product.name} - view 1`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="w-full lg:w-1/2 flex flex-col ">
                            <div className="max-w-[500px] ">
                                <div>
                                    <p className="text-[18px] uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black mb-1">
                                        {product?.name}
                                    </p>
                                    <p className="text-[15px] font-bold tracking-wide opacity-60 hover:opacity-100 mb-1">
                                        ₹ {product?.price.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] font-medium uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black pb-6">
                                        MRP incl. of all taxes
                                    </p>
                                </div>

                                <div className="border-t border-neutral-200 pt-6">
                                    <p className="pb-3 text-[12px] uppercase tracking-wider text-black font-medium">{primaryProduct?.color_id?.name}</p>
                                    <div className="flex gap-2 mb-[20px]">
                                        {colors?.map((item) => (
                                            <div
                                                key={item?.id}
                                                className={cn('w-6 h-6 flex justify-center items-center cursor-pointer', { 'border border-black': item?.id === primaryProduct?.color_id?.id })}
                                                onClick={() => findPrimaryProduct(item?.id)}
                                            >
                                                <div
                                                    className="w-4 h-4 shadow-sm"
                                                    style={{ backgroundColor: item?.hex }}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative min-h-[56px]" ref={sizeSelectorRef}>
                                            <AnimatePresence mode="wait">
                                                {showSizes ? (
                                                    <motion.div
                                                        key="size-list"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="w-full border bg-white z-50 overflow-hidden"
                                                    >
                                                        <div className="flex flex-col max-h-[240px] overflow-y-auto">
                                                            {currentProductSizes?.map(size => (
                                                                <button
                                                                    key={size.size}
                                                                    onClick={() => {
                                                                        setSelectedSize(size.size);
                                                                        setShowSizes(false);
                                                                    }}
                                                                    className="group flex justify-between items-center px-4 py-4 hover:bg-neutral-50 border-b border-neutral-50 last:border-0 transition-colors"
                                                                >
                                                                    <span className="text-[11px] uppercase tracking-widest text-black font-light group-hover:font-medium">
                                                                        {size.size}
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="add-button"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                    >
                                                        <Button
                                                            onClick={() => {
                                                                if (!selectedSize) {
                                                                    setShowSizes(true);
                                                                } else {
                                                                    console.log("Adding to cart:", product.name, selectedSize);
                                                                }
                                                            }}
                                                            className={cn(
                                                                "w-full py-3 rounded-none uppercase text-[11px] tracking-[0.2em] transition-all duration-300 flex justify-center items-center gap-2",
                                                                "bg-white text-black border border-black hover:bg-neutral-50"
                                                            )}
                                                        >
                                                            Add
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <p className="text-[13px] opacity-60 font-medium leading-relaxed whitespace-pre-line">
                                        {product.description}
                                    </p>
                                </div>

                                <CompleteYourLook completeTheLookIds={product?.complete_the_look} />

                                <div className="border-t border-neutral-100 mt-10 pt-6 space-y-4 max-w-[600px] mx-auto">
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

                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="w-full lg:w-1/2">
                            <div className="max-w-[500px] lg:ml-auto px-4 lg:px-0">
                                {
                                    product?.fabrics?.map((fabric, index) => (
                                        <p key={index} className="text-[13px] opacity-60 font-medium leading-relaxed">
                                            {fabric}
                                        </p>
                                    ))
                                }

                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            {primaryProduct?.image_urls?.[1] && (
                                <div className="bg-neutral-100 overflow-hidden">
                                    <img
                                        src={primaryProduct.image_urls[1]}
                                        alt={`${product.name} - view 2`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {primaryProduct?.image_urls?.length > 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {primaryProduct.image_urls.slice(2).map((img, idx) => (
                                <div key={idx} className="bg-neutral-100 overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`${product.name} - view ${idx + 3}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    )}


                </div>

                <RealatedProduct collectionId={product?.collection_id} productId={product?.id} />


                <SideDrawer
                    isOpen={!!activeDrawer}
                    onClose={() => setActiveDrawer(null)}
                    title={activeDrawer ? drawerContent[activeDrawer].title : ""}
                >
                    {activeDrawer && drawerContent[activeDrawer].content}
                </SideDrawer>

            </div>
        </div >
    );
}
