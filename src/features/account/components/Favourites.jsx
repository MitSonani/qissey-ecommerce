import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSavedProducts } from '../../products/services/productService';

const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
};

export default function Favourites({ user }) {
    const [savedProducts, setSavedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSavedProducts = async () => {
            if (user?.id) {
                setLoading(true);
                const data = await fetchSavedProducts(user.id);
                setSavedProducts(data);
                setLoading(false);
            }
        };

        loadSavedProducts();
    }, [user?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
        );
    }

    if (savedProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
                <Heart className="w-12 h-12 mx-auto stroke-[0.5] text-gray-300 mb-8" />
                <p className="text-[11px] md:text-[12px] tracking-[0.2em] uppercase font-medium text-gray-400">
                    YOUR FAVOURITES LIST IS EMPTY
                </p>
                <Link
                    to="/shop"
                    className="text-[10px] tracking-[0.2em] uppercase font-bold border-b border-black pb-1 hover:text-gray-500 transition-colors"
                >
                    GO TO SHOP
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 pt-20">
            {savedProducts.map((product) => (
                <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group"
                >
                    <div className="space-y-4">
                        <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
                            <img
                                src={product.product_variants?.find(v => v.is_primary)?.image_urls?.[0] || product.product_variants?.[0]?.image_urls?.[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[11px] md:text-[12px] tracking-wide font-light uppercase truncate">
                                {product.name}
                            </h3>
                            <p className="text-[11px] md:text-[13px] font-medium tracking-tight">
                                {formatPrice(product.price)}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
