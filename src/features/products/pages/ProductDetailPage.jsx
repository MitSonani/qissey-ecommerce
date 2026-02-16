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
import CustomSizeModal from '../components/CustomSizeModal';


const measurementData = [
    { size: "XS", bust: "32″/81 cm", waist: "24″/61 cm", hips: "34″/86 cm", shoulder: "13.5″/34 cm" },
    { size: "S", bust: "34″/86 cm", waist: "26″/66 cm", hips: "36″/91 cm", shoulder: "14″/36 cm" },
    { size: "M", bust: "36″/91 cm", waist: "28″/71 cm", hips: "38″/97 cm", shoulder: "14.5″/37 cm" },
    { size: "L", bust: "38″/97 cm", waist: "30″/76 cm", hips: "40″/102 cm", shoulder: "15″/39 cm" },
    { size: "XL", bust: "40″/102 cm", waist: "32″/81 cm", hips: "42″/107 cm", shoulder: "15.5″/40 cm" },

];

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
    const [showCustomSizeModal, setShowCustomSizeModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const sizeSelectorRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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


    useEffect(() => {
        if (activeDrawer) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [activeDrawer])

    useEffect(() => {
        if (showCustomSizeModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [showCustomSizeModal])


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
                    <p className="text-[11px] font-light uppercase">
                        This guide provides the exact measurements for this product in each size.
                    </p>

                    <table className="w-full text-left text-[11px] uppercase tracking-wider">
                        <thead className="border-b border-neutral-100">
                            <tr>
                                <th className="py-4  font-bold">SIZE</th>
                                <th className="py-4  font-bold">BUST <br />(inch/ cm)</th>
                                <th className="py-4  font-bold">WAIST <br />(inch/ cm)</th>
                                <th className="py-4  font-bold">HIPS <br />(inch/ cm)</th>
                                <th className="py-4  font-bold">SHOULDER <br />(inch/ cm)</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-50 text-neutral-500">
                            {measurementData.map((item) => (
                                <tr key={item.size}>
                                    <td className="py-4 text-black font-bold">{item.size}</td>
                                    <td className="py-4">{item.bust}</td>
                                    <td className="py-4">{item.waist}</td>
                                    <td className="py-4">{item.hips}</td>
                                    <td className="py-4">{item.shoulder}</td>
                                </tr>
                            ))}
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
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Composition</p>
                        <p className="text-[11px] text-neutral-600 uppercase tracking-widest">
                            Premium Fabric Crafted For Lasting Comfort, Durability, And Everyday Elegant Wear
                        </p>
                    </section>
                    <section>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Care</p>
                        <div className="space-y-4 text-[11px] text-neutral-600 uppercase tracking-widest">
                            <p>• Machine wash at max. 30ºC/86ºF</p>
                            <p>• Do not use bleach</p>
                            <p>• Iron at a maximum of 110ºC/230ºF</p>
                            <p>• use mild detergent</p>
                            <p>• tumble dry low or hang to dry</p>
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
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Shipping</p>

                        <p className="text-xs tracking-widest text-neutral-600 leading-relaxed uppercase">
                            Standard delivery within 7-10 business days.<br />

                            <br /> Free for delivery at any location.

                            <br />    <br /> Cash on delivery is available.
                        </p>
                    </section>
                    <section>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-neutral-400">Returns</p>
                        <p className="text-xs tracking-widest text-neutral-600 leading-relaxed uppercase">
                            You can request a return or exchange within 10 days of delivery, as long as the item is unused and in its original condition.
                            <br />
                            <br />
                            <p className='font-bold'>  A few quick notes:</p>

                            <br />

                            • Custom size products are not eligible for return or exchange.
                            <br />
                            <br />
                            • The item should be unused and in its original condition.
                            <br /><br />
                            For more information visit Return & Exchange Policy.                        </p>
                    </section>
                </div>
            )
        }
    };

    return (
        <div className="pt-20 md:pt-30 bg-white pb-24 md:pb-0">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">

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
                                <div className="hidden lg:block">
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

                                <div className="border-t border-neutral-200 pt-6 hidden lg:block">
                                    <p className="pb-3 text-[12px] uppercase tracking-wider text-black font-medium">{primaryProduct?.color_id?.name}</p>
                                    <div className="flex justify-between">
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
                                        <div className="text-[12px] uppercase tracking-wider text-black font-medium cursor-pointer" onClick={() => setShowCustomSizeModal(true)}>CUSTOM SIZE</div>
                                    </div>

                                    <div className="space-y-4 hidden lg:block">
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
                                        className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.15em]  opacity-70 hover:opacity-100 transition-opacity"
                                    >
                                        Product measurements
                                        <ArrowRight size={14} />
                                    </button>
                                    <button
                                        onClick={() => setActiveDrawer('composition')}
                                        className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.15em]  opacity-70 hover:opacity-100 transition-opacity"
                                    >
                                        Composition & Care
                                        <ArrowRight size={14} />
                                    </button>
                                    <button
                                        onClick={() => setActiveDrawer('shipping')}
                                        className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.15em]  opacity-70 hover:opacity-100 transition-opacity"
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

                <CustomSizeModal
                    isOpen={showCustomSizeModal}
                    onClose={() => setShowCustomSizeModal(false)}
                    onSave={(data) => {
                        console.log("Custom Size Data:", data);
                        // Handle saving custom size data here
                    }}
                />


                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-4 lg:hidden z-[90] safe-area-inset-bottom">
                    <AnimatePresence mode="wait">
                        {isScrolled ? (
                            <motion.div
                                key="compact-bar"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex gap-4"
                            >

                                <Button
                                    onClick={() => {
                                        if (!selectedSize) {
                                            setShowSizes(true);
                                            sizeSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        } else {
                                            console.log("Adding to cart:", product.name, selectedSize);
                                        }
                                    }}
                                    className="flex-grow max-w-[320px] bg-white text-black border border-black rounded-none h-11 uppercase text-[11px] tracking-[0.2em] hover:bg-neutral-50"
                                >
                                    {selectedSize ? `ADD (${selectedSize})` : 'ADD'}
                                </Button>
                                <div className="flex flex-col justify-center">
                                    <p className="text-[15px] font-medium tracking-tight whitespace-nowrap">
                                        ₹ {product?.price.toLocaleString()}
                                    </p>

                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="full-bar"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <div className='flex justify-between'>
                                    <div className="mb-2">
                                        <p className="text-[16px] uppercase tracking-[0.1em] text-black-400 truncate">
                                            {product?.name}
                                        </p>
                                        <p className="text-[15px] font-medium tracking-tight whitespace-nowrap">
                                            ₹ {product?.price.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] pt-1 font-medium uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black pb-6">
                                            MRP incl. of all taxes
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-6 mb-4">
                                        <div className="flex gap-2">
                                            {[...colors]?.map((item) => (
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
                                        <div className="text-[11px] uppercase tracking-wider text-black font-medium cursor-pointer" onClick={() => setShowCustomSizeModal(true)}>CUSTOM SIZE</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <Button
                                        onClick={() => {
                                            if (!selectedSize) {
                                                setShowSizes(true);
                                                sizeSelectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            } else {
                                                console.log("Adding to cart:", product.name, selectedSize);
                                            }
                                        }}
                                        className="flex-grow bg-white text-black border border-black rounded-none h-11 uppercase text-[11px] tracking-[0.2em] hover:bg-neutral-50"
                                    >
                                        {selectedSize ? `ADD (${selectedSize})` : 'ADD'}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div >
    );
}
