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
                <h2 className="text-[16px] md:text-[20px] font-bold uppercase tracking-[0.1em] opacity-90 hover:opacity-100 transition-opacity whitespace-nowrap text-black mb-8 md:mb-12">
                    Related Products
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
                    {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>
        ) : <></>
    )
}

export default RelatedProduct