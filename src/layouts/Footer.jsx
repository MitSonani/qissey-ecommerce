import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
    {
        title: "Help",
        links: [
            { label: "My QISSEY Account", path: "/account?tab=details" },
            { label: "Shipping Policy", path: "/shipping-policy" },
            { label: "Payment and Invoices", path: "/payment-policy" },
            { label: "My Purchases", path: "/account?tab=purchases" },
            { label: "Exchanges, Returns and Refunds", path: "/return-policy" },
        ]
    },
    {
        title: "Follow us",
        links: [
            { label: "Instagram", href: "https://www.instagram.com/qissey.shop/", },
            { label: "Facebook", href: "https://www.facebook.com/people/Qissey/61586697613049", },
        ]
    },
    {
        title: "Company",
        links: [
            { label: "About us", path: "/about" },
            { label: "Contact us", path: "/contact" },
            { label: "New Arrivals", path: "/new-arrivals" },
        ]
    },
    {
        title: "Policies",
        links: [
            { label: "Privacy policy", path: "/privacy-policy" },
            { label: "Purchase conditions", path: "/purchase-conditions" },
        ]
    }
];

export default function Footer() {
    return (
        <footer className="bg-white text-black pt-16 md:pt-24 pb-12 px-6 md:px-20 md:mx-30">
            <div className="container-fluid">
                {/* Main Link Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
                    {FOOTER_LINKS.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-6">
                            <p className="text-[14px] uppercase mb-4 font-bold">{group.title}</p>
                            <ul className="space-y-2 text-[12px] uppercase">
                                {group.links.map((link, linkIdx) => (
                                    <p key={linkIdx} className='text-grey'>
                                        {link.path ? (
                                            <Link to={link.path} className="hover:underline">{link.label}</Link>
                                        ) : (
                                            <a href={link.href} className="hover:underline">{link.label}</a>
                                        )}
                                    </p>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>


                <div className="flex text-[10px] items-center gap-12 text-black/40 uppercase">
                    <span>© {new Date().getFullYear()} All rights reserved</span>
                </div>

            </div>
        </footer>
    );
}
