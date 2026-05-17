import { toast } from 'sonner';
import { fetchApi } from '../../../lib/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const productCache = {
    products: { data: null, timestamp: null },
    newArrivals: { data: null, timestamp: null },
    collections: { data: null, timestamp: null },
    collectionProducts: {}
};

export const clearProductCache = () => {
    productCache.products.data = null;
    productCache.newArrivals.data = null;
    productCache.collectionProducts = {};
};

export const fetchProducts = async () => {
    if (
        productCache.products.data &&
        (Date.now() - productCache.products.timestamp < CACHE_DURATION)
    ) {
        return productCache.products.data;
    }

    try {
        const data = await fetchApi('/api/products');

        productCache.products = {
            data,
            timestamp: Date.now(),

        };

        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchNewArrivalProducts = async (limit = null) => {
    if (
        productCache.newArrivals.data &&
        (Date.now() - productCache.newArrivals.timestamp < CACHE_DURATION)
    ) {
        return limit ? productCache.newArrivals.data.slice(0, limit) : productCache.newArrivals.data;
    }

    try {
        const url = limit ? `/api/products/new-arrivals?limit=${limit}` : '/api/products/new-arrivals';
        const data = await fetchApi(url);

        if (!limit) {
            productCache.newArrivals = {
                data,
                timestamp: Date.now(),
            };
        }

        return data;
    } catch (error) {
        console.error('Error fetching new arrival products:', error);
        throw error;
    }
};

export const fetchProductById = async (id) => {
    try {
        return await fetchApi(`/api/products/${id}`);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return null;
    }
};

export const fetchProductBySlug = async (slug, userId) => {
    try {
        return await fetchApi(`/api/products/slug/${slug}`);
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        return null;
    }
};

export const fetchRelatedProducts = async (collectionId, productId, userId) => {
    try {
        return await fetchApi(`/api/products/related?collectionId=${collectionId}&productId=${productId}`);
    } catch (error) {
        console.error('Error fetching related products:', error);
        return [];
    }
};

export const fetchCompleteTheLookProducts = async (productIds, userId) => {
    try {
        if (!productIds || productIds.length === 0) {
            return [];
        }
        return await fetchApi('/api/products/complete-the-look', {
            method: 'POST',
            body: JSON.stringify({ productIds })
        });
    } catch (error) {
        console.error('Error fetching complete the look products:', error);
        return [];
    }
};

export const fetchCollectionById = async (id) => {
    try {
        return await fetchApi(`/api/products/collections/${id}`);
    } catch (error) {
        console.error('Error fetching collection by ID:', error);
        return null;
    }
};

export const fetchProductsByCollectionId = async (collectionId, userId) => {
    try {
        return await fetchApi(`/api/products/collections/${collectionId}/products`);
    } catch (error) {
        console.error('Error fetching products by collection:', error);
        return [];
    }
};

export const fetchAllCollections = async () => {
    if (
        productCache.collections.data &&
        (Date.now() - productCache.collections.timestamp < CACHE_DURATION)
    ) {
        return productCache.collections.data;
    }

    try {
        const data = await fetchApi('/api/products/collections');

        productCache.collections = {
            data: data || [],
            timestamp: Date.now()
        };

        return data || [];
    } catch (error) {
        console.error('Error fetching all collections:', error);
        return [];
    }
};

export const fetchSavedProducts = async (userId) => {
    try {
        return await fetchApi('/api/products/saved/list');
    } catch (error) {
        console.error('Error fetching saved products:', error);
        return [];
    }
};

export const saveProduct = async (userId, productId) => {
    try {
        await fetchApi('/api/products/saved', {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
        toast.success('Product saved successfully');
        clearProductCache();
        return true;
    } catch (error) {
        console.error('Error saving product:', error);
        return false;
    }
};

export const unsaveProduct = async (userId, productId) => {
    try {
        await fetchApi(`/api/products/saved/${productId}`, {
            method: 'DELETE'
        });
        toast.success('Product removed from saved');
        clearProductCache();
        return true;
    } catch (error) {
        console.error('Error unsaving product:', error);
        return false;
    }
};
