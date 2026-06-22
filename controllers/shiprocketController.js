import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';

// Helper to convert UUID to 32-bit positive integer
export function uuidToId(uuid) {
    if (!uuid) return 0;
    const hash = crypto.createHash('md5').update(uuid).digest('hex');
    return parseInt(hash.substring(0, 8), 16);
}

// Map database product model to Shiprocket product format
function mapProductToShiprocket(product) {
    const primaryVariant = product.product_variants?.find(v => v.is_primary) || product.product_variants?.[0];
    const imageSrc = primaryVariant?.image_urls?.[0] || '';

    // Aggregate unique size and color options
    const optionValues = {};
    product.product_variants?.forEach(variant => {
        if (variant.size) {
            if (!optionValues['Size']) optionValues['Size'] = new Set();
            optionValues['Size'].add(variant.size);
        }
        if (variant.color_id?.name) {
            if (!optionValues['Color']) optionValues['Color'] = new Set();
            optionValues['Color'].add(variant.color_id.name);
        }
    });

    const options = Object.keys(optionValues).map(key => ({
        name: key,
        values: Array.from(optionValues[key])
    }));

    const variants = (product.product_variants || []).map(variant => {
        const optionVals = {};
        if (variant.color_id?.name) optionVals['Color'] = variant.color_id.name;
        if (variant.size) optionVals['Size'] = variant.size;

        // Title represents size / color combination
        const titleParts = [];
        if (variant.color_id?.name) titleParts.push(variant.color_id.name);
        if (variant.size) titleParts.push(variant.size);
        const title = titleParts.join(' / ') || 'Default Variant';

        return {
            id: uuidToId(variant.id),
            title: title,
            price: (product.price || 0).toFixed(2),
            compare_at_price: product.compare_at_price ? parseFloat(product.compare_at_price).toFixed(2) : null,
            sku: variant.sku || product.sku || `QISSEY-${uuidToId(variant.id)}`,
            quantity: variant.quantity !== undefined ? variant.quantity : (variant.stock !== undefined ? variant.stock : 100),
            created_at: variant.created_at || product.created_at || new Date().toISOString(),
            updated_at: variant.updated_at || product.updated_at || variant.created_at || new Date().toISOString(),
            taxable: true,
            option_values: optionVals,
            grams: variant.grams || 500,
            image: {
                src: variant.image_urls?.[0] || imageSrc
            },
            weight: variant.weight || 0.5,
            weight_unit: variant.weight_unit || 'kg'
        };
    });

    // Make tags list from fabrics or other product attributes
    const tagsList = [];
    if (product.fabrics && Array.isArray(product.fabrics)) {
        tagsList.push(...product.fabrics);
    }
    if (product.new_arrival) {
        tagsList.push('New Arrival');
    }
    const tagsString = tagsList.join(', ');

    return {
        id: uuidToId(product.id),
        title: product.name,
        body_html: product.description ? (product.description.startsWith('<') ? product.description : `<p>${product.description}</p>`) : '',
        vendor: product.vendor || 'QISSEY',
        product_type: product.product_type || 'Clothing',
        created_at: product.created_at || new Date().toISOString(),
        handle: product.slug,
        updated_at: product.updated_at || product.created_at || new Date().toISOString(),
        tags: tagsString,
        status: product.status || 'active',
        variants: variants,
        image: {
            src: imageSrc
        },
        options: options
    };
}

export const getProducts = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('products')
            .select(`
                *,
                product_variants(
                    *,
                    color_id(
                        *
                    )
                )
            `);

        if (error) throw error;

        const mappedProducts = (data || []).map(mapProductToShiprocket);

        res.json({
            data: {
                total: mappedProducts.length,
                products: mappedProducts
            }
        });
    } catch (error) {
        console.error('Error fetching Shiprocket products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getCollections = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('collections')
            .select('*');

        if (error) throw error;

        const mappedCollections = (data || []).map(col => ({
            id: uuidToId(col.id),
            updated_at: col.updated_at || col.created_at || new Date().toISOString(),
            body_html: col.description ? (col.description.startsWith('<') ? col.description : `<p>${col.description}</p>`) : '',
            handle: col.slug || col.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            image: {
                src: col.image_url || ''
            },
            title: col.name,
            created_at: col.created_at || new Date().toISOString()
        }));

        res.json({
            data: {
                total: mappedCollections.length,
                collections: mappedCollections
            }
        });
    } catch (error) {
        console.error('Error fetching Shiprocket collections:', error);
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
};

export const getProductsByCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;

        // Step 1: Find the collection's real UUID by matching uuidToId(id) with collectionId
        const { data: collections, error: colError } = await supabaseAdmin
            .from('collections')
            .select('id');

        if (colError) throw colError;

        const targetCollection = collections?.find(c => uuidToId(c.id).toString() === collectionId);
        if (!targetCollection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        const collectionUuid = targetCollection.id;

        // Step 2: Query products associated with that collection
        const { data: products, error: prodError } = await supabaseAdmin
            .from('products')
            .select(`
                *,
                product_variants(
                    *,
                    color_id(
                        *
                    )
                ),
                product_collections!inner(collection_id)
            `)
            .eq('product_collections.collection_id', collectionUuid);

        if (prodError) throw prodError;

        const mappedProducts = (products || []).map(mapProductToShiprocket);

        res.json({
            data: {
                total: mappedProducts.length,
                products: mappedProducts
            }
        });
    } catch (error) {
        console.error('Error fetching Shiprocket products by collection:', error);
        res.status(500).json({ error: 'Failed to fetch products by collection' });
    }
};
