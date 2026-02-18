import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ChevronRight, User } from 'lucide-react';
import { useCart } from '../features/cart';
import { useAuth } from '../features/auth';
import { cn } from '../components/ui/Primitives';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const { cart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const isHome = location.pathname === '/';
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search');
        setSearchQuery(search || '');
    }, [location.search]);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const currentParams = new URLSearchParams(location.search);
            const currentSearch = currentParams.get('search') || '';
            if (searchQuery.trim() !== currentSearch) {
                navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, location.search, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
            setIsMobileSearchOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Search Overlay - Minimalist & Inline */}
            <div className={cn(
                "fixed inset-x-0 top-0 h-16 bg-white z-[150] flex items-center px-6 md:hidden transition-all duration-300 ease-out",
                isMobileSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <form onSubmit={handleSearch} className="flex-grow w-full relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="SEARCH"
                        className="w-full h-full py-2 text-[10px] font-bold uppercase tracking-[0.1em] outline-none bg-transparent border-b border-black placeholder:text-black placeholder:opacity-40"
                        autoFocus={isMobileSearchOpen}
                        onBlur={() => {
                            if (!searchQuery.trim()) {
                                setIsMobileSearchOpen(false);
                            }
                        }}
                    />
                </form>
                <button onClick={() => setIsMobileSearchOpen(false)} className="p-2 -mr-2 ml-4">
                    <X size={20} strokeWidth={1} className="text-black" />
                </button>
            </div>

            <nav
                className={cn(
                    "fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-12",
                )}
            >
                <div className="flex items-center w-full h-16 md:h-32">

                    <div className="hidden md:flex items-center w-full h-full">
                        <div className="flex-grow flex justify-end mr-20 hidden lg:flex">
                            <div className="relative group w-64">
                                <form onSubmit={handleSearch} className="flex items-end border-b border-current pb-1 w-full opacity-60 hover:opacity-100 transition-opacity focus-within:opacity-100">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="SEARCH"
                                        className="w-full bg-transparent border-none outline-none text-[10px] font-bold tracking-[0.1em] uppercase placeholder:text-black placeholder:opacity-100"
                                    />
                                </form>
                            </div>
                        </div>

                        <div className="flex-none flex items-center gap-6 ml-auto">
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

                            <Link
                                to="/shopping-bag"
                                className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block text-black"

                            >
                                Shopping Bag ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Top Layer: Logo, Menu Toggle and Mobile Utilities (Interactive on top of overlay) */}
            <div className="fixed top-0 w-full z-[130] flex items-center px-6 md:px-12 h-16 md:h-32 pointer-events-none">
                <div className="flex items-center w-full h-full relative">
                    {/* Menu Toggle */}
                    <div className="flex-none pointer-events-auto">
                        <button
                            className="p-2 -ml-2 hover:opacity-100 transition-opacity"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <div className="relative flex flex-col items-center justify-center w-6 h-6 md:w-8 md:h-8">
                                <div className={cn(
                                    "absolute h-[1px] w-6 md:w-8 bg-black transition-all duration-500",
                                    isMobileMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5 md:-translate-y-2"
                                )} />
                                <div className={cn(
                                    "absolute h-[1px] w-6 md:w-8 bg-black transition-all duration-500",
                                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                                )} />
                                <div className={cn(
                                    "absolute h-[1px] w-6 md:w-8 bg-black transition-all duration-500",
                                    isMobileMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5 md:translate-y-2"
                                )} />
                            </div>
                        </button>
                    </div>

                    <div className={cn(
                        "flex-none pointer-events-auto transition-all duration-500",
                        "relative",
                        "md:left-0 md:translate-x-0 md:ml-10"
                    )}>
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="relative top-2 md:top-4 w-[110px] md:w-[160px] h-[40px] md:h-[80px]">
                                <img
                                    src="/logo.PNG"
                                    alt="QISSEY"
                                    style={{ filter: 'invert(1)', objectFit: 'contain' }}
                                    className="w-full h-full"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Mobile Header Utils (Log In, Search, Bag) - Far Right, Always on top on mobile */}
                    <div className={cn(
                        "flex md:hidden items-center gap-4 ml-auto transition-opacity duration-300 pointer-events-auto",
                    )}>
                        {!isAuthenticated && <Link to="/auth" className="text-[10px] font-bold uppercase tracking-widest text-black">Log In</Link>}
                        <button
                            className="p-1"
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        >
                            <Search size={18} strokeWidth={1.5} className="text-black" />
                        </button>
                        <Link to="/shopping-bag" className="p-1 relative">
                            <ShoppingBag size={18} strokeWidth={1.5} className="text-black" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[12px] h-3 text-[8px] font-bold bg-black text-white rounded-full px-0.5">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Background Overlay with Blur */}
            <div
                className={cn(
                    "fixed inset-0 z-[110] transition-all duration-500 pointer-events-none opacity-0",
                    isMobileMenuOpen && "opacity-100 pointer-events-auto bg-white/40"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className={cn(
                "fixed inset-0 z-[120] bg-white md:bg-white flex flex-col md:w-1/2",
                "transition-transform ease-[cubic-bezier(0.85,0,0.15,1)]",
                "duration-700 md:duration-500 md:ease-in-out",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Mobile Menu Header (Cleaned up: only Close icon) */}
                <div className="flex items-center h-16 px-6 shrink-0 md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -ml-2">
                        <X size={24} strokeWidth={1} className="text-black" />
                    </button>
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
