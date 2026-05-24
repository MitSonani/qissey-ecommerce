import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../features/products';
import Hero from '../components/Hero';
import { fetchNewArrivalProducts, fetchAllCollections, productCache } from '../features/products/services/productService';
import SEO from '../components/ui/SEO';

const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://qissey.com/#organization',
    'name': 'QISSEY',
    'alternateName': 'QISSEY Creative Studio',
    'url': 'https://qissey.com',
    'logo': 'https://qissey.com/logo.PNG',
    'description': 'Refined minimalist fashion studio based in India, specializing in sustainable luxury clothing for women.',
    'foundingDate': '2024',
    'sameAs': [
        'https://www.instagram.com/qissey._/',
        'https://www.facebook.com/people/Qissey/61586697613049/'
    ]
};

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://qissey.com/#website',
    'name': 'QISSEY',
    'url': 'https://qissey.com',
    'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://qissey.com/shop?q={search_term_string}',
        'query-input': 'required name=search_term_string'
    }
};

export default function Home() {

    const [productsS, setProducts] = useState(() => {
        if (productCache.newArrivals.data) {
            return productCache.newArrivals.data;
        }
        return [];
    });

    const [collections, setCollections] = useState(() => {
        if (productCache.collections.data) {
            return productCache.collections.data.filter(c => c.name.toLowerCase() !== 'new arrival');
        }
        return [];
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [productsRes, collectionsRes] = await Promise.all([
                    fetchNewArrivalProducts(6),
                    fetchAllCollections()
                ]);
                setProducts(productsRes);
                const filterCollection = collectionsRes.filter(c => c.name.toLowerCase() !== 'new arrival');
                setCollections(filterCollection);
            } catch (error) {
                console.error('Error loading home data:', error);
            }
        };

        loadData();
    }, []);


    return (
        <div className="relative overflow-hidden mx-2 md:mx-24 mt-20 md:my-34">
            <SEO 
                title="Refined Minimalist Fashion | Sustainable Luxury Clothing"
                description="Discover QISSEY — a refined minimalist fashion studio in India. Sustainable luxury clothing for women. Shop elegant tops, dresses, and formal wear crafted with care."
                schema={[homeSchema, websiteSchema]}
            />
            <h1 className="sr-only">Refined Minimalist Fashion for the Modern Woman — QISSEY</h1>
            <Hero />

            {/* New Arrivals Slider */}
            {!!productsS?.length && <section className="md:px-8 overflow-hidden mt-20">
                <div className="container">
                    <div className="mb-12">
                        <p className="text-[10px] uppercase font-bold tracking-[0.4em] mb-4 text-black/40">The Latest Drops</p>
                        <div className="flex justify-between  gap-4">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-lg">New Arrivals</h2>
                            <div className='flex justify-center items-center'>  <Link
                                to="/new-arrivals"
                                className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:pb-2 transition-all whitespace-nowrap"
                            >
                                View All
                            </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 ">
                        {productsS.slice(0, 6).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>}

            {/* Featured Collections Tiles */}
            <section className="py-16 md:px-8 bg-white mt-8 md:mt-16">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2">
                        {[...collections].map((collection) => (
                            <Link
                                key={collection.id}
                                to={`/collection/${collection.id}`}
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
                                            view collection
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
