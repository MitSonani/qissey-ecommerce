import React, { useState } from 'react';
import { useAuth } from '../features/auth';
import { Link } from 'react-router-dom';
import { FileText, Search, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
    { id: '01', label: 'PURCHASES', content: 'NO PURCHASES YET' },
    { id: '02', label: 'FAVOURITES', content: 'YOUR FAVOURITES ARE EMPTY' },
    { id: '03', label: 'MY DETAILS', content: 'USER DETAILS SECTION' },
    { id: '04', label: 'SETTINGS', content: 'ACCOUNT SETTINGS' },
];

export default function Account() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('02');

    const activeItem = MENU_ITEMS.find(item => item.id === activeTab);

    return (
        <div className="min-h-screen bg-white text-black font-sans pt-8 md:pt-64 pb-20 px-4 md:px-12">


            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                {/* Sidebar */}
                <div className="md:col-span-3 space-y-6">
                    <nav className="flex flex-col gap-4">
                        {MENU_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`text-[11px] md:text-[13px] tracking-[0.1em] text-left hover:text-gray-500 transition-colors uppercase ${activeTab === item.id ? 'font-black' : 'font-normal'
                                    }`}
                            >
                                <span className="mr-2 text-gray-400 font-light">|{item.id}|</span> {item.label}
                            </button>
                        ))}
                    </nav>




                </div>

                {/* Main Content */}
                <div className="md:col-span-6 flex flex-col items-center justify-center min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-center space-y-6"
                        >
                            {activeTab === '02' ? (
                                <>
                                    <FileText className="w-12 h-12 mx-auto stroke-[0.5] text-gray-400 mb-8" />
                                    <p className="text-[11px] md:text-[12px] tracking-[0.2em] uppercase font-medium">
                                        THERE ARE NO ACTIVE RETURNS AT THIS TIME.
                                    </p>
                                </>
                            ) : (
                                <p className="text-[11px] md:text-[12px] tracking-[0.2em] uppercase font-medium">
                                    {activeItem?.content}
                                </p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Section */}

            </div>





        </div>
    );
}
