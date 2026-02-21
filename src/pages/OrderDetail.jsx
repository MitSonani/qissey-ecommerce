import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Package, MapPin, CreditCard, Calendar } from 'lucide-react';
import { fetchOrderById } from '../services/orderService';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();
};

const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
};

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log("order", order)

    useEffect(() => {
        const loadOrder = async () => {
            setLoading(true);
            const data = await fetchOrderById(id);
            setOrder(data);
            setLoading(false);
        };

        loadOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-gray-200" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <p className="text-[11px] tracking-[0.2em] uppercase font-medium text-gray-500 mb-8">
                    ORDER NOT FOUND
                </p>
                <Link
                    to="/account"
                    className="text-[11px] tracking-[0.2em] uppercase font-bold border-b border-black pb-1"
                >
                    BACK TO ACCOUNT
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans pb-20 pt-24 md:pt-32">
            <div className="max-w-[1200px] mx-auto px-4 md:px-12">
                {/* Back Link */}

                <Link
                    to="/account"
                    className="inline-flex pt-6 items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 hover:text-black transition-colors uppercase mb-12"
                >
                    <ArrowLeft className="w-3 h-3" />
                    BACK TO PURCHASES
                </Link>

                {/* Header Section */}
                <div className="mb-20 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <p className="text-2xl md:text-4xl font-light tracking-tight">
                                {formatDate(order.created_at)}
                            </p>
                            <p className="text-[11px] tracking-[0.3em] font-medium text-gray-500 uppercase">
                                STATUS: {order.status}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-1">
                                ORDER REF.
                            </p>
                            <p className="text-[13px] font-medium tracking-wider">
                                {order.id}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-8">
                            <p className="text-[12px] tracking-[0.2em] font-bold border-b border-gray-100 pb-4 uppercase">
                                ITEMS ({order.order_items?.length || 0})
                            </p>

                            <div className="space-y-12">
                                {order.order_items?.map((item) => (
                                    <div key={item.id} className="flex gap-6 md:gap-10 group">
                                        <div className="w-24 md:w-32 aspect-[3/4] bg-gray-50 flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.variant?.image_urls?.[0]}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-[14px] md:text-[16px] font-light tracking-wide max-w-[200px] md:max-w-none">
                                                        {item.product_name}
                                                    </p>
                                                    <p className="text-[13px] md:text-[14px] font-medium tracking-tight">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-y-2 text-[10px] md:text-[11px] tracking-[0.1em] text-gray-500 uppercase">
                                                    <div>
                                                        <span className="opacity-60 block mb-0.5">SIZE</span>
                                                        <span className="text-black font-medium">{item.size}</span>
                                                    </div>
                                                    {item.variant?.color?.name && (
                                                        <div>
                                                            <span className="opacity-60 block mb-0.5">COLOR</span>
                                                            <span className="text-black font-medium">{item.variant.color.name}</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="opacity-60 block mb-0.5">QUANTITY</span>
                                                        <span className="text-black font-medium">{item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information & Summary */}
                    <div className="lg:col-span-4 space-y-16">
                        {/* Summary Section */}
                        <div className="space-y-8">
                            <p className="text-[12px] tracking-[0.2em] font-bold border-b border-gray-100 pb-4 uppercase">
                                SUMMARY
                            </p>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[11px] tracking-[0.15em] text-gray-500 uppercase">
                                    <span>SUBTOTAL</span>
                                    <span className="text-black">{formatPrice(order.total_amount)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] tracking-[0.15em] text-gray-500 uppercase">
                                    <span>SHIPPING</span>
                                    <span className=" font-medium">FREE</span>
                                </div>
                                <div className="pt-6 mt-6 border-t border-black flex justify-between text-[14px] tracking-[0.1em] font-bold uppercase">
                                    <span>TOTAL</span>
                                    <span>{formatPrice(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="space-y-8 font-sans">
                            <p className="text-[12px] tracking-[0.2em] font-bold border-b border-gray-100 pb-4 uppercase">
                                SHIPPING ADDRESS
                            </p>
                            <div className="text-[12px] md:text-[13px] tracking-wide leading-relaxed text-gray-600 space-y-1 uppercase font-light">
                                <p className="text-black font-medium mb-2">{order.shipping_address?.name}</p>
                                <p>{order.shipping_address?.address_line1}</p>
                                {order.shipping_address?.address_line2 && <p>{order.shipping_address?.address_line2}</p>}
                                <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}</p>
                                <p>{order.shipping_address?.country || 'INDIA'}</p>
                                <p className="pt-4">T: {order.shipping_address?.phone || order.shipping_address?.mobile}</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-8">
                            <p className="text-[12px] tracking-[0.2em] font-bold border-b border-gray-100 pb-4 uppercase">
                                PAYMENT
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 stroke-[1] text-gray-400" />
                                </div>
                                <div className="text-[11px] tracking-[0.15em] uppercase">
                                    <p className="font-medium">{order.payment_method || 'ONLINE'}</p>
                                    <p className="text-gray-400">{order.payment_status || 'PAID'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
