import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function Sitemap() {
    // Completely static category links mapping every route in the e-commerce platform
    const categories = [
        {
            title: "Explore QISSEY",
            links: [
                { label: "Home Page", path: "/" },
                { label: "Shop All Collections", path: "/shop" },
                { label: "New Arrivals", path: "/new-arrivals" },
                { label: "About Our Studio", path: "/about" },
                { label: "Contact Us", path: "/contact" }
            ]
        },
        {
            title: "Your Account",
            links: [
                { label: "Authentication / Sign In", path: "/auth" },
                { label: "My Account Details", path: "/account?tab=details" },
                { label: "My Purchases & Orders", path: "/account?tab=purchases" },
                { label: "Shopping Bag", path: "/shopping-bag" },
                { label: "Saved Products / Wishlist", path: "/saved-products" }
            ]
        },
        {
            title: "Customer Support",
            links: [
                { label: "Get In Touch", path: "/contact" },
                { label: "Shipping Policy", path: "/shipping-policy" },
                { label: "Payment and Invoices", path: "/payment-policy" },
                { label: "Exchanges, Returns and Refunds", path: "/return-policy" }
            ]
        },
        {
            title: "Legal & Conditions",
            links: [
                { label: "Privacy Policy", path: "/privacy-policy" },
                { label: "Purchase Conditions", path: "/purchase-conditions" }
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#1A1A1A] font-sans pt-24 md:pt-32 pb-24 px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto">
                <div className="border-b border-black/10 pb-8 mb-16">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Sitemap</h1>
                    <p className="text-[13px] md:text-[14px] uppercase tracking-widest opacity-60">
                        A curated guide to navigating our studio, accounts, and policies.
                    </p>
                </div>

                {/* 4-Column Minimal Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16"
                >
                    {categories.map((cat, idx) => (
                        <motion.div key={idx} variants={itemVariants} className="space-y-6">
                            {/* Section Header */}
                            <div className="flex items-center gap-2 border-b border-black/10 pb-3">
                                <h2 className="text-[12px] uppercase font-bold tracking-wider">{cat.title}</h2>
                            </div>

                            {/* Section Links */}
                            <ul className="space-y-4">
                                {cat.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link
                                            to={link.path}
                                            className="group flex items-center justify-between text-[12px] uppercase tracking-wider text-black/70 hover:text-black hover:font-bold transition-all"
                                        >
                                            <span>{link.label}</span>
                                            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-black transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
