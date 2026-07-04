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
        const { collection_id } = req.query;
        let productsQuery;

        if (collection_id) {
            let collectionUuid;
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(collection_id);

            if (isUUID) {
                collectionUuid = collection_id;
            } else {
                // Find the collection's real UUID by matching uuidToId(id) with collection_id
                const { data: collections, error: colError } = await supabaseAdmin
                    .from('collections')
                    .select('id');

                if (colError) throw colError;

                const targetCollection = collections?.find(c => uuidToId(c.id).toString() === collection_id);
                if (!targetCollection) {
                    return res.status(404).json({ error: 'Collection not found' });
                }

                collectionUuid = targetCollection.id;
            }

            productsQuery = supabaseAdmin
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
        } else {
            productsQuery = supabaseAdmin
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
        }

        const { data, error } = await productsQuery;

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

        let collectionUuid;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(collectionId);

        if (isUUID) {
            collectionUuid = collectionId;
        } else {
            // Find the collection's real UUID by matching uuidToId(id) with collectionId
            const { data: collections, error: colError } = await supabaseAdmin
                .from('collections')
                .select('id');

            if (colError) throw colError;

            const targetCollection = collections?.find(c => uuidToId(c.id).toString() === collectionId);
            if (!targetCollection) {
                return res.status(404).json({ error: 'Collection not found' });
            }

            collectionUuid = targetCollection.id;
        }

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

