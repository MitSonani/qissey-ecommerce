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
                    "fixed top-0 w-full z-[130] transition-all duration-500 flex flex-col px-6 md:px-12",
                    // !isHome ? "bg-white" : "bg-transparent"
                )}
            >
                {/* Mobile Layout (Visible only on mobile) */}
                <div className={cn(
                    "flex flex-col w-full md:hidden transition-opacity duration-300",
                    isMobileMenuOpen ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible"
                )}>
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
                            <div className="relative w-[211.44px] h-[120px]">
                                <img
                                    src="/logo.PNG"
                                    alt="QISSEY"
                                    style={{ width: '211.44px', height: '120px', filter: 'invert(1)', objectFit: 'contain' }}
                                    className="absolute left-1/2 -translate-x-1/2 top-4"
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Desktop Layout (Visible only on md screens and up) */}
                <div className={cn(
                    "hidden md:flex items-center w-full h-32 transition-opacity duration-300",
                    "opacity-100 visible"
                )}>
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
                            <div className="relative w-[211.44px] h-[120px]">
                                <img
                                    src="/logo.PNG"
                                    alt="QISSEY"
                                    style={{ width: '211.44px', height: '120px', filter: 'invert(1)', objectFit: 'contain' }}
                                    className="absolute left-0 top-4"
                                />
                            </div>
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
                                    className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black"
                                >
                                    {isAuthenticated ? user.name : "Log In"}
                                </Link>

                                <Link
                                    to="/help"
                                    className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block text-black"
                                >
                                    Help
                                </Link>

                                <button
                                    className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-100 whitespace-nowrap text-black"
                                    onClick={() => setIsCartOpen(true)}
                                >
                                    Shopping Bag ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <div className={cn(
                "fixed inset-0 z-[120] bg-white md:bg-white/70 md:backdrop-blur-xl flex flex-col md:w-1/2",
                "transition-transform ease-[cubic-bezier(0.85,0,0.15,1)]",
                "duration-700 md:duration-500 md:ease-in-out",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Mobile Menu Header (Utils - Hidden on desktop to let main navbar show through) */}
                <div className="flex items-center justify-between h-16 px-6 shrink-0 md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -ml-2">
                        <X size={24} strokeWidth={1} className="text-black" />
                    </button>
                    <div className="flex items-center gap-6">
                        <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest text-black">Log In</Link>
                        <button className="p-1"><Search size={18} strokeWidth={1} className="text-black" /></button>
                        <button onClick={() => { setIsMobileMenuOpen(false); setIsCartOpen(true); }} className="p-1">
                            <ShoppingBag size={18} strokeWidth={1} className="text-black" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content (Scrollable - zara style for mobile) */}
                <div className="flex-grow overflow-y-auto no-scrollbar md:hidden">
                    {/* Category Row (Horizontal Scroll) */}
                    <div className="flex overflow-x-auto no-scrollbar px-6 mb-12 border-b border-black/5">
                        {['WOMAN', 'MAN', 'KIDS', 'PERFUMES', 'TRAVEL MODE'].map((cat, i) => (
                            <button key={cat} className={cn(
                                "flex-none py-4 text-[11px] font-bold tracking-widest uppercase mr-6 transition-opacity",
                                i === 0 ? "opacity-100 border-b-2 border-black" : "opacity-40"
                            )}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="px-6 pb-20">
                        {/* Featured Section */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[11px] font-bold uppercase tracking-widest">New Collection</span>
                                <div className="w-4 h-px bg-black opacity-20" />
                            </div>

                            {/* Promo Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-12">
                                {[
                                    { name: 'THE ITEM', img: 'https://images.unsplash.com/photo-1539109132314-34a77bc70fe2?q=80&w=400&auto=format&fit=crop' },
                                    { name: 'THE NEW', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=400&auto=format&fit=crop' },
                                    { name: 'KNITWEAR', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=400&auto=format&fit=crop' }
                                ].map((item) => (
                                    <Link key={item.name} to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col gap-2">
                                        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-[8px] font-bold uppercase tracking-tight opacity-60">{item.name}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* Dense List Links */}
                            <div className="flex flex-col gap-2 mb-12">
                                <Link to="/shop?filter=new" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest">The New</Link>
                                <Link to="/shop?filter=essentials" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest">The Item</Link>
                                <Link to="/shop?filter=ski" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest">Ski Collection</Link>
                            </div>
                        </div>

                        {/* Category List */}
                        <div className="flex flex-col gap-4 mb-12">
                            {['JACKETS', 'COATS', 'BLAZERS', 'KNITWEAR', 'CARDIGANS | JUMPERS', 'T-SHIRTS', 'TOPS', 'SHIRTS', 'JEANS', 'TROUSERS', 'DRESSES', 'LEATHER'].map((cat) => (
                                <Link key={cat} to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
                                    {cat}
                                </Link>
                            ))}
                        </div>

                        {/* Bottom Links */}
                        <div className="flex flex-col gap-4 pt-12 border-t border-black/5">
                            <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest opacity-40">My Account</Link>
                            <Link to="/help" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest opacity-40">Contact Us</Link>
                        </div>
                    </div>
                </div>

                {/* Desktop Menu Content (Original Minimalist Style) */}
                <div className="hidden md:flex flex-col gap-6 p-12 pt-48 flex-grow overflow-y-auto">
                    <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black tracking-tighter uppercase opacity-80 hover:opacity-100 transition-opacity">Shop All</Link>
                    <Link to="/shop?filter=new" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black tracking-tighter uppercase opacity-80 hover:opacity-100 transition-opacity">New</Link>
                    <Link to="/shop?filter=woman" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black tracking-tighter uppercase opacity-80 hover:opacity-100 transition-opacity">Woman</Link>
                    <Link to="/shop?filter=man" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-display font-black tracking-tighter uppercase opacity-80 hover:opacity-100 transition-opacity">Man</Link>

                    <div className="mt-auto flex flex-col gap-4 pt-10 border-t border-black/5">
                        <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-widest opacity-60">My Account</Link>
                        <Link to="/help" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-widest opacity-60">Contact Us</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
