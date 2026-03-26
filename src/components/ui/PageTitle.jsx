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
        } else if (path === "/new-arrivals") {
            pageTitle = "New Arrivals";
        } else if (path.startsWith("/collection/")) {
            pageTitle = "Collection";
        } else if (path.startsWith("/product/")) {
            pageTitle = "Product Details";
        } else if (path === "/shopping-bag") {
            pageTitle = "Shopping Bag";
        } else if (path === "/saved-products") {
            pageTitle = "Saved Products";
        } else if (path === "/contact") {
            pageTitle = "Contact Us";
        } else if (path === "/shipping-policy") {
            pageTitle = "Shipping & Delivery";
        } else if (path === "/payment-policy") {
            pageTitle = "Payment & Invoices";
        } else if (path === "/return-policy") {
            pageTitle = "Returns & Exchanges";
        } else if (path === "/privacy-policy") {
            pageTitle = "Privacy Policy";
        } else if (path === "/purchase-conditions") {
            pageTitle = "Purchase Conditions";
        } else if (path === "/about") {
            pageTitle = "About Us";
        } else if (path === "/auth") {
            pageTitle = "Account Access";
        } else if (path === "/account") {
            pageTitle = "My Account";
        } else if (path.startsWith("/account/order/")) {
            pageTitle = "Order Details";
        } else {
            pageTitle = "404 Not Found";
        }

        document.title = `${pageTitle}${separator}${baseTitle}`;
    }, [location]);

    return null;
};

export default PageTitle;
