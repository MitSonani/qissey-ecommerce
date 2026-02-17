export const NAV_LINKS = {
    HELP: "/help",
    SHOP: "/shop",
    AUTH: "/auth",
    ACCOUNT: "/account",
    SHOPPING_BAG: "/shopping-bag"
};

export const MOBILE_CATEGORIES = ['WOMAN', 'MAN', 'KIDS', 'PERFUMES', 'TRAVEL MODE'];

export const MOBILE_PROMO_ITEMS = [
    { name: 'THE ITEM', img: 'https://images.unsplash.com/photo-1539109132314-34a77bc70fe2?q=80&w=400&auto=format&fit=crop' },
    { name: 'THE NEW', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=400&auto=format&fit=crop' },
    { name: 'KNITWEAR', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=400&auto=format&fit=crop' }
];

export const MOBILE_DENSE_LINKS = [
    { label: 'The New', path: '/shop?filter=new' },
    { label: 'The Item', path: '/shop?filter=essentials' },
    { label: 'Ski Collection', path: '/shop?filter=ski' }
];

export const MOBILE_CATEGORY_LIST = [
    'JACKETS', 'COATS', 'BLAZERS', 'KNITWEAR', 'CARDIGANS | JUMPERS',
    'T-SHIRTS', 'TOPS', 'SHIRTS', 'JEANS', 'TROUSERS', 'DRESSES', 'LEATHER'
];

export const DESKTOP_NAV_CATEGORIES = [
    { label: 'Shop All', path: '/shop' },
    { label: 'New', path: '/shop?filter=new' },
    { label: 'Woman', path: '/shop?filter=woman' },
    { label: 'Man', path: '/shop?filter=man' }
];

export const FOOTER_LINKS = [
    {
        title: "Help",
        links: [
            { label: "My QISSEY Account", path: "/account" },
            { label: "Shipping", path: "/" },
            { label: "Payment and Invoices", path: "/" },
            { label: "My Purchases", path: "/" },
            { label: "Exchanges, Returns and Refunds", path: "/" },
        ]
    },
    {
        title: "Follow us",
        links: [
            { label: "Instagram", href: "#" },
            { label: "Facebook", href: "#" },
            { label: "Pinterest", href: "#" },
        ]
    },
    {
        title: "Company",
        links: [
            { label: "About us", path: "/about" },
        ]
    },
    {
        title: "Policies",
        links: [
            { label: "Privacy policy", path: "/" },
            { label: "Purchase conditions", path: "/" },
        ]
    }
];

export const HERO_SLIDES = [
    {
        id: 1,
        image: '/images/hero/hero1.png',
        mobileImage: '/images/hero/hero1.png',
        title: 'RAW MINIMAL',
        subtitle: 'Spring Summer 2026 Collection'
    },
    {
        id: 2,
        image: '/images/hero/hero2.png',
        mobileImage: '/images/hero/hero1.png',
        title: 'MODERN LINES',
        subtitle: 'Spring Summer 2026 Collection'
    },
    {
        id: 3,
        image: '/images/hero/hero3.png',
        mobileImage: '/images/hero/hero1.png',
        title: 'ETHYREAL FLOW',
        subtitle: 'Spring Summer 2026 Collection'
    }
];

export const MEASUREMENT_DATA = [
    { size: "XS", bust: "32″/81 cm", waist: "24″/61 cm", hips: "34″/86 cm", shoulder: "13.5″/34 cm" },
    { size: "S", bust: "34″/86 cm", waist: "26″/66 cm", hips: "36″/91 cm", shoulder: "14″/36 cm" },
    { size: "M", bust: "36″/91 cm", waist: "28″/71 cm", hips: "38″/97 cm", shoulder: "14.5″/37 cm" },
    { size: "L", bust: "38″/97 cm", waist: "30″/76 cm", hips: "40″/102 cm", shoulder: "15″/39 cm" },
    { size: "XL", bust: "40″/102 cm", waist: "32″/81 cm", hips: "42″/107 cm", shoulder: "15.5″/40 cm" },
];

export const PRODUCT_PAGE_TABS = ['DESCRIPTION', 'MEASUREMENTS', 'CARE', 'SHIPPING & RETURNS'];

export const SHOPPING_BAG_MESSAGES = {
    EMPTY_TITLE: "Your bag is currently empty",
    EXPLORE_ACTION: "Explore Collection",
    EXPRESS_SHIPPING: "Free Express Shipping on orders over ₹ 5,000. Delivered in 3-5 business days.",
    SECURE_PAYMENT: "Secure payment processing via major credit cards and UPI."
};

export const HOME_PAGE_TEXT = {
    LATEST_DROPS: "The Latest Drops",
    NEW_ARRIVALS: "New Arrivals",
    VIEW_COLLECTION: "view collection"
};
