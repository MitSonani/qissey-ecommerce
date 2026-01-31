import { useState, useMemo } from 'react';
import { products } from '../services/productService';

export function useProducts() {
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('newest');
    const [search, setSearch] = useState('');

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (category !== 'All') {
            result = result.filter(p => p.category === category);
        }

        if (search) {
            result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        }

        if (sort === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [category, sort, search]);

    return {
        products: filteredProducts,
        setCategory,
        setSort,
        setSearch,
        category,
        sort
    };
}
