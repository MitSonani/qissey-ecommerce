import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ChevronRight, User } from 'lucide-react';
import { useCart } from '../features/cart';
import { useAuth } from '../features/auth';
import { cn } from '../components/ui/Primitives';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cart, setIsCartOpen } = useCart();
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Shop All', path: '/shop' },
        { name: 'New Arrivals', path: '/shop?filter=new' },
        { name: 'Essentials', path: '/shop?filter=essentials' },
        { name: 'Collections', path: '/#collections' },
    ];

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 w-full z-[80] transition-all duration-500 h-20 flex items-center justify-between px-6 md:px-12",
                    isScrolled || !isHome ? "bg-white border-b border-black/5" : "bg-transparent text-white"
                )}
            >
                <div className="flex items-center gap-8">
                    <button
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <Link to="/" className="text-2xl font-display font-black uppercase tracking-tighter">
                        QISSEY
                    </Link>

                    <div className="hidden md:flex gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-[11px] uppercase font-bold tracking-[0.2em] opacity-70 hover:opacity-100 transition-opacity"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button className="opacity-70 hover:opacity-100 transition-opacity hidden md:block">
                        <Search size={20} strokeWidth={1.5} />
                    </button>

                    <Link
                        to={isAuthenticated ? "/account" : "/auth"}
                        className="flex items-center gap-2 group opacity-70 hover:opacity-100 transition-opacity"
                    >
                        <User size={20} strokeWidth={1.5} />
                        <span className="text-[11px] font-bold uppercase tracking-widest hidden lg:block">
                            {isAuthenticated ? user.name : "Login"}
                        </span>
                    </Link>

                    <button
                        className="relative flex items-center gap-2 group"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag size={22} strokeWidth={1.5} />
                        <span className="text-[11px] font-bold uppercase tracking-widest hidden md:block">
                            Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                        </span>
                        <span className="md:hidden absolute -top-1 -right-1 bg-brand-charcoal text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {cart.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={cn(
                "fixed inset-0 z-[100] bg-white transition-transform duration-500 md:hidden",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between h-20 px-6 border-b border-black/5">
                    <span className="font-display font-black uppercase tracking-tighter text-xl">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
                </div>
                <div className="p-8 flex flex-col gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-3xl font-display font-bold uppercase flex items-center justify-between group"
                        >
                            {link.name}
                            <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
