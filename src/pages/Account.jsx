import React, { useState } from 'react';
import { useAuth } from '../features/auth';
import { FileText, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Purchases from '../features/account/components/Purchases';

const MENU_ITEMS = [
    { id: '01', label: 'PURCHASES', content: 'NO PURCHASES YET' },
    { id: '02', label: 'FAVOURITES', content: 'YOUR FAVOURITES ARE EMPTY' },
    { id: '03', label: 'MY DETAILS', content: 'USER DETAILS SECTION' },
    { id: '04', label: 'SETTINGS', content: 'ACCOUNT SETTINGS' },
    { id: '05', label: 'LOGOUT', content: 'LOGGING OUT...' },
];

const ORDER_STATUSES = [
    { id: 'pending', label: 'PROCESSING' },
    { id: 'shipped', label: 'SHIPPED' },
    { id: 'processing', label: 'INTRANSIT' },
    { id: 'delivered', label: 'DELIVERED' },
];

export default function Account() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('01');
    const [selectedStatus, setSelectedStatus] = useState('pending');

    const activeItem = MENU_ITEMS.find(item => item.id === activeTab);

    return (
        <div className="min-h-screen bg-white text-black font-sans pt-24 md:pt-32 pb-20 px-4 md:px-12">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                    {/* Sidebar */}
                    <div className="md:col-span-3 pt-36">
                        <nav className="flex flex-col gap-6 sticky top-32">
                            {MENU_ITEMS.map((item) => (
                                <div key={item.id} className="space-y-4">
                                    <button
                                        onClick={() => {
                                            if (item.id === '05') {
                                                logout();
                                            } else {
                                                setActiveTab(item.id);
                                            }
                                        }}
                                        className={`text-[11px] md:text-[13px] tracking-[0.15em] text-left hover:text-gray-500 transition-colors uppercase flex items-center ${activeTab === item.id ? 'font-bold' : 'font-normal text-gray-400'
                                            }`}
                                    >
                                        <span className="mr-3 text-[10px] opacity-60">|{item.id}|</span>
                                        {item.label}
                                    </button>

                                    {/* Sub-menu for Purchases */}
                                    {item.id === '01' && activeTab === '01' && (
                                        <div className="flex flex-col gap-3 pl-8">
                                            {ORDER_STATUSES.map((status) => (
                                                <button
                                                    key={status.id}
                                                    onClick={() => setSelectedStatus(status.id)}
                                                    className={`text-[10px] md:text-[11px] tracking-[0.1em] text-left hover:text-black transition-colors uppercase ${selectedStatus === status.id ? 'text-black font-bold' : 'text-gray-400'
                                                        }`}
                                                >
                                                    {status.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${activeTab}-${selectedStatus}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {activeTab === '01' ? (
                                    <Purchases user={user} selectedStatus={selectedStatus} />
                                ) : activeTab === '02' ? (
                                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
                                        <FileText className="w-12 h-12 mx-auto stroke-[0.5] text-gray-300 mb-8" />
                                        <p className="text-[11px] md:text-[12px] tracking-[0.2em] uppercase font-medium text-gray-500">
                                            THERE ARE NO ACTIVE RETURNS AT THIS TIME.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center min-h-[400px]">
                                        <p className="text-[11px] md:text-[12px] tracking-[0.2em] uppercase font-medium text-gray-500">
                                            {activeItem?.content}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}



