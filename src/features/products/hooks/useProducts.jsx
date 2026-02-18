import { useState, useEffect, useMemo } from 'react';
import { fetchProducts } from '../services/productService';
import { useAuth } from '../../auth';
import { useSearchParams } from 'react-router-dom';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('newest');

    const urlSearch = searchParams.get('search') || '';
    const [search, setSearch] = useState(urlSearch);

    const { user } = useAuth();

    useEffect(() => {
        setSearch(urlSearch);
    }, [urlSearch]);

    useEffect(() => {
        async function loadProducts() {
            setIsLoading(true);
            try {
                const data = await fetchProducts(user?.id);
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadProducts();
    }, [user?.id]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (category !== 'All') {
            result = result.filter(p => p.category === category);
        }

        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (sort === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, category, sort, search]);

    const handleSetSearch = (newSearch) => {
        setSearch(newSearch);
        if (newSearch) {
            setSearchParams(prev => {
                prev.set('search', newSearch);
                return prev;
            });
        } else {
            setSearchParams(prev => {
                prev.delete('search');
                return prev;
            });
        }
    };

    return {
        products: filteredProducts,
        isLoading,
        setCategory,
        setSort,
        setSearch: handleSetSearch,
        search,
        category,
        sort
    };
}
