import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserOrders } from '../../../services/orderService';

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

export default function Purchases({ user, selectedStatus }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            if (user?.id) {
                setLoading(true);
                const data = await fetchUserOrders(user.id);
                setOrders(data);
                setLoading(false);
            }
        };

        loadOrders();
    }, [user?.id]);

    const filteredOrders = orders.filter(order =>
        order.status?.toLowerCase() === selectedStatus
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
            </div>
        );
    }

    if (filteredOrders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-[0.5] text-gray-300 mb-8" />
                <p className="text-[11px] md:text-[12px] tracking-[0.2em] uppercase font-medium text-gray-500">
                    YOU HAVE NO {selectedStatus} PURCHASES YET.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-24">
            {filteredOrders.map((order) => (
                <Link
                    key={order.id}
                    to={`/account/order/${order.id}`}
                    className="block group hover:opacity-80 transition-opacity"
                >
                    <div className="space-y-8">
                        <div className="space-y-1">
                            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                                {formatDate(order.created_at)}
                            </h2>
                            <p className="text-[10px] md:text-[11px] tracking-[0.2em] text-gray-400 uppercase">
                                {order.status} - {formatPrice(order.total_amount)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                            {order.order_items?.map((item) => (
                                <div key={item.id} className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
                                    <img
                                        src={item.variant?.image_urls?.[0]}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
