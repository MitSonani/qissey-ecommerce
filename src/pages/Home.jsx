import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../features/products';
import Hero from '../components/Hero';
import { fetchNewArrivalProducts, fetchAllCollections } from '../features/products/services/productService';
import { useAuth } from '../features/auth';
import { HOME_PAGE_TEXT } from '../constants/content';
import { ArrowRight } from 'lucide-react';

export default function Home() {
    const [productsS, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsRes, collectionsRes] = await Promise.all([
                    fetchNewArrivalProducts(user?.id),
                    fetchAllCollections()
                ]);
                setProducts(productsRes);
                setCollections(collectionsRes);
            } catch (error) {
                console.error('Error loading home data:', error);
            }
        };

        loadData();
    }, [user?.id]);


    return (
        <div className="relative overflow-hidden mx-2 md:mx-24 mt-20 md:my-34">
            <Hero />

            {/* Featured Collections Tiles */}
            <section className="py-16 md:px-8 bg-white">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">
                        {[...collections].map((collection) => (
                            <Link
                                key={collection.id}
                                to={`/ collection / ${collection.id} `}
                                className="text-xs uppercase font-bold tracking-widest border-b-2 border-white pb-1 hover:pb-2 transition-all inline-block "
                            >
                                <div className="relative aspect-[3/4] bg-brand-gray overflow-hidden group">
                                    {collection.image_url ? (
                                        <img
                                            src={collection.image_url}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            alt={collection.name}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-brand-gray" />
                                    )}
                                    <div className="absolute inset-0 bg-black/5 transition-opacity group-hover:bg-black/20" />
                                    <div className="absolute bottom-12 left-0 right-0 text-center text-white">
                                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                                            {collection.name}
                                        </h2>
                                        <p>
                                            {HOME_PAGE_TEXT.VIEW_COLLECTION}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals Slider */}
            <section className="md:px-8 overflow-hidden ">
                <div className="container">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[12px] font-bold uppercase tracking-[0.2em]">{HOME_PAGE_TEXT.LATEST_DROPS}</h2>
                        <Link to="/shop" className="text-[10px] items-center gap-1 uppercase font-bold tracking-[0.1em] opacity-40 hover:opacity-100 transition-opacity flex group">
                            {HOME_PAGE_TEXT.VIEW_COLLECTION}
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
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
