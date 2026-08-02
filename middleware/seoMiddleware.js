import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

export default async function seoMiddleware(req, res, next) {
    // Canonical Redirect: www.qissey.com → qissey.com (always HTTPS)
    const host = req.headers.host;
    if (host && host.startsWith('www.')) {
        const newHost = host.slice(4);
        return res.redirect(301, `https://${newHost}${req.originalUrl}`);
    }

    // Only intercept GET requests
    if (req.method !== 'GET') {
        return next();
    }

    const urlPath = req.path;

    // Skip API routes and static asset files (anything containing a dot or starting with /api)
    if (urlPath.startsWith('/api') || urlPath.includes('.')) {
        return next();
    }

    // Identify paths to pre-render
    const isHomepage = urlPath === '/';
    const isProduct = urlPath.startsWith('/product/');
    const isCollection = urlPath.startsWith('/collection/');
    const isNewArrivals = urlPath === '/new-arrivals';
    const isShop = urlPath === '/shop';
    const isStaticPage = [
        '/about',
        '/faq',
        '/contact',
        '/shipping-policy',
        '/return-policy',
        '/privacy-policy',
        '/payment-policy',
        '/purchase-conditions',
        '/sitemap'
    ].includes(urlPath);

    if (!isHomepage && !isProduct && !isCollection && !isNewArrivals && !isShop && !isStaticPage) {
        return next();
    }

    try {
        const indexPath = path.join(distPath, 'index.html');
        if (!fs.existsSync(indexPath)) {
            return next(); // Fallback if dist hasn't been built yet
        }

        let html = fs.readFileSync(indexPath, 'utf-8');

        // Dynamic elements to generate
        let title = 'Refined Minimalist Fashion & Design Studio';
        let description = 'QISSEY - A creative studio focusing on the intersection of design, culture, and sustainable minimalist fashion.';
        let ogImage = 'https://qissey.com/og-image.jpg';
        let type = 'website';
        let bodyHtml = '';
        let schemas = [];
        let breadcrumbs = [];

        // Base schemas (Organization & Website)
        const organizationSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://qissey.com/#organization',
            'name': 'QISSEY',
            'alternateName': 'QISSEY Creative Studio',
            'url': 'https://qissey.com',
            'logo': 'https://qissey.com/logo.PNG',
            'description': 'Refined minimalist fashion studio based in India, specializing in sustainable luxury clothing for women.',
            'foundingDate': '2024',
            'sameAs': [
                'https://www.instagram.com/qissey._/',
                'https://www.facebook.com/people/Qissey/61586697613049/'
            ]
        };

        const websiteSchema = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': 'https://qissey.com/#website',
            'name': 'QISSEY',
            'url': 'https://qissey.com',
            'potentialAction': {
                '@type': 'SearchAction',
                'target': 'https://qissey.com/shop?q={search_term_string}',
                'query-input': 'required name=search_term_string'
            }
        };

        schemas.push(organizationSchema, websiteSchema);

        // Fetch dynamic categories/collections for the Navbar to ensure complete discoverability
        const { data: navbarCollections } = await supabaseAdmin
            .from('collections')
            .select('id, name')
            .order('created_at', { ascending: false });

        const navbarHtml = `
            <div class="announcement-bar" style="background-color: #0a0a0a; color: #fff; text-align: center; padding: 6px 0; font-size: 9px; text-transform: uppercase; letter-spacing: 0.25em; font-weight: 300;">
                Enjoy 5% off on prepaid orders
            </div>
            <header class="site-header">
                <nav class="navigation-menu" aria-label="Main Navigation">
                    <a href="/" class="brand-logo">QISSEY</a>
                    <div class="nav-links">
                        <a href="/shop">Shop All</a>
                        <a href="/new-arrivals">New Arrivals</a>
                        ${navbarCollections ? navbarCollections.filter(c => c.name.toLowerCase() !== 'new arrival').map(c => `
                            <a href="/collection/${c.id}">${c.name}</a>
                        `).join('\n') : ''}
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/faq">FAQ</a>
                    </div>
                </nav>
            </header>
        `;

        const footerHtml = `
            <footer class="site-footer">
                <div class="footer-links">
                    <a href="/shipping-policy">Shipping Policy</a>
                    <a href="/return-policy">Return Policy</a>
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/payment-policy">Payment Policy</a>
                    <a href="/purchase-conditions">Conditions of Purchase</a>
                    <a href="/sitemap">Sitemap</a>
                </div>
                <div class="footer-copy">
                    <p>&copy; ${new Date().getFullYear()} QISSEY. All rights reserved.</p>
                </div>
            </footer>
        `;

        if (isHomepage) {
            // Fetch hero slides
            const { data: heroSlides } = await supabaseAdmin
                .from('hero_slides')
                .select('*')
                .eq('is_active', true)
                .order('order_index', { ascending: true });

            // Fetch products (new arrivals)
            const { data: newArrivals } = await supabaseAdmin
                .from('products')
                .select(`id, name, slug, price, description, product_variants(id, image_urls, is_primary)`)
                .eq('product_variants.is_primary', true)
                .eq('new_arrival', true)
                .order('created_at', { ascending: false })
                .limit(6);

            // Fetch collections
            const { data: collections } = await supabaseAdmin
                .from('collections')
                .select('*')
                .order('created_at', { ascending: false });

            const filteredCollections = collections ? collections.filter(c => c.name.toLowerCase() !== 'new arrival') : [];

            // Fetch reviews
            const { data: reviews } = await supabaseAdmin
                .from('product_reviews')
                .select(`id, rating, comment, user_name, products(name, slug)`)
                .order('created_at', { ascending: false })
                .eq('status', 'approved')
                .limit(6);

            title = 'Refined Minimalist Fashion | Sustainable Luxury Clothing';
            description = 'Discover QISSEY — a refined minimalist fashion studio in India. Sustainable luxury clothing for women. Shop elegant tops, dresses, and formal wear crafted with care.';

            bodyHtml = `
                <div class="home-page-container">
                    ${navbarHtml}
                    <main id="main-content">
                        <h1>Refined Minimalist Fashion for the Modern Woman — QISSEY</h1>
                        
                        ${heroSlides && heroSlides.length > 0 ? `
                        <section class="hero-section">
                            <div class="hero-slider">
                                ${heroSlides.map((slide, idx) => `
                                    <div class="hero-slide ${idx === 0 ? 'active' : ''}">
                                        <a href="${slide.link_url || '/shop'}">
                                            <img src="${slide.desktop_image_url}" alt="QISSEY Creative Studio — ${slide.title || 'Sustainable minimalist luxury clothing'} — ${slide.subtitle || 'Shop the collection'}" loading="${idx === 0 ? 'eager' : 'lazy'}" ${idx === 0 ? 'fetchpriority="high"' : ''} />
                                            ${(slide.title || slide.subtitle) ? `
                                                <div class="slide-caption">
                                                    <h2>${slide.title || ''}</h2>
                                                    <p>${slide.subtitle || ''}</p>
                                                </div>
                                            ` : ''}
                                        </a>
                                    </div>
                                `).join('\n')}
                            </div>
                        </section>
                        ` : `
                        <section class="hero-section">
                            <div class="hero-content">
                                <h2>QISSEY CREATIVE STUDIO</h2>
                                <p>Blending architectural shapes with refined luxury materials.</p>
                                <a href="/shop" class="cta-button">Shop the Collection</a>
                            </div>
                        </section>
                        `}

                        ${newArrivals && newArrivals.length > 0 ? `
                        <section class="new-arrivals-section">
                            <div class="section-header">
                                <span>The Latest Drops</span>
                                <h2>New Arrivals</h2>
                                <a href="/new-arrivals">View All</a>
                            </div>
                            <div class="product-grid">
                                ${newArrivals.map(prod => {
                const image = prod.product_variants?.[0]?.image_urls?.[0] || '/logo.PNG';
                const altText = `QISSEY ${prod.name} — ${prod.description ? prod.description.substring(0, 100).replace(/"/g, '&quot;') : 'Premium minimalist designer clothing'}`;
                return `
                                        <article class="product-card">
                                            <a href="/product/${prod.slug || prod.id}">
                                                <img src="${image}" alt="${altText}" loading="lazy" />
                                                <h3>${prod.name}</h3>
                                                <p class="price">₹ ${prod.price ? prod.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</p>
                                            </a>
                                        </article>
                                    `;
            }).join('')}
                            </div>
                        </section>
                        ` : ''}

                        ${filteredCollections.length > 0 ? `
                        <section class="collections-section">
                            <h2>Featured Collections</h2>
                            <div class="collections-grid">
                                ${filteredCollections.map(coll => `
                                    <div class="collection-tile">
                                        <a href="/collection/${coll.id}">
                                            <img src="${coll.image_url || '/logo.PNG'}" alt="${coll.name} collection by QISSEY — ${coll.description ? coll.description.substring(0, 100).replace(/"/g, '&quot;') : 'sustainable designer clothing curation'}" loading="lazy" />
                                            <div class="tile-overlay">
                                                <h3>${coll.name}</h3>
                                                <span>View Collection</span>
                                            </div>
                                        </a>
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}

                        ${reviews && reviews.length > 0 ? `
                        <section class="testimonials-section">
                            <span>Loved by Our Customers</span>
                            <h2>What They Say</h2>
                            <div class="reviews-slider">
                                ${reviews.map(rev => `
                                    <blockquote class="review-item">
                                        <div class="rating-stars">${'&#9733;'.repeat(rev.rating)}</div>
                                        <p class="comment">"${rev.comment}"</p>
                                        <cite class="author">— ${rev.user_name} ${rev.products ? `on <a href="/product/${rev.products.slug}">${rev.products.name}</a>` : ''}</cite>
                                    </blockquote>
                                `).join('')}
                            </div>
                        </section>
                        ` : ''}
                    </main>
                    ${footerHtml}
                </div>
            `;
        } else if (isProduct) {
            const slug = urlPath.replace('/product/', '');
            const { data: product } = await supabaseAdmin
                .from('products')
                .select(`*, product_variants(*, color_id(*)), complete_the_look, product_collections(collection_id)`)
                .eq('slug', slug)
                .single();

            if (product) {
                type = 'product';
                title = product.name;
                description = product.description || `Shop ${product.name} at QISSEY. Premium minimalist fashion for women.`;
                const primaryVariant = product.product_variants?.find(v => v.is_primary) || product.product_variants?.[0];
                ogImage = primaryVariant?.image_urls?.[0] || ogImage;

                const productSchema = {
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    '@id': `https://qissey.com/product/${product.slug}#product`,
                    'name': product.name,
                    'description': product.description,
                    'sku': product.sku || product.id,
                    'brand': { '@type': 'Brand', 'name': 'QISSEY' },
                    'image': primaryVariant?.image_urls || [],
                    'offers': {
                        '@type': 'Offer',
                        'url': `https://qissey.com/product/${product.slug}`,
                        'priceCurrency': 'INR',
                        'price': product.price,
                        'availability': 'https://schema.org/InStock',
                        'itemCondition': 'https://schema.org/NewCondition'
                    }
                };
                schemas.push(productSchema);

                let collectionName = 'Shop';
                let collectionId = '';
                const collAssoc = product.product_collections?.[0]?.collection_id;
                if (collAssoc) {
                    const { data: collData } = await supabaseAdmin
                        .from('collections')
                        .select('name, id')
                        .eq('id', collAssoc)
                        .single();
                    if (collData) {
                        collectionName = collData.name;
                        collectionId = collData.id;
                    }
                }

                breadcrumbs = [
                    { name: 'Home', path: '/' },
                    { name: collectionName, path: collectionId ? `/collection/${collectionId}` : '/shop' },
                    { name: product.name, path: `/product/${product.slug}` }
                ];

                bodyHtml = `
                    <div class="product-page-container">
                        ${navbarHtml}
                        <main id="main-content">
                            <nav class="breadcrumbs" aria-label="Breadcrumb">
                                <a href="/">Home</a> &gt; 
                                <a href="${collectionId ? `/collection/${collectionId}` : '/shop'}">${collectionName}</a> &gt; 
                                <span aria-current="page">${product.name}</span>
                            </nav>
                            
                            <article class="product-details-layout">
                                <div class="product-gallery">
                                    ${primaryVariant?.image_urls?.map((url, idx) => {
                    const altText = `QISSEY ${product.name} — view ${idx + 1} — ${product.description ? product.description.substring(0, 100).replace(/"/g, '&quot;') : 'Premium sustainable minimalist luxury designer fashion clothing'}`;
                    return `<img src="${url}" alt="${altText}" ${idx > 0 ? 'loading="lazy"' : ''} />`;
                }).join('\n') || `<img src="/logo.PNG" alt="${product.name} — sustainable minimalist luxury designer fashion clothing" />`}
                                </div>
                                
                                <div class="product-meta-panel">
                                    <h1>${product.name}</h1>
                                    <p class="price-tag">₹ ${product.price ? product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</p>
                                    
                                    <div class="product-description-content">
                                        <p>${product.description || ''}</p>
                                        ${product.details ? `
                                            <div class="product-details-list">
                                                <h4>Details & Care</h4>
                                                <p>${product.details}</p>
                                            </div>
                                        ` : ''}
                                    </div>

                                    <div class="available-sizes">
                                        <h3>Select Size</h3>
                                        <ul class="sizes-list">
                                            ${product.product_variants?.map(v => v.size).filter((v, i, a) => v && a.indexOf(v) === i).map(s => `
                                                <li>${s}</li>
                                            `).join('\n') || ''}
                                        </ul>
                                    </div>

                                    <div class="product-composition-care">
                                        <h3>Composition & Care Guide</h3>
                                        <p><strong>Composition:</strong> Premium fabric crafted for lasting comfort, durability, and everyday elegant wear.</p>
                                        <p><strong>Care Instructions:</strong></p>
                                        <ul>
                                            <li>Machine wash at max. 30ºC/86ºF</li>
                                            <li>Do not use bleach</li>
                                            <li>Iron at a maximum of 110ºC/230ºF</li>
                                            <li>Use mild detergent</li>
                                            <li>Tumble dry low or hang to dry</li>
                                        </ul>
                                    </div>

                                    <div class="product-shipping-returns">
                                        <h3>Shipping & Returns Policy</h3>
                                        <p><strong>Shipping:</strong> Standard delivery within 7-10 business days. Free delivery at any location. Cash on delivery is available.</p>
                                        <p><strong>Returns & Exchanges:</strong> You can request a return or exchange within 10 days of delivery, as long as the item is unused and in its original condition. Please note: Custom size products are not eligible for return or exchange.</p>
                                    </div>
                                </div>
                            </article>
                        </main>
                        ${footerHtml}
                    </div>
                `;
            }
        } else if (isCollection) {
            const id = urlPath.replace('/collection/', '');
            const { data: collection } = await supabaseAdmin
                .from('collections')
                .select('*')
                .eq('id', id)
                .single();

            if (collection) {
                // Dynamic fallback descriptions for categories
                let collDesc = collection.description;
                if (!collDesc || collDesc.trim() === '') {
                    const descMap = {
                        'formals': 'A curation of architectural, tailored luxury formal wear designed for clean structure and elegant proportions.',
                        'tops': 'Refined minimalist tops and shirts featuring sculptural silhouettes, delicate gathers, and premium natural materials.',
                        'bottoms': 'Sleek tailored trousers, casual shorts, and flowing maxi skirts crafted for comfortable fit and architectural lines.',
                        'dresses': 'Sculptural luxury midi and maxi dresses blending structural draping, delicate halter straps, and sustainable fabrics.'
                    };
                    collDesc = descMap[collection.name.toLowerCase()] || `Browse our exclusive collection of ${collection.name} at QISSEY. Premium minimalist fashion for women.`;
                }

                title = collection.name;
                description = collDesc;
                ogImage = collection.image_url || ogImage;

                const collectionSchema = {
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    '@id': `https://qissey.com/collection/${collection.id}#collection`,
                    'name': `${collection.name} — QISSEY`,
                    'description': description,
                    'url': `https://qissey.com/collection/${collection.id}`,
                    'image': collection.image_url || ''
                };
                schemas.push(collectionSchema);

                breadcrumbs = [
                    { name: 'Home', path: '/' },
                    { name: collection.name, path: `/collection/${collection.id}` }
                ];

                const { data: products } = await supabaseAdmin
                    .from('products')
                    .select(`id, name, slug, price, description, product_variants(id, image_urls, is_primary), product_collections!inner(collection_id)`)
                    .eq('product_collections.collection_id', id)
                    .eq('product_variants.is_primary', true)
                    .order('created_at', { ascending: false });

                bodyHtml = `
                    <div class="collection-page-container">
                        ${navbarHtml}
                        <main id="main-content">
                            <nav class="breadcrumbs" aria-label="Breadcrumb">
                                <a href="/">Home</a> &gt; <span aria-current="page">${collection.name}</span>
                            </nav>
                            
                            <div class="collection-header-block">
                                <h1>${collection.name}</h1>
                                <p class="collection-description" style="font-size: 11px; font-weight: 300; letter-spacing: 0.1em; color: #666; text-transform: uppercase; margin-bottom: 2rem; max-width: 600px; line-height: 1.6;">
                                    ${collDesc}
                                </p>
                            </div>
                            
                            <div class="products-grid">
                                ${products && products.length > 0 ? products.map(prod => {
                    const altText = `QISSEY ${prod.name} — ${prod.description ? prod.description.substring(0, 100).replace(/"/g, '&quot;') : 'Premium minimalist designer clothing'}`;
                    return `
                                        <article class="product-card">
                                            <a href="/product/${prod.slug || prod.id}">
                                                <img src="${prod.product_variants?.[0]?.image_urls?.[0] || '/logo.PNG'}" alt="${altText}" loading="lazy" />
                                                <h3>${prod.name}</h3>
                                                <p class="price">₹ ${prod.price ? prod.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</p>
                                            </a>
                                        </article>
                                    `;
                }).join('\n') : '<p class="no-products">No products found in this collection.</p>'}
                            </div>
                        </main>
                        ${footerHtml}
                    </div>
                `;
            }
        } else if (isNewArrivals) {
            title = 'New Arrivals';
            description = 'Discover the newest additions to the QISSEY collection. Premium, sustainably made minimalist fashion for women.';

            breadcrumbs = [
                { name: 'Home', path: '/' },
                { name: 'New Arrivals', path: '/new-arrivals' }
            ];

            const { data: products } = await supabaseAdmin
                .from('products')
                .select(`id, name, slug, price, description, product_variants(id, image_urls, is_primary)`)
                .eq('product_variants.is_primary', true)
                .eq('new_arrival', true)
                .order('created_at', { ascending: false });

            bodyHtml = `
                <div class="collection-page-container">
                    ${navbarHtml}
                    <main id="main-content">
                        <nav class="breadcrumbs" aria-label="Breadcrumb">
                            <a href="/">Home</a> &gt; <span aria-current="page">New Arrivals</span>
                        </nav>
                        
                        <div class="collection-header-block">
                            <h1>New Arrivals</h1>
                            <p class="collection-description" style="font-size: 11px; font-weight: 300; letter-spacing: 0.1em; color: #666; text-transform: uppercase; margin-bottom: 2rem; max-width: 600px; line-height: 1.6;">
                                Explore the newest design launches and limited-edition sustainable luxury arrivals from QISSEY Creative Studio.
                            </p>
                        </div>
                        
                        <div class="products-grid">
                            ${products && products.length > 0 ? products.map(prod => {
                const altText = `QISSEY ${prod.name} — ${prod.description ? prod.description.substring(0, 100).replace(/"/g, '&quot;') : 'Premium minimalist designer clothing'}`;
                return `
                                    <article class="product-card">
                                        <a href="/product/${prod.slug || prod.id}">
                                            <img src="${prod.product_variants?.[0]?.image_urls?.[0] || '/logo.PNG'}" alt="${altText}" loading="lazy" />
                                            <h3>${prod.name}</h3>
                                            <p class="price">₹ ${prod.price ? prod.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</p>
                                        </a>
                                    </article>
                                  `;
            }).join('\n') : '<p class="no-products">No new arrivals found.</p>'}
                        </div>
                    </main>
                    ${footerHtml}
                </div>
            `;
        } else if (isShop) {
            title = 'Shop All';
            description = 'Shop the entire collection of QISSEY. Refined minimalist luxury fashion for women.';

            breadcrumbs = [
                { name: 'Home', path: '/' },
                { name: 'Shop', path: '/shop' }
            ];

            const { data: products } = await supabaseAdmin
                .from('products')
                .select(`id, name, slug, price, description, product_variants(id, image_urls, is_primary)`)
                .eq('product_variants.is_primary', true)
                .order('created_at', { ascending: false });

            bodyHtml = `
                <div class="collection-page-container">
                    ${navbarHtml}
                    <main id="main-content">
                        <nav class="breadcrumbs" aria-label="Breadcrumb">
                            <a href="/">Home</a> &gt; <span aria-current="page">Shop All</span>
                        </nav>
                        
                        <div class="collection-header-block">
                            <h1>Shop All</h1>
                            <p class="collection-description" style="font-size: 11px; font-weight: 300; letter-spacing: 0.1em; color: #666; text-transform: uppercase; margin-bottom: 2rem; max-width: 600px; line-height: 1.6;">
                                Browse the complete collection of sustainably crafted minimalist luxury garments, structured tops, tailored trousers, and flowing dresses.
                            </p>
                        </div>
                        
                        <div class="products-grid">
                            ${products && products.length > 0 ? products.map(prod => {
                const altText = `QISSEY ${prod.name} — ${prod.description ? prod.description.substring(0, 100).replace(/"/g, '&quot;') : 'Premium minimalist designer clothing'}`;
                return `
                                    <article class="product-card">
                                        <a href="/product/${prod.slug || prod.id}">
                                            <img src="${prod.product_variants?.[0]?.image_urls?.[0] || '/logo.PNG'}" alt="${altText}" loading="lazy" />
                                            <h3>${prod.name}</h3>
                                            <p class="price">₹ ${prod.price ? prod.price.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : ''}</p>
                                        </a>
                                    </article>
                                `;
            }).join('\n') : '<p class="no-products">No products found.</p>'}
                        </div>
                    </main>
                    ${footerHtml}
                </div>
            `;
        } else if (isStaticPage) {
            let pageName = 'Page';
            if (urlPath === '/about') {
                pageName = 'About Us';
                title = 'About Us';
                description = 'QISSEY - Refined minimalist fashion and design studio based in India. Learn about our focus on sustainable materials, culture, and architecture.';
                bodyHtml = `
                    <div class="static-page-container">
                        ${navbarHtml}
                        <main id="main-content">
                            <nav class="breadcrumbs" aria-label="Breadcrumb">
                                <a href="/">Home</a> &gt; <span aria-current="page">About Us</span>
                            </nav>
                            <article class="about-page">
                                <h1>About QISSEY</h1>
                                <p>QISSEY is a design studio exploring the intersection of craftsmanship, clean lines, and sustainable luxury.</p>
                                <p>Each garment is conceived as a sculpture for the body, crafted from handpicked premium fabrics like linen, organic cotton, and silk.</p>
                            </article>
                        </main>
                        ${footerHtml}
                    </div>
                `;
            } else if (urlPath === '/faq') {
                pageName = 'FAQ';
                title = 'Frequently Asked Questions | FAQ';
                description = 'Find answers to frequently asked questions about QISSEY orders, shipping, sizes, customizations, and sustainability.';
                bodyHtml = `
                    <div class="static-page-container">
                        ${navbarHtml}
                        <main id="main-content">
                            <nav class="breadcrumbs" aria-label="Breadcrumb">
                                <a href="/">Home</a> &gt; <span aria-current="page">FAQ</span>
                            </nav>
                            <article class="faq-page">
                                <h1>Frequently Asked Questions</h1>
                                <div class="faq-item">
                                    <h3>What materials do you use?</h3>
                                    <p>We use premium, natural, and sustainable fabrics including linen, cotton, and silk.</p>
                                </div>
                                <div class="faq-item">
                                    <h3>Do you offer customizations?</h3>
                                    <p>Yes, we offer custom sizing for our pieces to ensure a perfect fit.</p>
                                </div>
                            </article>
                        </main>
                        ${footerHtml}
                    </div>
                `;
            } else if (urlPath === '/contact') {
                pageName = 'Contact Us';
                title = 'Contact Us';
                description = 'Get in touch with the QISSEY team. Contact us for order queries, size customizations, design partnerships, or general feedback.';
                bodyHtml = `
                    <div class="static-page-container">
                        ${navbarHtml}
                        <main id="main-content">
                            <nav class="breadcrumbs" aria-label="Breadcrumb">
                                <a href="/">Home</a> &gt; <span aria-current="page">Contact Us</span>
                            </nav>
                            <article class="contact-page">
                                <h1>Contact Us</h1>
                                <p>We are here to assist you with sizing, customization requests, and orders.</p>
                                <p>Email: care@qissey.com</p>
                                <p>Location: India</p>
                            </article>
                        </main>
                        ${footerHtml}
                    </div>
                `;
            } else {
                pageName = urlPath.replace('-', ' ').replace('/', '').toUpperCase();
                title = pageName;
                description = `${pageName} details and policies for QISSEY. Refined minimalist luxury fashion.`;
                bodyHtml = `
                    <div class="static-page-container">
                        ${navbarHtml}
                        <main id="main-content">
                            <nav class="breadcrumbs" aria-label="Breadcrumb">
                                <a href="/">Home</a> &gt; <span aria-current="page">${pageName}</span>
                            </nav>
                            <article class="policy-page">
                                <h1>${pageName}</h1>
                                <p>Please refer to our dynamic app for details regarding our ${pageName.toLowerCase()}.</p>
                            </article>
                        </main>
                        ${footerHtml}
                    </div>
                `;
            }

            breadcrumbs = [
                { name: 'Home', path: '/' },
                { name: pageName, path: urlPath }
            ];
        }

        // Add BreadcrumbList Schema if breadcrumbs are present
        if (breadcrumbs.length > 0) {
            const origin = `https://qissey.com`;
            const breadcrumbSchema = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                'itemListElement': breadcrumbs.map((crumb, idx) => ({
                    '@type': 'ListItem',
                    'position': idx + 1,
                    'name': crumb.name,
                    'item': `${origin}${crumb.path}`
                }))
            };
            schemas.push(breadcrumbSchema);
        }

        // Format HTML title to append brand name
        const separator = ' | ';
        const baseTitle = 'QISSEY';
        const fullTitle = title.includes(baseTitle) ? title : `${title}${separator}${baseTitle}`;

        // Construct dynamic metadata insertions
        const headInjections = `
            <title>${fullTitle}</title>
            <meta name="title" content="${fullTitle}" />
            <meta name="description" content="${description}" />
            <link rel="canonical" href="https://qissey.com${urlPath}" />
            
            <!-- Open Graph -->
            <meta property="og:type" content="${type}" />
            <meta property="og:url" content="https://qissey.com${urlPath}" />
            <meta property="og:title" content="${fullTitle}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${ogImage}" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="QISSEY" />
            
            <!-- Twitter Card -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${fullTitle}" />
            <meta name="twitter:description" content="${description}" />
            <meta name="twitter:image" content="${ogImage}" />

            <!-- Dynamic Structured Schemas -->
            ${schemas.map(s => `
                <script type="application/ld+json">${JSON.stringify(s)}</script>
            `).join('\n')}
        `;

        // Strip default/template title and description
        html = html.replace(/<title>.*?<\/title>/gi, '');
        html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, '');
        html = html.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/gi, '');

        // Inject dynamic tags immediately after <head>
        html = html.replace('<head>', `<head>\n${headInjections}`);

        // Inject pre-rendered SEO content OUTSIDE the React root div.
        // Uses the sr-only clip technique (NOT display:none) so Google crawls
        // and indexes the content, but it is not visible to sighted users.
        // React mounts cleanly into #root without conflict.
        const seoDiv = `<div id="seo-content" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">${bodyHtml}</div>`;
        const rootDivRegex = /<div\s+id="root"\s*><\/div>/i;
        if (rootDivRegex.test(html)) {
            html = html.replace(rootDivRegex, `<div id="root"></div>\n${seoDiv}`);
        } else {
            html = html + `\n${seoDiv}`;
        }

        res.setHeader('Content-Type', 'text/html');
        return res.send(html);

    } catch (err) {
        console.error('SEO pre-render error:', err);
        return next(); // Fallback to normal SPA flow
    }
}
