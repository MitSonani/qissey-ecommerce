import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ChevronRight, User } from 'lucide-react';
import { useCart } from '../features/cart';
import { useAuth } from '../features/auth';
import { fetchAllCollections } from '../features/products/services/productService';
import { cn } from '../components/ui/Primitives';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const { cart } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [collections, setCollections] = useState([]);
    const [newArrivalsCollection, setNewArrivalsCollection] = useState(null);

    useEffect(() => {
        const loadCollections = async () => {
            try {
                const data = await fetchAllCollections();
                const newArrivals = data.find(c => c.name.toLowerCase() == 'new arrival');
                setNewArrivalsCollection(newArrivals);
                setCollections(data.filter(c => c.name.toLowerCase() !== 'new arrival'));
            } catch (error) {
                console.error('Error fetching collections for navbar:', error);
            }
        };
        loadCollections();
    }, []);

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
            {/* Elegant Announcement Bar */}
            <div className="fixed top-0 inset-x-0 h-[28px] bg-neutral-950 text-white flex items-center justify-center z-[200]">
                <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-200">
                    Enjoy 5% off on prepaid orders
                </p>
            </div>

            {/* Mobile Search Overlay - Minimalist & Inline */}
            <div className={cn(
                "fixed inset-x-0 top-[28px] h-16 bg-white z-[150] flex items-center px-6 md:hidden transition-all duration-300 ease-out",
                isMobileSearchOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-full"
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
                    "fixed top-[28px] w-full z-[100] transition-all duration-500 px-6 md:px-12",
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
                            {isAuthenticated ? (
                                <Link to="/account" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black h-8">
                                    <User size={14} className="mb-0.5" />
                                    {user?.user_metadata?.name?.split(' ')[0] || user?.name?.split(' ')[0] || "Account"}
                                </Link>
                            ) : (
                                <Link
                                    to="/auth"
                                    state={{ from: location }}
                                    className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap text-black"
                                >
                                    Log In
                                </Link>
                            )}

                            <Link
                                to="/contact"
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
            <div className="fixed top-[28px] w-full z-[130] flex items-center px-6 md:px-12 h-16 md:h-32 pointer-events-none">
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
                        {!isAuthenticated ? (
                            <Link to="/auth" state={{ from: location }} className="text-[10px] font-bold uppercase tracking-widest text-black">Log In</Link>
                        ) : (
                            <Link to="/account" className="p-1">
                                <User size={18} strokeWidth={1.5} className="text-black" />
                            </Link>
                        )}
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
                {/* Mobile Menu Header (Cleaned up: no duplicate close icon) */}
                <div className="h-16 shrink-0 md:hidden" />

                {/* Mobile Menu Content (Scrollable - zara style for mobile) */}
                <div className="flex-grow overflow-y-auto no-scrollbar md:hidden">


                    <div className="px-6 pb-20 mt-10">
                        {/* Featured Section */}
                        <div className="mb-12">
                            {/* Horizontal Banner: New Arrivals (Dynamic) */}
                            <div className="flex flex-col gap-8">
                                {newArrivalsCollection && (
                                    <Link
                                        to={`/new-arrivals`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="group relative w-full aspect-[16/7] overflow-hidden bg-gray-100"
                                    >
                                        <img
                                            src={Array.isArray(newArrivalsCollection.image_url) ? newArrivalsCollection.image_url[0] : (newArrivalsCollection.image_url?.includes(',') ? newArrivalsCollection.image_url.split(',')[0] : newArrivalsCollection.image_url)}
                                            alt={newArrivalsCollection.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <h3 className="text-2xl font-display font-black text-white tracking-[0.2em] uppercase drop-shadow-lg">{newArrivalsCollection.name}</h3>
                                        </div>
                                    </Link>
                                )}

                                {/* 2-2 Vertical Banner Grid: Collections (Dynamic) */}
                                <div className="grid grid-cols-2 gap-3">
                                    {collections?.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            to={`/collection/${cat.id}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="group relative aspect-[9/14] overflow-hidden bg-gray-50"
                                        >
                                            <img
                                                src={Array.isArray(cat.image_url) ? cat.image_url[0] : (cat.image_url?.includes(',') ? cat.image_url.split(',')[0] : cat.image_url)}
                                                alt={cat.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                                            <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                                                <h4 className="text-[14px] font-display font-black text-white tracking-widest uppercase drop-shadow-md">{cat.name}</h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>


                        {/* Bottom Links */}
                        <div className="flex flex-col gap-4 pt-12 border-t border-black/5">
                            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest opacity-40">View All</Link>
                            {isAuthenticated ? (
                                <>

                                </>
                            ) : (
                                <Link to="/auth" state={{ from: location }} onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest opacity-40">Log In</Link>
                            )}
                            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] font-bold uppercase tracking-widest opacity-40">Contact Us</Link>
                        </div>
                    </div>
                </div>

                {/* Desktop Menu Content (Bannered Style) */}
                <div className="hidden md:flex flex-col gap-8 p-12 pt-48 flex-grow overflow-y-auto no-scrollbar">
                    {/* Horizontal Banner: New Arrivals (Dynamic) */}
                    <div className="flex flex-col gap-8">
                        {newArrivalsCollection && (
                            <Link
                                to={`/new-arrivals`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="group relative w-full aspect-[16/4.5] overflow-hidden bg-gray-100"
                            >
                                <img
                                    src={Array.isArray(newArrivalsCollection.image_url) ? newArrivalsCollection.image_url[0] : (newArrivalsCollection.image_url?.includes(',') ? newArrivalsCollection.image_url.split(',')[0] : newArrivalsCollection.image_url)}
                                    alt={newArrivalsCollection.name}
                                    className="w-full h-full  object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-4xl font-display font-black text-white uppercase drop-shadow-lg">{newArrivalsCollection.name}</p>
                                </div>
                            </Link>
                        )}

                        {/* 2-2 Vertical Banner Grid: Collections (Dynamic) */}
                        <div className="grid grid-cols-2 gap-3">
                            {collections?.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/collection/${cat.id}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="group relative aspect-[3/3.5] overflow-hidden bg-gray-50"
                                >
                                    <img
                                        src={Array.isArray(cat.image_url) ? cat.image_url[0] : (cat.image_url?.includes(',') ? cat.image_url.split(',')[0] : cat.image_url)}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                                    <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                                        <p className="text-[16px] font-display font-black text-white tracking-widest uppercase drop-shadow-md">{cat.name}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col gap-4 pt-10 border-t border-black/5">
                            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">View All</Link>
                            {isAuthenticated ? (
                                <></>
                            ) : (
                                <Link to="/auth" state={{ from: location }} onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-widest opacity-60">Log In</Link>
                            )}
                            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-[11px] font-bold uppercase tracking-widest opacity-60">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
