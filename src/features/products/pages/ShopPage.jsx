import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, LayoutGrid, Square } from 'lucide-react';
import { cn } from '../../../components/ui/Primitives';

export default function Shop() {
    const { products, setCategory, setSort, category, sort } = useProducts();
    const [viewCols, setViewCols] = useState(4);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const categories = ["All", "T-Shirts", "Pants", "Sweatshirts", "Outerwear"];
    const sortOptions = [
        { label: "Newest", value: "newest" },
        { label: "Price Low to High", value: "price-low" },
        { label: "Price High to Low", value: "price-high" }
    ];

    return (
        <div className="pt-32 pb-20 px-6 md:px-12">
            <div className="container">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Shop</h1>
                        <p className="text-xs text-black/40 uppercase font-bold tracking-widest">
                            Showing {products.length} Products
                        </p>
                    </div>

                    <div className="flex items-center gap-8 border-t md:border-t-0 pt-8 md:pt-0 border-black/5">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest"
                        >
                            <Filter size={16} /> {isFilterOpen ? 'Close Filters' : 'Filters'}
                        </button>
                        <div className="hidden md:flex items-center gap-4">
                            <button onClick={() => setViewCols(2)} className={cn("text-black/20", viewCols === 2 && "text-black")}><Square size={20} /></button>
                            <button onClick={() => setViewCols(4)} className={cn("text-black/20", viewCols === 4 && "text-black")}><LayoutGrid size={20} /></button>
                        </div>
                    </div>
                </div>

                {/* Filters Drawer/Section */}
                <div className={cn(
                    "grid transition-all duration-500 overflow-hidden",
                    isFilterOpen ? "grid-rows-[1fr] mb-12" : "grid-rows-[0fr] opacity-0"
                )}>
                    <div className="min-h-0 container">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 border-y border-black/5">
                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] mb-8 text-black/40">Category</h3>
                                <div className="flex flex-wrap gap-3">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={cn(
                                                "px-4 py-2 text-[10px] uppercase font-bold tracking-widest border transition-colors",
                                                category === cat ? "bg-brand-charcoal text-white border-brand-charcoal" : "border-black/10 hover:border-black"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] mb-8 text-black/40">Sort By</h3>
                                <div className="space-y-4">
                                    {sortOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSort(option.value)}
                                            className={cn(
                                                "block text-sm uppercase font-black transition-opacity",
                                                sort === option.value ? "opacity-100" : "opacity-20 hover:opacity-50"
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className={cn(
                    "grid gap-x-6 gap-y-12 transition-all duration-500",
                    viewCols === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
                )}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
