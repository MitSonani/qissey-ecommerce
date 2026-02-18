import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth';
import { fetchSavedProducts } from '../features/products/services/productService';
import ProductCard from '../features/products/components/ProductCard';
import { Button } from '../components/ui/Primitives';
import ShoppingBagSkeleton from '../features/cart/components/ShoppingBagSkeleton';

export default function SavedProducts() {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [savedProducts, setSavedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        async function loadSavedProducts() {
            if (user) {
                try {
                    const products = await fetchSavedProducts(user.id);
                    // Add is_saved: true to each product since they are from saved list
                    const productsWithStatus = products.map(p => ({ ...p, is_saved: true }));
                    setSavedProducts(productsWithStatus);
                } catch (error) {
                    console.error("Failed to fetch saved products", error);
                } finally {
                    setLoading(false);
                }
            }
        }

        if (user) {
            loadSavedProducts();
        }
    }, [user]);

    if (authLoading || loading) {
        return <ShoppingBagSkeleton />; // Reusing skeleton for now
    }

    if (!user) return null;

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-32 px-6 md:px-12 bg-white">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex flex-col mb-12">
                    <p className="text-2xl font-bold uppercase tracking-widest mb-2">Saved Products</p>
                    <p className="text-xs uppercase tracking-widest text-black/60">{savedProducts.length} ITEMS</p>
                </div>

                {savedProducts.length === 0 ? (
                    <div className="py-24 border-t border-black/5 flex flex-col items-center justify-center text-center">
                        <p className="text-sm font-bold uppercase tracking-widest text-black/40 mb-8">You haven't saved any items yet</p>
                        <Button asChild variant="outline" className="rounded-none border-black hover:bg-black hover:text-white transition-colors duration-300">
                            <Link to="/">Explore Collection</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-12">
                        {savedProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onToggleSave={(isSaved) => {
                                    if (!isSaved) {
                                        setSavedProducts(prev => prev.filter(p => p.id !== product.id));
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
