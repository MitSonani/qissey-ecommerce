import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTitle Component
 * Dynamically updates the document title based on the current route for fallback pages.
 * Public, customer-facing pages are handled by the SEO component.
 */
const PageTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const baseTitle = "QISSEY";
        const separator = " | ";
        let pageTitle = "";

        const path = location.pathname;

        // Only manage internal/account routes here. 
        // Public pages (Home, Shop, Collections, Product, Policies) are managed by <SEO />.
        if (path === "/shopping-bag") {
            pageTitle = "Shopping Bag";
        } else if (path === "/saved-products") {
            pageTitle = "Saved Products";
        } else if (path === "/auth") {
            pageTitle = "Account Access";
        } else if (path === "/account") {
            pageTitle = "My Account";
        } else if (path.startsWith("/account/order/")) {
            pageTitle = "Order Details";
        } else {
            // Ignore public pages managed by <SEO /> to prevent race conditions
            return;
        }

        document.title = `${pageTitle}${separator}${baseTitle}`;
    }, [location]);

    return null;
};

export default PageTitle;

