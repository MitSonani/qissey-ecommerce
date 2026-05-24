import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component
 * Dynamically manages page title, description, canonical link, Open Graph tags,
 * Twitter Cards, Pinterest rich pins, and JSON-LD schemas inside the document `<head>`.
 * Handles cleanup of page-specific tags and scripts when navigating away.
 *
 * @param {Object} props
 * @param {string} props.title - The page-specific title (appended with | QISSEY).
 * @param {string} props.description - Meta description (150-160 characters target).
 * @param {string} [props.image] - Custom Open Graph image URL.
 * @param {string} [props.type] - Page type ('website', 'product', etc. Default: 'website').
 * @param {Object|Array} [props.schema] - Custom JSON-LD schema object(s).
 * @param {Array<{name: string, item: string}>} [props.breadcrumbs] - Breadcrumb list items.
 * @param {string} [props.price] - Product price (required if type is 'product').
 * @param {string} [props.availability] - Product availability (required if type is 'product').
 */
export default function SEO({
    title,
    description,
    image,
    type = 'website',
    schema,
    breadcrumbs,
    price,
    availability = 'InStock'
}) {
    const location = useLocation();

    useEffect(() => {
        const baseTitle = 'QISSEY';
        const separator = ' | ';
        const fullTitle = title ? `${title}${separator}${baseTitle}` : baseTitle;

        // 1. Update Document Title
        document.title = fullTitle;

        // Base URL construction
        const origin = window.location.origin;
        const currentPath = location.pathname + location.search;
        const canonicalUrl = `${origin}${location.pathname}`;
        const defaultImage = `${origin}/og-image.jpg`;
        const imageUrl = image || defaultImage;

        // Keep track of dynamically created elements for cleanup
        const elementsToCleanup = [];

        // Helper: Set or update meta tags
        const setMetaTag = (attrName, attrValue, content, isDynamic = false) => {
            if (!content) return;
            let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
            
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute(attrName, attrValue);
                document.head.appendChild(tag);
                if (isDynamic) {
                    elementsToCleanup.push(tag);
                }
            }
            tag.setAttribute('content', content);
        };

        // Helper: Set or update link tags
        const setLinkTag = (rel, href) => {
            if (!href) return;
            let tag = document.querySelector(`link[rel="${rel}"]`);
            if (!tag) {
                tag = document.createElement('link');
                tag.setAttribute('rel', rel);
                document.head.appendChild(tag);
            }
            tag.setAttribute('href', href);
        };

        // 2. Set Canonical URL
        setLinkTag('canonical', canonicalUrl);

        // 3. Set Primary Meta Tags
        setMetaTag('name', 'description', description);
        setMetaTag('name', 'title', fullTitle);

        // 4. Set Open Graph (OG) Tags
        setMetaTag('property', 'og:title', fullTitle);
        setMetaTag('property', 'og:description', description);
        setMetaTag('property', 'og:image', imageUrl);
        setMetaTag('property', 'og:url', canonicalUrl);
        setMetaTag('property', 'og:type', type);
        setMetaTag('property', 'og:site_name', baseTitle);
        setMetaTag('property', 'og:image:width', '1200');
        setMetaTag('property', 'og:image:height', '630');

        // 5. Set Twitter Card Tags
        setMetaTag('name', 'twitter:card', 'summary_large_image');
        setMetaTag('name', 'twitter:title', fullTitle);
        setMetaTag('name', 'twitter:description', description);
        setMetaTag('name', 'twitter:image', imageUrl);

        // 6. Set Pinterest Domain Verification (Standard globally)
        setMetaTag('name', 'p:domain_verify', 'e32230198642bb3d83b632ffec8cfd3f');

        // 7. Dynamic Pinterest Product Tags
        if (type === 'product') {
            setMetaTag('property', 'product:price:amount', price, true);
            setMetaTag('property', 'product:price:currency', 'INR', true);
            setMetaTag('property', 'product:availability', availability === 'InStock' ? 'instock' : 'outofstock', true);
        }

        // 8. Inject Custom JSON-LD Schema
        if (schema) {
            const schemas = Array.isArray(schema) ? schema : [schema];
            schemas.forEach((s, idx) => {
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.setAttribute('data-seo-schema-id', `custom-${idx}`);
                script.textContent = JSON.stringify(s);
                document.head.appendChild(script);
                elementsToCleanup.push(script);
            });
        }

        // 9. Inject BreadcrumbList Schema
        if (breadcrumbs && breadcrumbs.length > 0) {
            const breadcrumbSchema = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                'itemListElement': breadcrumbs.map((crumb, idx) => ({
                    '@type': 'ListItem',
                    'position': idx + 1,
                    'name': crumb.name,
                    'item': crumb.path.startsWith('http') ? crumb.path : `${origin}${crumb.path}`
                }))
            };

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo-schema-id', 'breadcrumbs');
            script.textContent = JSON.stringify(breadcrumbSchema);
            document.head.appendChild(script);
            elementsToCleanup.push(script);
        }

        // Cleanup on unmount/re-render to prevent duplicate tags
        return () => {
            elementsToCleanup.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        };
    }, [title, description, image, type, schema, breadcrumbs, price, availability, location]);

    return null;
}
