import fetch from 'node-fetch';

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

export async function createShiprocketOrder(order, orderItems) {
    const token = await getShiprocketToken();
    if (!token) {
        throw new Error('Failed to authenticate with Shiprocket');
    }

    // Map Order details (adhering to user snippet logic where applicable)
    // Supabase order.shipping_address is JSONB.
    const address = order.shipping_address || {};
    const billingName = address.name || order.customer_name || 'Customer';
    const splitName = billingName.split(' ');
    const firstName = splitName[0];
    const lastName = splitName.slice(1).join(' ') || '';

    // User snippet uses parseInt and replace regex
    const billingPhone = parseInt((address.phone?.slice(3) || "0000000000").replace(/\D/g, ''));
    const billingPincode = address.postal_code ? parseInt(address.postal_code) : 0;

    // 1. Prepare Payload
    const shiprocketItems = orderItems.map(item => ({
        name: item.product_name || 'Product',
        sku: item.sku || `ITEM-${item.id}`,
        units: parseInt(item.quantity) || 1,
        selling_price: parseFloat(item.price),
        discount: "",
        tax: "",
        hsn: 441122
    }));

    const subTotal = orderItems.reduce((total, item) => total + (parseFloat(item.price) * parseInt(item.quantity)), 0);
    const totalWeight = orderItems.reduce((total, item) => total + 0.5, 0);

    // Format date: YYYY-MM-DD HH:MM
    const d = new Date(order.created_at || new Date());
    const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    const isPaid = order.payment_status === 'paid';

    const payload = {
        order_id: order.id,
        order_date: formattedDate,
        pickup_location: 'QISSEY_Surat',
        comment: "Order from Website",
        billing_customer_name: firstName,
        billing_last_name: lastName,
        billing_address: address.line1 || "Not Provided",
        billing_address_2: address.line2 || "",
        billing_city: address.city || "Unknown",
        billing_pincode: billingPincode,
        billing_state: address.state || "Unknown",
        billing_country: address.country || "India",
        billing_email: address.email || order.customer_email || "noemail@example.com",
        billing_phone: billingPhone,
        shipping_is_billing: true,
        order_items: shiprocketItems,
        payment_method: isPaid ? "Prepaid" : "COD",
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: subTotal,
        length: 15,
        breadth: 15,
        height: 7,
        weight: Math.max(totalWeight, 0.5)
    };

    console.log('Creating Shiprocket Order with payload:', JSON.stringify(payload));

    // STEP 1 — Create Shipment
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

    // STEP 2 — Check Serviceability (Optional but recommended)
    let recommendedCourier = null;
    try {
        console.log("Checking serviceability...");
        // Use billing pincode as pickup pincode for checking availability (as per user snippet)
        const params = new URLSearchParams({
            pickup_postcode: billingPincode,
            delivery_postcode: billingPincode,
            weight: Math.max(totalWeight, 0.5).toString(),
            cod: isPaid ? '0' : '1'
        });

        const serviceRes = await fetch(`${SHIPROCKET_BASE_URL}/courier/serviceability/?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (serviceRes.ok) {
            const serviceData = await serviceRes.json();
            console.log("Serviceability response:", JSON.stringify(serviceData));
            if (serviceData.data?.available_courier_companies?.length > 0) {
                recommendedCourier = serviceData.data.available_courier_companies[0];
                console.log("Recommended courier:", recommendedCourier.courier_name);
            }
        }
    } catch (serviceError) {
        console.error("Serviceability check error:", serviceError);
    }

    // STEP 3 — Assign AWB
    try {
        if (recommendedCourier?.courier_company_id) {
            console.log("Assigning AWB with specific courier ID:", recommendedCourier.courier_company_id);
            const assignRes = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/awb`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    shipment_id: srShipmentId,
                    courier_id: recommendedCourier.courier_company_id
                })
            });
            const assignData = await assignRes.json();
            console.log("AWB Assign Response:", assignData);
            if (assignData.awb_assign_status === 1) {
                awbCode = assignData.response.data.awb_code;
                courierName = assignData.response.data.courier_name;
            }
        } else {
            console.log("Using auto-assignment...");
            const assignRes = await fetch(`${SHIPROCKET_BASE_URL}/courier/assign/auto`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ shipment_id: srShipmentId })
            });
            const assignData = await assignRes.json();
            console.log("Auto Assign AWB Response:", assignData);
            if (assignData.awb_assign_status === 1) {
                awbCode = assignData.response.data.awb_code;
                courierName = assignData.response.data.courier_name;
            }
        }
    } catch (assignError) {
        console.error("Error defining AWB:", assignError);
    }

    // STEP 4 — Generate Shipping Label
    if (awbCode) {
        try {
            console.log("Generating shipping label...");
            const labelRes = await fetch(`${SHIPROCKET_BASE_URL}/courier/generate/label`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ shipment_id: [srShipmentId] })
            });
            const labelData = await labelRes.json();
            labelUrl = labelData.label_url || labelData.label_created;
            console.log("Label URL:", labelUrl);
        } catch (labelError) {
            console.error("Error generating label:", labelError);
        }
    }

    // STEP 5 — Schedule Pickup
    if (awbCode) {
        try {
            console.log("Scheduling pickup...");
            const pickupRes = await fetch(`${SHIPROCKET_BASE_URL}/courier/generate/pickup`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ shipment_id: [srShipmentId] })
            });
            const pickupData = await pickupRes.json();
            console.log("Pickup Response:", pickupData);
            if (pickupData.pickup_status === 1) {
                pickupScheduled = true;
            }
        } catch (pickupError) {
            console.error("Error scheduling pickup:", pickupError);
        }
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
