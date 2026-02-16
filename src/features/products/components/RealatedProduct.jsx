import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { fetchRelatedProducts } from '../services/productService'

const RelatedProduct = ({ collectionId, productId }) => {

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchRelatedProduct = async () => {
            const related = await fetchRelatedProducts(collectionId, productId);
            setRelatedProducts(related);
        }
        fetchRelatedProduct();
    }, [collectionId]);

    return (


        relatedProducts?.length > 0 ? (
            <section className="mt-12 md:mt-24 border-t border-neutral-100 pt-10 md:pt-20">
                <p className="pb-10 text-[14px] sm:text-[15px] uppercase tracking-[0.2em] transition-all whitespace-nowrap">
                    You may intrested in
                </p>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-8 ">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>
        ) : <></>
    )
}

export default RelatedProduct