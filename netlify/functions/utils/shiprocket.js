/* eslint-env node */
const fetch = require('node-fetch');

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken = null;
let tokenExpiry = null;

async function getShiprocketToken() {
    // Return cached token if valid
    if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
        return cachedToken;
    }

    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
        console.error('Shiprocket credentials missing');
        return null;
    }

    try {
        const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Shiprocket login failed:', error);
            return null;
        }

        const data = await response.json();
        cachedToken = data.token;
        // Cache for 24 hours (token usually lasts 10 days, but safety margin)
        const now = new Date();
        now.setHours(now.getHours() + 24);
        tokenExpiry = now;

        return cachedToken;
    } catch (error) {
        console.error('Error getting Shiprocket token:', error);
        return null;
    }
}

async function createShiprocketOrder(order, orderItems) {
    const token = await getShiprocketToken();
    if (!token) {
        throw new Error('Failed to authenticate with Shiprocket');
    }

    // 1. Prepare Payload
    const shiprocketItems = orderItems.map(item => ({
        name: item.product_name || 'Product',
        sku: item.sku || `ITEM-${item.id}`,
        units: parseInt(item.quantity) || 1,
        selling_price: parseFloat(item.price),
        discount: 0,
        tax: 0,
        hsn: 441122 // Default HSN, user might want to make this dynamic later
    }));

    const subTotal = orderItems.reduce((total, item) => total + (parseFloat(item.price) * parseInt(item.quantity)), 0);
    const totalWeight = orderItems.reduce((total, item) => total + 0.5, 0); // Default 0.5kg per item if not specified

    // Format date: YYYY-MM-DD HH:MM
    const date = new Date(order.created_at || new Date());
    const formattedDate = date.toISOString().slice(0, 10) + ' ' + date.toTimeString().slice(0, 5);

    // Parse shipping address
    // Assuming shipping_address is JSONB in Supabase: { name, email, phone, line1, city, state, postal_code, country }
    const address = order.shipping_address || {};
    const billingName = address.name || order.customer_name || 'Customer';
    const splitName = billingName.split(' ');
    const firstName = splitName[0];
    const lastName = splitName.slice(1).join(' ') || '';

    const payload = {
        order_id: order.id,
        order_date: formattedDate,
        pickup_location: 'Primary', // Must match Shiprocket settings
        comment: "Order from Website",
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: address.line1 || "Not Provided",
        billing_city: address.city || "Unknown",
        billing_pincode: address.postal_code || "000000",
        billing_state: address.state || "Unknown",
        billing_country: address.country || "India",
        billing_email: address.email || order.customer_email || "noemail@example.com",
        billing_phone: (address.phone || "0000000000").replace(/\D/g, ''),
        shipping_is_billing: true,
        order_items: shiprocketItems,
        payment_method: "Prepaid",
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: subTotal,
        length: 10,
        breadth: 10,
        height: 10,
        weight: Math.max(totalWeight, 0.5)
    };

    console.log('Creating Shiprocket Order with payload:', JSON.stringify(payload));

    // 2. Create Order
    const createRes = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const createData = await createRes.json();
    console.log('Shiprocket Create Response:', createData);

    if (!createRes.ok || !createData.shipment_id) {
        throw new Error(`Shiprocket Order Creation Failed: ${JSON.stringify(createData)}`);
    }

    const { order_id: srOrderId, shipment_id: srShipmentId } = createData;
    let awbCode = null;
    let courierName = null;
    let labelUrl = null;
    let pickupScheduled = false;

    try {
        // 3. Check Serviceability
        // pickup_postcode is needed. Assuming it's configured in 'Primary' location which users set in dashboard.
        // We'll skip strict serviceability check and rely on auto-assign which handles best available.
        // Actually, user wants full automation. Let's try Auto-Assign directly.

        console.log('Attempting Auto-Assign AWB...');
        const assignRes = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/auto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ shipment_id: srShipmentId })
        });

        const assignData = await assignRes.json();
        console.log('AWB Auto-Assign Response:', assignData);

        if (assignData.awb_assign_status === 1 && assignData.response?.data?.awb_code) {
            awbCode = assignData.response.data.awb_code;
            courierName = assignData.response.data.courier_name;

            // 4. Generate Label
            console.log('Generating Label...');
            const labelRes = await fetch(`${SHIPROCKET_BASE_URL}/courier/generate/label`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ shipment_id: [srShipmentId] })
            });
            const labelData = await labelRes.json();
            labelUrl = labelData.label_url;
            console.log('Label URL:', labelUrl);

            // 5. Schedule Pickup
            console.log('Scheduling Pickup...');
            const pickupRes = await fetch(`${SHIPROCKET_BASE_URL}/courier/generate/pickup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ shipment_id: [srShipmentId] })
            });
            const pickupData = await pickupRes.json();
            console.log('Pickup Response:', pickupData);
            if (pickupData.pickup_status === 1) {
                pickupScheduled = true;
            }
        } else {
            console.warn('AWB Auto-Assignment failed or returned no AWB. Manual intervention might be required.');
        }

    } catch (automationError) {
        console.error('Error during Shiprocket automation (AWB/Pickup):', automationError);
        // We catch this so we still return the created order ID - partial success
    }

    return {
        shiprocket_order_id: srOrderId,
        shiprocket_shipment_id: srShipmentId,
        awb_code: awbCode,
        courier_name: courierName,
        label_url: labelUrl,
        pickup_scheduled: pickupScheduled
    };
}

module.exports = { createShiprocketOrder };
