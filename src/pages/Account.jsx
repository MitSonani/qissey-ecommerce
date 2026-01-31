import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Primitives';
import { User, Package, Settings, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Account() {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: Package, label: 'Orders', info: '2 active orders' },
        { icon: User, label: 'Profile', info: 'Personal info' },
        { icon: Settings, label: 'Settings', info: 'Account security' },
    ];

    return (
        <div className="pt-32 pb-20 px-6 md:px-12 min-h-screen bg-white">
            <div className="container max-w-4xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Account</h1>
                        <p className="text-xs text-black/40 uppercase font-bold tracking-widest">
                            Welcome, {user?.name}
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 border border-black/10 hover:border-black py-3 px-6 text-[10px] uppercase font-bold tracking-widest transition-all"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="md:col-span-8 space-y-6">
                        <div className="bg-[#F5F5F5] p-12">
                            <h2 className="text-[10px] uppercase font-bold tracking-[0.4em] mb-8 text-black/30">Order History</h2>
                            <div className="space-y-8">
                                {[1201, 1198].map(id => (
                                    <div key={id} className="flex items-center justify-between border-b border-black/5 pb-6 last:border-0 last:pb-0">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase mb-1">Order #{id}</p>
                                            <p className="text-[9px] text-black/40 font-medium uppercase tracking-tighter">Delivered Oct 12, 2025</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-black/40">$130.00</span>
                                            <button className="text-black/20 hover:text-black transition-colors"><ChevronRight size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-4 space-y-4">
                        {menuItems.map((item, idx) => (
                            <motion.button
                                key={item.label}
                                whileHover={{ x: 5 }}
                                className="w-full flex items-center gap-6 p-6 bg-white border border-black/5 hover:border-black transition-all group"
                            >
                                <div className="w-10 h-10 flex items-center justify-center bg-[#F5F5F5] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                                    <item.icon size={18} strokeWidth={1.5} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-black tracking-widest mb-1">{item.label}</p>
                                    <p className="text-[9px] uppercase font-bold text-black/30 tracking-widest">{item.info}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