export const createCheckoutToken = async (req, res) => {
    try {
        const { cartItems, user_id } = req.body;
        const apiKey = process.env.SHIPROCKET_CHECKOUT_API_KEY;
        const secretKey = process.env.SHIPROCKET_CHECKOUT_SECRET_KEY;

        if (!apiKey || !secretKey) {
            throw new Error('Shiprocket Checkout keys missing in environment');
        }

        const cartSnapshot = cartItems.map(item => ({
            id: item.product_id || item.id,
            variant_id: item.variant_id,
            size: item.size,
            custom_measurements: item.custom_measurements,
            quantity: item.quantity,
            price: item.price,
            name: item.name
        }));

        const custom_attributes = {
            customer_id: user_id,
            cart_snapshot: JSON.stringify(cartSnapshot)
        };

        const timestamp = new Date().toISOString();
        const payload = {
            cart_data: {
                items: cartItems.map(item => ({
                    variant_id: String(uuidToId(item.variant_id)),
                    quantity: parseInt(item.quantity) || 1,
                    catalog_data: {
                        price: parseFloat(item.price),
                        name: item.name || 'Product',
                        image_url: item.variant?.image_urls?.[0] || item.product_variants?.[0]?.image_urls?.[0] || item.images?.[0] || ''
                    }
                })),
                custom_attributes,
                mobile_app: false
            },
            redirect_url: `${process.env.APP_URL || 'http://localhost:5173'}/checkout-success`,
            timestamp
        };

        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(JSON.stringify(payload));
        const signature = hmac.digest('base64');

        const response = await fetch('https://checkout-api.shiprocket.com/api/v1/access-token/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': apiKey,
                'X-Api-HMAC-SHA256': signature
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok || !data.ok) {
            console.error('Shiprocket token error response:', data);
            return res.status(response.status).json({ success: false, error: data.error || 'Failed to create checkout token' });
        }

        // Parse token and dynamically capture or build checkout redirect URL
        const token = data.result?.token;
        const checkoutUrl = data.result?.checkout_url || data.result?.url || data.result?.redirect_url || `https://checkout.shiprocket.in/?token=${token}`;

        res.status(200).json({
            success: true,
            checkout_url: checkoutUrl,
            token: token
        });
    } catch (error) {
        console.error('Error creating Shiprocket checkout token:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Helper function to sync Shiprocket order in Supabase
async function syncShiprocketOrder(result) {
    if (!result || !result.order_id) {
        throw new Error('Invalid order details');
    }

    const shiprocket_order_id = result.order_id;

    // Check if order already exists in Supabase
    const { data: existingOrder, error: checkError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('shiprocket_order_id', shiprocket_order_id)
        .maybeSingle();

    if (checkError) {
        console.error('Error checking existing order:', checkError);
    }

    if (existingOrder) {
        return existingOrder;
    }

    // Extract cart metadata and customer ID from custom attributes
    const customAttrs = result.cart_data?.custom_attributes || {};
    const customer_id = customAttrs.customer_id;
    let cartSnapshot = [];
    try {
        if (customAttrs.cart_snapshot) {
            cartSnapshot = JSON.parse(customAttrs.cart_snapshot);
        }
    } catch (parseError) {
        console.error('Failed to parse cart snapshot:', parseError);
    }

    // Process shipping address (Qissey layout uses JSONB with standard and legacy keys)
    const sa = result.shipping_address || {};
    const billingName = `${sa.first_name || ''} ${sa.last_name || ''}`.trim() || result.email || 'Customer';
    const dbShippingAddress = {
        name: billingName,
        phone: sa.phone || result.phone || '',
        line1: sa.line1 || '',
        address_line1: sa.line1 || '',
        line2: sa.line2 || '',
        address_line2: sa.line2 || '',
        city: sa.city || '',
        state: sa.state || '',
        postal_code: sa.pincode || '',
        country: sa.country || 'INDIA',
        email: sa.email || result.email || ''
    };

    // Insert order in Supabase orders table
    const paymentStatus = result.payment_status?.toLowerCase() === 'success' ? 'paid' : 'unpaid';
    const paymentMethod = result.payment_type?.toLowerCase() === 'prepaid' ? 'prepaid' : 'cod';
    const totalAmount = result.total_amount_payable || result.subtotal_price || 0;

    const { data: dbOrder, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert([
            {
                customer_id: customer_id || null,
                total_amount: totalAmount,
                currency: 'INR',
                status: 'processing',
                payment_status: paymentStatus,
                payment_method: paymentMethod,
                shipping_address: dbShippingAddress,
                customer_name: billingName,
                customer_email: dbShippingAddress.email,
                customer_phone: dbShippingAddress.phone,
                shiprocket_order_id: shiprocket_order_id
            }
        ])
        .select()
        .single();

    if (orderError) {
        console.error('Error syncing order in Supabase:', orderError);
        throw new Error('Supabase order creation failed: ' + orderError.message);
    }

    // Insert line items in order_items table using cartSnapshot metadata
    if (cartSnapshot && cartSnapshot.length > 0) {
        const orderItemsData = cartSnapshot.map(item => ({
            order_id: dbOrder.id,
            product_id: item.id || item.product_id,
            variant_id: item.variant_id,
            product_name: item.name,
            size: item.size,
            custom_measurements: item.custom_measurements,
            sku: item.sku || `SR-${uuidToId(item.variant_id)}`,
            quantity: item.quantity,
            price: item.price
        }));

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItemsData);

        if (itemsError) {
            console.error('Error syncing order items in Supabase:', itemsError);
        }
    } else {
        // Fallback: If cartSnapshot is empty, sync using result.cart_data.items
        const items = result.cart_data?.items || [];
        if (items.length > 0) {
            const orderItemsData = items.map(item => ({
                order_id: dbOrder.id,
                product_name: 'Product Item',
                sku: `SR-${item.variant_id}`,
                quantity: item.quantity,
                price: totalAmount / items.length
            }));

            await supabaseAdmin.from('order_items').insert(orderItemsData);
        }
    }

    return dbOrder;
}

export const getShiprocketOrderDetails = async (req, res) => {
    try {
        const { order_id } = req.body;
        const apiKey = process.env.SHIPROCKET_CHECKOUT_API_KEY;
        const secretKey = process.env.SHIPROCKET_CHECKOUT_SECRET_KEY;

        if (!apiKey || !secretKey) {
            throw new Error('Shiprocket Checkout keys missing in environment');
        }

        // 1. Check local DB first to avoid Shiprocket API race conditions
        const { data: existingOrder } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('shiprocket_order_id', order_id)
            .maybeSingle();
            
        if (existingOrder) {
            return res.status(200).json({ success: true, order: existingOrder });
        }

        const timestamp = new Date().toISOString();
        const payload = {
            order_id,
            timestamp
        };

        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(JSON.stringify(payload));
        const signature = hmac.digest('base64');

        let data;
        let response;
        let success = false;

        // Retry logic: Shiprocket sometimes throws 500 (StaleStateException) if polled instantly after checkout
        for (let i = 0; i < 3; i++) {
            response = await fetch('https://checkout-api.shiprocket.com/api/v1/custom-platform-order/details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Key': apiKey,
                    'X-Api-HMAC-SHA256': signature
                },
                body: JSON.stringify(payload)
            });

            data = await response.json();
            
            if (response.ok && data.ok) {
                success = true;
                break;
            }
            
            // Wait 1 second before retrying
            if (i < 2) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (!success) {
            console.error('Shiprocket order details error after retries:', data);
            
            // Final fallback check in case webhook processed it while we were retrying
            const { data: fallbackOrder } = await supabaseAdmin
                .from('orders')
                .select('*')
                .eq('shiprocket_order_id', order_id)
                .maybeSingle();
                
            if (fallbackOrder) {
                return res.status(200).json({ success: true, order: fallbackOrder });
            }

            return res.status(response?.status || 500).json({ success: false, error: data?.error || 'Failed to fetch order details' });
        }

        // Sync order to database
        const dbOrder = await syncShiprocketOrder(data.result);

        res.status(200).json({
            success: true,
            order: dbOrder
        });
    } catch (error) {
        console.error('Error fetching Shiprocket order details:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const handleShiprocketWebhook = async (req, res) => {
    try {
        const signatureHeader = req.headers['x-api-hmac-sha256'];
        const secretKey = process.env.SHIPROCKET_CHECKOUT_SECRET_KEY;

        if (!signatureHeader || !secretKey) {
            return res.status(401).json({ success: false, error: 'Unauthorized: Webhook signature or secret key missing' });
        }

        // Verify HMAC-SHA256 signature of request body
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(JSON.stringify(req.body));
        const computedSignature = hmac.digest('base64');

        if (computedSignature !== signatureHeader) {
            console.error('Webhook signature mismatch');
            return res.status(401).json({ success: false, error: 'Unauthorized: Signature mismatch' });
        }

        const webhookData = req.body;
        const result = webhookData.result || webhookData;

        if (result && result.order_id) {
            // 1. Sync order creation / updates
            const dbOrder = await syncShiprocketOrder(result);

            // 2. Sync shipment / tracking details if available
            const trackingNumber = result.tracking_number || webhookData.tracking_number;
            const courierName = result.courier_name || webhookData.courier_name;
            const trackingUrl = result.tracking_url || webhookData.tracking_url;

            if (trackingNumber || courierName || trackingUrl) {
                const updateData = {};
                if (trackingNumber) updateData.tracking_number = trackingNumber;
                if (courierName) updateData.courier_name = courierName;
                if (trackingUrl) updateData.tracking_url = trackingUrl;

                // Map standard statuses from Shiprocket if available
                if (result.status) {
                    const mappedStatus = result.status.toLowerCase();
                    if (['shipped', 'intransit', 'delivered'].includes(mappedStatus)) {
                        updateData.status = mappedStatus;
                    }
                }

                await supabaseAdmin
                    .from('orders')
                    .update(updateData)
                    .eq('shiprocket_order_id', result.order_id);
            }
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
