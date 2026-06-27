import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, MapPin, CreditCard } from 'lucide-react';
import { paymentService } from '../services/paymentService';
import { useCart } from '../features/cart';
import { useAuth } from '../features/auth';
import { Button } from '../components/ui/Primitives';
import { supabase } from '../lib/supabase';

export default function CheckoutSuccess() {
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    const { user } = useAuth();
    
    const orderId = searchParams.get('oid');
    const status = searchParams.get('ost');
    
    const [loading, setLoading] = useState(true);
    const [dbOrder, setDbOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const syncOrder = async () => {
            if (status !== 'SUCCESS') {
                setLoading(false);
                return;
            }
            if (!orderId) {
                setError('Missing order ID');
                setLoading(false);
                return;
            }

            try {
                // Get access token for auth/RLS if needed
                const { data: { session } } = await supabase.auth.getSession();
                const accessToken = session?.access_token;
                
                const response = await paymentService.fetchShiprocketOrderDetails(orderId, accessToken);
                if (response.success && response.order) {
                    setDbOrder(response.order);
                    clearCart(); // clear cart locally upon success
                } else {
                    setError(response.error || 'Failed to sync your order details');
                }
            } catch (err) {
                console.error('Error syncing order details:', err);
                setError('Failed to synchronize order details');
            } finally {
                setLoading(false);
            }
        };

        syncOrder();
    }, [orderId, status]);

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <Loader2 className="w-8 h-8 animate-spin text-black mb-4" />
                <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-gray-500">
                    Verifying and syncing your order...
                </p>
            </div>
        );
    }

    if (status !== 'SUCCESS' || error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <XCircle className="w-16 h-16 text-black/15 stroke-[0.5] mb-8" />
                <p className="text-[12px] tracking-[0.25em] uppercase font-bold text-black mb-2">
                    Checkout Unsuccessful
                </p>
                <p className="text-[11px] tracking-wide text-gray-400 mb-8 max-w-xs text-center leading-relaxed">
                    {error || 'The checkout session was unsuccessful or cancelled. If your account was debited, it will be automatically refunded.'}
                </p>
                <Button asChild className="rounded-none bg-black text-white hover:bg-black/90 font-bold uppercase tracking-widest text-[11px] h-12 px-8">
                    <Link to="/shopping-bag">Return to Shopping Bag</Link>
                </Button>
            </div>
        );
    }

    const shippingAddress = dbOrder?.shipping_address || {};

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-24 pt-24 md:pt-32">
            <div className="max-w-[800px] mx-auto px-6 md:px-12">
                
                {/* Header Success Section */}
                <div className="flex flex-col items-center text-center mb-16 space-y-6">
                    <CheckCircle2 className="w-16 h-16 text-black stroke-[0.5]" />
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-light tracking-tight">
                            THANK YOU FOR YOUR ORDER
                        </h1>
                        <p className="text-[11px] tracking-[0.3em] font-medium text-gray-500 uppercase">
                            YOUR PAYMENT WAS SUCCESSFULLY VERIFIED
                        </p>
                    </div>
                </div>

                {/* Details Card */}
                <div className="border border-black/5 p-8 md:p-12 space-y-12 mb-12">
                    
                    {/* Order Reference */}
                    <div className="flex justify-between items-start border-b border-black/5 pb-8">
                        <div>
                            <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase mb-1">
                                ORDER REFERENCE
                            </p>
                            <p className="text-[13px] font-medium tracking-wider">
                                {dbOrder?.id}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase mb-1">
                                SHIPROCKET REF
                            </p>
                            <p className="text-[13px] font-medium tracking-wider text-gray-600">
                                #{dbOrder?.shiprocket_order_id}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Shipping Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-black uppercase">
                                <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />
                                <span>DELIVERY ADDRESS</span>
                            </div>
                            <div className="text-[11px] tracking-wide leading-relaxed text-gray-600 space-y-1 uppercase font-light">
                                <p className="text-black font-medium">{shippingAddress.name}</p>
                                <p>{shippingAddress.line1}</p>
                                {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}</p>
                                <p>{shippingAddress.country || 'INDIA'}</p>
                                <p className="pt-2">T: {shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Payment / Transaction Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-black uppercase">
                                <CreditCard className="w-3.5 h-3.5 stroke-[1.5]" />
                                <span>PAYMENT METHOD</span>
                            </div>
                            <div className="text-[11px] tracking-wide leading-relaxed text-gray-600 space-y-1 uppercase font-light">
                                <p className="text-black font-medium">METHOD: {dbOrder?.payment_method}</p>
                                <p>STATUS: {dbOrder?.payment_status}</p>
                                <p className="pt-2 text-black font-medium text-xs">
                                    TOTAL PAID: {formatPrice(dbOrder?.total_amount)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild variant="outline" className="rounded-none border-black hover:bg-black hover:text-white transition-colors duration-300 font-bold uppercase tracking-widest text-[11px] h-12 px-8">
                        <Link to="/account">View Order History</Link>
                    </Button>
                    <Button asChild className="rounded-none bg-black text-white hover:bg-black/90 font-bold uppercase tracking-widest text-[11px] h-12 px-8">
                        <Link to="/">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
