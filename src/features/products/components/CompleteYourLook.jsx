import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { fetchCompleteTheLookProducts } from '../services/productService';
import { useAuth } from '../../auth';

const CompleteYourLook = ({ completeTheLookIds }) => {
    const [completeTheLookProducts, setCompleteTheLookProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            if (!completeTheLookIds || completeTheLookIds.length === 0) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const products = await fetchCompleteTheLookProducts(completeTheLookIds, user?.id);
            setCompleteTheLookProducts(products);
            setLoading(false);
        };

        fetchProducts();
    }, [completeTheLookIds?.join(','), user?.id]);

    // Don't render if no products
    if (!completeTheLookIds || completeTheLookIds.length === 0 || completeTheLookProducts.length === 0) {
        return null;
    }

    return (
        <section className="mt-2 border-t border-neutral-100 pt-6">
            <p className="pb-4 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-all whitespace-nowrap">
                Match it With
            </p>

            {
                loading ? (
                    <div className="flex justify-center py-12" >
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                        {completeTheLookProducts.map(product => (
                            <ProductCard key={product.id} product={product} isCompleteTheLook={true} />
                        ))}
                    </div>
                )}
        </section >
    );
};

export default CompleteYourLook;
