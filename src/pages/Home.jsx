import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../features/products';
import Hero from '../components/Hero';
import { fetchNewArrivalProducts, fetchAllCollections } from '../features/products/services/productService';
export default function Home() {
    const [productsS, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsRes, collectionsRes] = await Promise.all([
                    fetchNewArrivalProducts(),
                    fetchAllCollections()
                ]);
                setProducts(productsRes);
                setCollections(collectionsRes);
            } catch (error) {
                console.error('Error loading home data:', error);
            }
        };

        loadData();
    }, []);


    return (
        <div className="relative overflow-hidden mx-2 md:mx-24 mt-20 mb-16 md:my-34">
            <Hero />

            {/* Featured Collections Tiles */}
            <section className="py-16 md:px-8 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">
                        {[...collections].map((collection) => (
                            <Link
                                to={`/collection/${collection.id}`}
                                className="text-xs uppercase font-bold tracking-widest border-b-2 border-white pb-1 hover:pb-2 transition-all inline-block "
                            >
                                <div key={collection.id} className="relative aspect-[3/4] bg-brand-gray overflow-hidden group">
                                    <img
                                        src={collection.image_url}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        alt={collection.name}
                                    />
                                    <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:bg-black/20" />
                                    <div className="absolute bottom-12 left-0 right-0 text-center text-white">
                                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                                            {collection.name}
                                        </h2>
                                        <p>
                                            view collection
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals Slider */}
            <section className="pb-32 md:px-8 overflow-hidden ">
                <div className="container">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-[0.4em] mb-4 text-black/40">The Latest Drops</p>
                            <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg ">New Arrivals</h2>
                        </div>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 ">
                        {productsS.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
