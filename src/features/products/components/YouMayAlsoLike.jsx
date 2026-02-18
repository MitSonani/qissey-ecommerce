import React, { useEffect, useState } from 'react';
import { fetchProductsByCollectionId } from '../services/productService';
import ProductCard from './ProductCard';

const YouMayAlsoLike = ({ cartItems }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadRecommendations = async () => {
            if (!cartItems || cartItems.length === 0) {
                setRecommendations([]);
                setIsLoading(false);
                return;
            }

            const collectionIds = [...new Set(cartItems.map(item => item.collection_id).filter(Boolean))];

            if (collectionIds.length === 0) {
                setIsLoading(false);
                return;
            }

            try {
                const promises = collectionIds.map(id => fetchProductsByCollectionId(id));
                const results = await Promise.all(promises);

                const cartItemIds = new Set(cartItems.map(item => item.id));
                const allProducts = results.flat();

                const uniqueProducts = [];
                const seenIds = new Set();

                for (const product of allProducts) {
                    if (!seenIds.has(product.id) && !cartItemIds.has(product.id)) {
                        seenIds.add(product.id);
                        uniqueProducts.push(product);
                    }
                }

                setRecommendations(uniqueProducts.slice(0, 8));
            } catch (error) {
                console.error("Failed to load recommendations", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadRecommendations();
    }, [cartItems]);



    if (!isLoading && recommendations.length === 0) return null;

    return (
        <div className="px-0 md:mx-[150px] mt-24 mb-12">
            <p className="text-sm font-bold uppercase tracking-widest mb-8 md:mb-12 text-left">You May Also Like</p>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-30">
                {[...recommendations].map(product => (
                    <ProductCard key={product.id} product={product} isCartProduct={true} />
                ))}
            </div>
        </div>
    );
};

export default YouMayAlsoLike;
