import { supabaseAdmin } from '../config/supabase.js';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000;
export const productCache = {
    products: { data: null, timestamp: null, userId: null },
    newArrivals: { data: null, timestamp: null, userId: null },
    collections: { data: null, timestamp: null },
    collectionProducts: {}
};

export const clearProductCache = () => {
    productCache.products.data = null;
    productCache.newArrivals.data = null;
    productCache.collectionProducts = {};
};

export const getProducts = async (req, res) => {
    try {
        const userId = req.user?.id; // from optional auth middleware

        if (
            productCache.products.data &&
            (Date.now() - productCache.products.timestamp < CACHE_DURATION)
        ) {
            return res.json(productCache.products.data);
        }

        let query = supabaseAdmin
            .from('products')
            .select(`id,
                    name,
                    slug,
                    price,
                    product_variants(
                       id,
                       image_urls
                    )
                    ${userId ? ', saved_products:saved_products!left(id)' : ''}
                    `)
            .eq('product_variants.is_primary', true);

        if (userId) {
            query = query.eq('saved_products.user_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        const result = data?.map(product => ({
            ...product,
            is_saved: product.saved_products?.length > 0
        })) || [];

        productCache.products = {
            data: result,
            timestamp: Date.now(),
            userId
        };

        res.json(result);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getNewArrivals = async (req, res) => {
    try {
        const userId = req.user?.id;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        if (
            productCache.newArrivals.data &&
            productCache.newArrivals.userId === userId &&
            (Date.now() - productCache.newArrivals.timestamp < CACHE_DURATION)
        ) {
            return res.json(limit ? productCache.newArrivals.data.slice(0, limit) : productCache.newArrivals.data);
        }

        let query = supabaseAdmin
            .from('products')
            .select(`
                id,
                name,
                slug,
                price,
                product_variants(
                    *,
                    id,
                    image_urls,
                    is_primary,
                    size,
                    color_id (
                        id,
                        name,
                        hex
                    )
                )
                ${userId ? ', saved_products:saved_products!left(id)' : ''}
            `)
            .eq('product_variants.is_primary', true)
            .eq('new_arrival', true);

        if (userId) {
            query = query.eq('saved_products.user_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        const result = data?.map(product => ({
            ...product,
            is_saved: product.saved_products?.length > 0
        })) || [];

        // Always cache the full results
        productCache.newArrivals = {
            data: result,
            timestamp: Date.now(),
            userId
        };

        res.json(limit ? result.slice(0, limit) : result);
    } catch (error) {
        console.error('Error fetching new arrival products:', error);
        res.status(500).json({ error: 'Failed to fetch new arrival products' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        let query = supabaseAdmin
            .from('products')
            .select(`*, 
                    product_variants(*, color_id(*)), 
                    complete_the_look,
                    product_collections(collection_id)
                    ${userId ? ', saved_products:saved_products!left(id)' : ''}
                    `)
            .eq('id', id);

        if (userId) {
            query = query.eq('saved_products.user_id', userId);
        }

        const { data, error } = await query.single();

        if (error) throw error;

        res.json({
            ...data,
            is_saved: data.saved_products?.length > 0
        });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.user?.id;

        let query = supabaseAdmin
            .from('products')
            .select(`*, 
                    product_variants(*, color_id(*)), 
                    complete_the_look,
                    product_collections(collection_id),
                    product_measurements(size_chart)
                    ${userId ? ', saved_products:saved_products!left(id)' : ''}
                    `)
            .eq('slug', slug);

        if (userId) {
            query = query.eq('saved_products.user_id', userId);
        }

        const { data, error } = await query.single();

        if (error) throw error;

        res.json({
            ...data,
            is_saved: data.saved_products?.length > 0
        });
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const getRelatedProducts = async (req, res) => {
    try {
        const { collectionId, productId } = req.query;
        const userId = req.user?.id;

        let query = supabaseAdmin
            .from('products')
            .select(`
                id,
                name,
                slug,
                price,
                product_variants(
                    id,
                    image_urls
                ),
                product_collections!inner(collection_id)
                ${userId ? ', saved_products:saved_products!left(id)' : ''}
            `)
            .eq('product_collections.collection_id', collectionId)
            .neq('id', productId)
            .limit(8);

        if (userId) {
            query = query.eq('saved_products.user_id', userId);
        }

        const { data, error } = await query;

        if (error) throw error;

        const result = data?.map(product => ({
            ...product,
            is_saved: product.saved_products?.length > 0
        })) || [];

        res.json(result);
    } catch (error) {
        console.error('Error fetching related products:', error);
        res.status(500).json({ error: 'Failed to fetch related products' });
    }
};

export const getCompleteTheLook = async (req, res) => {
    try {
        const { productIds } = req.body;
        const userId = req.user?.id;

        if (!productIds || productIds.length === 0) {
            return res.json([]);
        }

        let query = supabaseAdmin
            .from('products')
            .select(`
                id,
                name,
                slug,
                price,
                product_variants(
                    id,
                    image_urls,
                    is_primary
                )
                ${userId ? ', saved_products:saved_products!left(id)' : ''}
            `)
            .in('id', productIds);

        if (userId) {
            query = query.eq('saved_products.user_id', userId);
        }

        const { data, error } = await query;

        if (error) throw error;

        const result = data?.map(product => ({
            ...product,
            is_saved: product.saved_products?.length > 0
        })) || [];

        res.json(result);
    } catch (error) {
        console.error('Error fetching complete the look products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getCollectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabaseAdmin
            .from('collections')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.status(500).json({ error: 'Failed to fetch collection' });
    }
};

export const getProductsByCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const userId = req.user?.id;

        let query = supabaseAdmin
            .from('products')
            .select(`
                id,
                name,
                slug,
                price,
                product_variants(
                    *,
                    id,
                    image_urls,
                    is_primary,
                    size,
                    color_id (
                        id,
                        name,
                        hex
                    )
                ),
                product_collections!inner(collection_id)
                ${userId ? ', saved_products:saved_products!left(id)' : ''}
            `)
            .eq('product_collections.collection_id', collectionId);

        if (userId) {
            query = query.eq('saved_products.user_id', userId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        const result = data?.map(product => ({
            ...product,
            is_saved: product.saved_products?.length > 0
        })) || [];

        res.json(result);
    } catch (error) {
        console.error('Error fetching products by collection:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getAllCollections = async (req, res) => {
    try {
        if (
            productCache.collections.data &&
            (Date.now() - productCache.collections.timestamp < CACHE_DURATION)
        ) {
            return res.json(productCache.collections.data);
        }

        const { data, error } = await supabaseAdmin
            .from('collections')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        productCache.collections = {
            data: data || [],
            timestamp: Date.now()
        };

        res.json(data || []);
    } catch (error) {
        console.error('Error fetching all collections:', error);
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
};

export const getSavedProducts = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabaseAdmin
            .from('saved_products')
            .select(`
                product_id,
                products (
                    id,
                    name,
                    slug,
                    price,
                    product_variants (
                        id,
                        image_urls,
                        is_primary
                    )
                )
            `)
            .eq('user_id', userId);

        if (error) throw error;

        const result = data?.map(item => item.products) || [];
        res.json(result);
    } catch (error) {
        console.error('Error fetching saved products:', error);
        res.status(500).json({ error: 'Failed to fetch saved products' });
    }
};

export const saveProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const { error } = await supabaseAdmin
            .from('saved_products')
            .insert({ user_id: userId, product_id: productId });

        if (error) throw error;

        clearProductCache();
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ error: 'Failed to save product' });
    }
};

export const unsaveProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const { error } = await supabaseAdmin
            .from('saved_products')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;

        clearProductCache();
        res.json({ success: true });
    } catch (error) {
        console.error('Error unsaving product:', error);
        res.status(500).json({ error: 'Failed to unsave product' });
    }
};
