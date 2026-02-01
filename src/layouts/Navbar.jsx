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

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 w-full z-[110] transition-all duration-500 flex flex-col px-6 md:px-12",
                    isScrolled || !isHome ? "bg-white" : "bg-transparent"
                )}
            >
                {/* Mobile Layout (Visible only on mobile) */}
                <div className="flex flex-col w-full md:hidden">
                    {/* Mobile Row 1: Utils */}
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-none">
                            <button
                                className="p-2 -ml-2"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <div className="relative flex flex-col items-center justify-center w-6 h-6">
                                    <div className={cn(
                                        "absolute h-[1px] w-6 bg-black transition-all duration-500",
                                        isMobileMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
                                    )} />
                                    <div className={cn(
                                        "absolute h-[1px] w-6 bg-black transition-all duration-500",
                                        isMobileMenuOpen ? "opacity-0" : "opacity-100"
                                    )} />
                                    <div className={cn(
                                        "absolute h-[1px] w-6 bg-black transition-all duration-500",
                                        isMobileMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
                                    )} />
                                </div>
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/auth" className="text-[10px] font-bold uppercase tracking-widest text-black">Log In</Link>
                            <button className="p-1"><Search size={18} strokeWidth={1.5} className="text-black" /></button>
                            <button onClick={() => setIsCartOpen(true)} className="p-1 relative">
                                <ShoppingBag size={18} strokeWidth={1.5} className="text-black" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[12px] h-3 text-[8px] font-bold bg-black text-white rounded-full px-0.5">
                                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                    {/* Mobile Row 2: Logo */}
                    <div className="flex justify-center pb-6">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                            <span className="font-display text-[54px] font-black tracking-[-0.18em] uppercase leading-none select-none text-black">
                                Qissey
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Desktop Layout (Visible only on md screens and up) */}
                <div className="hidden md:flex items-center w-full h-24">
                    {/* Left: Menu */}
                    <div className="flex-none">
                        <button
                            className="p-2 -ml-2 hover:opacity-100 transition-opacity"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <div className="relative flex flex-col items-center justify-center w-8 h-8">
                                <div className={cn(
                                    "absolute h-[1px] w-8 bg-current transition-all duration-500",
                                    isMobileMenuOpen ? "rotate-45 translate-y-0 text-black" : "-translate-y-2"
                                )} />
                                <div className={cn(
                                    "absolute h-[1px] w-8 bg-current transition-all duration-500",
                                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                                )} />
                                <div className={cn(
                                    "absolute h-[1px] w-8 bg-current transition-all duration-500",
                                    isMobileMenuOpen ? "-rotate-45 translate-y-0 text-black" : "translate-y-2"
                                )} />
                            </div>
                        </button>
                    </div>

                    {/* Left-Center: Logo */}
                    <div className="flex-none ml-10">
                        <Link to="/" className="flex items-center">
                            <span className="font-display text-4xl md:text-5xl font-black tracking-[-0.15em] uppercase leading-none select-none text-black">
                                Qissey
                            </span>
                        </Link>
                    </div>

                    {/* Spacer / Right-Center: Search */}
                    <div className="flex-grow flex justify-end mr-20 hidden lg:flex">
                        {!isMobileMenuOpen && (
                            <div className="relative group w-64">
                                <div className="flex items-end border-b border-current pb-1 w-full opacity-60 hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase">Search</span>
                                    <div className="flex-grow" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex-none flex items-center gap-6 ml-auto">
                        {!isMobileMenuOpen && (
                            <>
                                <Link
                                    to={isAuthenticated ? "/account" : "/auth"}
                                    className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-inherit"
                                >
                                    {isAuthenticated ? user.name : "Log In"}
                                </Link>

                                <Link
                                    to="/help"
                                    className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block text-inherit"
                                >
                                    Help
                                </Link>

                                <button
                                    className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-100 whitespace-nowrap text-inherit"
                                    onClick={() => setIsCartOpen(true)}
                                >
                                    Shopping Bag ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={cn(
                "fixed inset-0 z-[100] bg-white transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] md:w-[400px]",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between h-24 px-6 md:px-12 border-b border-black/5">
                    {/* Header cleared to let the Navbar's "X" show through */}
                </div>
                <div className="p-10 flex flex-col gap-6">
                    <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black tracking-tighter uppercase opacity-80 hover:opacity-100 transition-opacity">Shop All</Link>
                    <Link to="/shop?filter=new" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black tracking-tighter uppercase opacity-80 hover:opacity-100 transition-opacity">New</Link>
                    <Link to="/shop?filter=woman" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black tracking-tighter uppercase opacity-80 hover:opacity-100 transition-opacity">Woman</Link>
                    <Link to="/shop?filter=man" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black tracking-tighter uppercase opacity-80 hover:opacity-100 transition-opacity">Man</Link>
                    <div className="h-px bg-black/10 my-4" />
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-widest opacity-60">My Account</Link>
                    <Link to="/help" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-widest opacity-60">Contact Us</Link>
                </div>
            </div>
        </>
    );
}
