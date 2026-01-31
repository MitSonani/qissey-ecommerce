import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

/**
 * PageTitle Component
 * Dynamically updates the document title based on the current route.
 */
const PageTitle = () => {
    const location = useLocation();
    const params = useParams();

    useEffect(() => {
        const baseTitle = "QISSEY";
        const separator = " | ";
        let pageTitle = "";

        const path = location.pathname;

        if (path === "/") {
            pageTitle = "Refined Minimalist Fashion & Design Studio";
        } else if (path === "/shop") {
            pageTitle = "Shop All";
        } else if (path.startsWith("/product/")) {
            // In a real app, you'd fetch the product name. 
            // For now, we'll use a placeholder or ID.
            pageTitle = "Product Details";
        } else if (path === "/auth") {
            pageTitle = "Account Access";
        } else if (path === "/account") {
            pageTitle = "My Account";
        } else {
            pageTitle = "404 Not Found";
        }

        document.title = `${pageTitle}${separator}${baseTitle}`;
    }, [location, params]);

    return null;
};

export default PageTitle;
