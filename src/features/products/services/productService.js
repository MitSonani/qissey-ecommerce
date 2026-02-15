import { supabase } from '../../../lib/supabase';

/**
 * Fetch all products from Supabase
 * @returns {Promise<Array>} Array of product objects
 */
export const fetchProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select(`id,
                    name,
                    price,
                    product_variants(
                       id,
                       image_urls
                    )
                    `)
            .eq('product_variants.is_primary', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

/**
 * Fetch a single product by ID
 * @param {string} id - Product UUID
 * @returns {Promise<Object|null>} Product object or null
 */
export const fetchProductById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*, product_variants(*, color_id(*))')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        return null;
    }
};

/**
 * Fetch products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of product objects
 */
export const fetchProductsByCategory = async (category) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
};

/**
 * Fetch related products based on complete_the_look field
 * @param {string} productId - Current product UUID
 * @param {number} limit - Maximum number of related products to return
 * @returns {Promise<Array>} Array of related product objects
 */
export const fetchRelatedProducts = async (productId, limit = 4) => {
    try {
        // First, get the current product to access complete_the_look
        const { data: currentProduct, error: productError } = await supabase
            .from('products')
            .select('complete_the_look, category')
            .eq('id', productId)
            .single();

        if (productError) throw productError;

        // If complete_the_look has related product IDs, fetch those
        if (currentProduct?.complete_the_look && currentProduct.complete_the_look.length > 0) {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .in('id', currentProduct.complete_the_look)
                .limit(limit);

            if (error) throw error;
            return data || [];
        }

        // Fallback: fetch products from the same category
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', currentProduct.category)
            .neq('id', productId)
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching related products:', error);
        return [];
    }
};

/**
 * Legacy static products array (kept for backward compatibility during migration)
 * @deprecated Use fetchProducts() instead
 */
export const products = [
    {
        id: 1,
        title: "Eco-Cotton Oversized Tee",
        price: 45,
        category: "T-Shirts",
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["S", "M", "L", "XL"],
        description: "A premium heavyweight cotton tee with a relaxed, modern fit. Part of our signature sustainable collection.",
        tags: ["New", "Sustainable"]
    },
    {
        id: 2,
        title: "Washed Utility Cargo",
        price: 85,
        category: "Pants",
        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1584063596249-14545da79be3?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["28", "30", "32", "34"],
        description: "Multi-pocket utility pants in a durable washed canvas. Features adjustable hems and reinforced knees.",
        tags: ["Featured"]
    },
    {
        id: 3,
        title: "Graphite Boxy Hoodie",
        price: 75,
        category: "Sweatshirts",
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["S", "M", "L", "XL"],
        description: "Ultra-soft fleece hoodie with a cropped, boxy silhouette. Tonal embroidery on the chest.",
        tags: ["Essentials"]
    },
    {
        id: 4,
        title: "Nylon Tech Vest",
        price: 65,
        category: "Outerwear",
        images: [
            "https://images.unsplash.com/photo-1614633833026-002064211603?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1606103836293-0a063ee21200?q=80&w=1000&auto=format&fit=crop"
        ],
        sizes: ["M", "L", "XL"],
        description: "Lightweight water-repellent nylon vest. perfect for layering over tees or hoodies.",
        tags: ["New Arrival"]
    }
];
