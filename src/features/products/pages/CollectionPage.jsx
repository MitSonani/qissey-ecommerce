import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchCollectionById, fetchProductsByCollectionId } from '../services/productService';
import ProductCard from '../components/ProductCard';
import PageLoader from '../../../components/ui/PageLoader';

export default function CollectionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [collectionData, productsData] = await Promise.all([
                    fetchCollectionById(id),
                    fetchProductsByCollectionId(id)
                ]);



                setCollection(collectionData);
                setProducts([...productsData, ...productsData, ...productsData]);
            } catch (error) {
                console.error('Error loading collection page:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, navigate]);

    if (loading) {
        return <PageLoader />;
    }

    if (!collection) {
        return null; // or a 404 component
    }

    const renderProductGroups = () => {
        const groups = [];
        for (let i = 0; i < products.length; i += 5) {
            groups.push({
                hero: products[i],
                grid: products.slice(i + 1, i + 5)
            });
        }

        return groups.map((group, idx) => (
            <div key={idx} className="mb-20">
                {group.hero && (
                    <div className="mb-20">
                        <ProductCardHero product={group.hero} />
                    </div>
                )}
                {group.grid.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-12">
                        {group.grid.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="pt-20 md:pt-32 pb-20 px-8 md:px-12 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
                <aside className="lg:w-48 lg:shrink-0 lg:sticky lg:top-36 lg:h-fit">
                    <div className="flex flex-col gap-8">
                        <div>
                            <p className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">
                                {collection.name}
                            </p>

                        </div>

                        <div className="hidden lg:flex flex-col gap-2">
                            <p className="text-[9px] text-black uppercase font-black tracking-[0.3em] mb-4">
                                01 | VIEW ALL
                            </p>
                            <p className="text-[9px] text-black/30 uppercase font-black tracking-[0.3em] hover:text-black transition-colors cursor-pointer">
                                02 | NEW IN
                            </p>
                            <p className="text-[9px] text-black/30 uppercase font-black tracking-[0.3em] hover:text-black transition-colors cursor-pointer">
                                03 | FEATURED
                            </p>
                        </div>

                        <div className="hidden lg:block pt-8 border-t border-black/5">
                            <p className="text-[10px] text-black/30 uppercase font-bold tracking-[0.2em]">
                                {products.length} Products
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <div className="flex-grow">
                    {products.length > 0 ? (
                        renderProductGroups()
                    ) : (
                        <div className="py-20 text-center border-y border-black/5">
                            <p className="text-xs uppercase font-bold tracking-widest text-black/40">
                                No products found in this collection
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProductCardHero({ product }) {
    return (
        <div className="relative group">
            <Link to={`/product/${product.id}`}>
                <div className="aspect-[4/5] md:aspect-[16/10] overflow-hidden bg-brand-gray">
                    <img
                        src={product?.product_variants[0]?.image_urls[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[2s] scale-100 group-hover:scale-105"
                    />
                </div>
                <div className="mt-8 flex flex-col items-start text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2">{product.name}</p>
                    <p className="text-[10px] font-medium uppercase tracking-widest opacity-40">
                        ₹ {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </Link>
        </div>
    );
}
