# QISSEY.COM — IMPLEMENTATION GUIDE FOR DEVELOPERS

**Date:** May 21, 2026  
**Purpose:** Technical implementation instructions for SEO fixes

---

## 1. SCHEMA MARKUP IMPLEMENTATION

### 1.1 All Pages (Global — Add to `<head>`)

**File to edit:** Site-wide header template (e.g., `theme.liquid`, `_app.tsx`, `layout.ejs`)

Add these schema types to every page:

```html
<!-- Organization Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.qissey.com/#organization",
  "name": "QISSEY",
  "alternateName": "QISSEY Creative Studio",
  "url": "https://www.qissey.com",
  "logo": "https://www.qissey.com/logo.png",
  "sameAs": [
    "https://www.instagram.com/qissey/",
    "https://www.facebook.com/people/Qissey/61586697613049/"
  ]
}
</script>

<!-- WebSite Search Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.qissey.com/#website",
  "name": "QISSEY",
  "url": "https://www.qissey.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.qissey.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

### 1.2 Homepage Only

Add to homepage template in addition to global schemas.

### 1.3 Product Pages

**File to edit:** Product page template (e.g., `product.liquid`, `[slug].tsx`)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.qissey.com/product/{{ product.slug }}#product",
  "name": "{{ product.name }}",
  "description": "{{ product.description | truncate: 200 }}",
  "sku": "{{ product.sku }}",
  "brand": { "@type": "Brand", "name": "QISSEY" },
  "image": ["{{ product.image1 }}", "{{ product.image2 }}"],
  "offers": {
    "@type": "Offer",
    "url": "https://www.qissey.com/product/{{ product.slug }}",
    "priceCurrency": "INR",
    "price": "{{ product.price }}",
    "availability": "{{ product.availability }}"
  }
}
</script>
```

### 1.4 Collection Pages

**File to edit:** Collection template

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "{{ collection.name }} — QISSEY",
  "description": "{{ collection.seo_description }}",
  "url": "https://www.qissey.com/{{ collection.slug }}"
}
</script>
```

### 1.5 Breadcrumb (All Pages)

Implement dynamically based on page path:

| Page | Breadcrumb |
|:-----|:-----------|
| Homepage | (No breadcrumb needed) |
| /tops | Home > Tops |
| /tops/product-name | Home > Tops > Product Name |
| /dresses | Home > Dresses |
| /about | Home > About |
| /contact | Home > Contact |
| /faq | Home > FAQ |

---

## 2. META TAGS IMPLEMENTATION

### 2.1 Dynamic Meta Tag Template

**File to edit:** Site-wide header template

```html
<!-- Primary Meta Tags -->
<title>{{ page.seo_title }} | QISSEY</title>
<meta name="title" content="{{ page.seo_title }} | QISSEY" />
<meta name="description" content="{{ page.seo_description }}" />
<link rel="canonical" href="https://www.qissey.com{{ page.url }}" />

<!-- Open Graph -->
<meta property="og:type" content="{% if page.type == 'product' %}product{% else %}website{% endif %}" />
<meta property="og:url" content="https://www.qissey.com{{ page.url }}" />
<meta property="og:title" content="{{ page.seo_title }} | QISSEY" />
<meta property="og:description" content="{{ page.seo_description }}" />
<meta property="og:image" content="{% if page.og_image %}{{ page.og_image }}{% else %}https://www.qissey.com/default-og.jpg{% endif %}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="QISSEY" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{ page.seo_title }} | QISSEY" />
<meta name="twitter:description" content="{{ page.seo_description }}" />
<meta name="twitter:image" content="{% if page.og_image %}{{ page.og_image }}{% else %}https://www.qissey.com/default-og.jpg{% endif %}" />

<!-- Pinterest Verification (for Rich Pins) -->
<meta name="p:domain_verify" content="[PINTEREST_VERIFICATION_CODE]" />
```

### 2.2 Default OG Image

Create a default Open Graph image (1200×630px) with:
- QISSEY logo/brandmark
- Clean, minimal design
- Neutral/white background
- Save as: `/og-image.jpg`

---

## 3. SITEMAP OPTIMIZATION

### 3.1 Verify Current Sitemap

Check current sitemap at: `https://www.qissey.com/sitemap.xml`

**What to check:**
- ✅ All product pages included
- ✅ All collection pages included
- ✅ Blog posts (when created) included
- ✅ Static pages (about, contact, faq) included
- ❌ Remove any excluded/noindex pages
- ✅ `<lastmod>` tags are accurate
- ✅ `<changefreq>` and `<priority>` set appropriately

### 3.2 Ideal Sitemap Priority Structure

| Page Type | Priority | Changefreq |
|:----------|:--------:|:-----------|
| Homepage | 1.0 | Weekly |
| Product Pages | 0.8 | Weekly |
| Collection Pages | 0.7 | Weekly |
| Blog Posts | 0.6 | Monthly |
| Static Pages (About, Contact, FAQ) | 0.5 | Monthly |
| Sustainability Page | 0.7 | Monthly |

---

## 4. ROBOTS.TXT OPTIMIZATION

**Current:** `https://www.qissey.com/robots.txt`

**Recommended content:**

```
User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.qissey.com/sitemap.xml

# Block duplicate/filtered URLs
Disallow: /*?*
Disallow: /*sort=*
Disallow: /*view=*
Disallow: /*page=*

# Block admin/internal areas (if applicable)
Disallow: /admin
Disallow: /cart
Disallow: /account
Disallow: /search

# Allow crawlers access
Crawl-delay: 10
```

---

## 5. IMAGE OPTIMIZATION

### 5.1 Image File Naming Convention

```
descriptive-product-name-angle-color.jpg
```

**Examples:**
```
gathered-sleeveless-top-front-black.jpg
gathered-sleeveless-top-back-black.jpg
gathered-sleeveless-top-detail-shoulder.jpg
linen-dress-front-ivory.jpg
formal-shirt-front-white.jpg
```

### 5.2 Alt Text Guidelines

```html
<!-- GOOD: Descriptive, includes brand + product + details -->
<img src="gathered-sleeveless-top-front-black.jpg" 
     alt="QISSEY gathered sleeveless top in black — front view showing delicate shoulder gathering detail" />

<!-- BAD: Generic, not descriptive -->
<img src="IMG_1234.jpg" alt="top" />
```

### 5.3 Technical Image Requirements

| Requirement | Specification |
|:------------|:--------------|
| Format | WebP (primary), JPEG/PNG (fallback) |
| Compression | 80% quality for JPEG/WebP |
| Maximum dimensions | 2000px on longest side |
| Product main image | 1200×1500px (3:4 ratio) — Used on PDPs |
| Gallery images | 1200×1200px (1:1 ratio) — Used on PDPs |
| Open Graph image (social sharing) | 1200×630px (1.91:1 ratio) — Separate image for OG tags |
| Pinterest Rich Pin image | 1000×1500px (2:3 ratio) — Optimized for vertical pin display |
| File size target | < 200KB per image |
| Lazy loading | `loading="lazy"` for below-fold images |
| Responsive | `srcset` with 3 breakpoints |

**Note:** These are separate image types. Product images (3:4 ratio), OG images (1.91:1), and Pinterest images (2:3) serve different purposes and all need to be created/uploaded separately.

### 5.4 Responsive Image Implementation

```html
<img
  src="product-image-800w.webp"
  srcset="
    product-image-400w.webp 400w,
    product-image-800w.webp 800w,
    product-image-1200w.webp 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="QISSEY [product name] — [angle/view]"
  loading="lazy"
  width="800"
  height="1000"
/>
```

---

## 6. URL STRUCTURE OPTIMIZATION

### 6.1 URL Patterns

| Page Type | Pattern | Example |
|:----------|:--------|:--------|
| Homepage | `/` | `https://www.qissey.com/` |
| Collection | `/[category-slug]` | `https://www.qissey.com/tops` |
| Product | `/product/[product-slug]` | `https://www.qissey.com/product/gathered-sleeveless-top` |
| Blog | `/blog/[post-slug]` | `https://www.qissey.com/blog/capsule-wardrobe-guide` |
| Static | `/[page-slug]` | `https://www.qissey.com/about` |

### 6.2 URL Best Practices

- ✅ Use lowercase only
- ✅ Use hyphens (-) not underscores (_)
- ✅ Keep URLs short and descriptive
- ✅ Include primary keyword in product URLs
- ❌ Avoid URL parameters for canonical pages
- ❌ Avoid date-based URLs (e.g., `/blog/2026/05/post-name`)

---

## 7. PINTEREST RICH PINS SETUP

### 7.1 Add Pinterest Tag

```html
<meta name="p:domain_verify" content="[YOUR_PINTEREST_VERIFICATION_CODE]" />
```

### 7.2 Enable Rich Pins

Pinterest Rich Pins use the Open Graph meta tags you've already added. To validate:

1. Go to https://developers.pinterest.com/tools/url-debugger/
2. Enter a product URL
3. Click "Validate"
4. Fix any issues found

Rich Pins require:
- ✅ `og:title` — Product name
- ✅ `og:description` — Product description
- ✅ `og:image` — Product image
- ✅ `og:url` — Product URL
- ✅ `og:type` — Must be `product` for product pages
- ✅ `product:price:amount` — Price
- ✅ `product:price:currency` — INR

### 7.3 Additional Pinterest Meta

```html
<!-- Add to product pages -->
<meta property="product:price:amount" content="{{ product.price }}" />
<meta property="product:price:currency" content="INR" />
<meta property="product:availability" content="{{ product.availability }}" />
```

---

## 8. PERFORMANCE OPTIMIZATION

### 8.1 Critical Checklist

- [ ] Enable WebP image format with JPEG fallback
- [ ] Implement lazy loading for below-fold images
- [ ] Add `width` and `height` attributes to all images (prevents CLS)
- [ ] Preload hero/LCP image
- [ ] Minify CSS, JavaScript, HTML
- [ ] Enable Gzip/Brotli compression
- [ ] Implement CDN (Cloudflare, Fastly, or similar)
- [ ] Defer non-critical JavaScript
- [ ] Eliminate render-blocking resources
- [ ] Reduce third-party script usage

### 8.2 Hero Image Preload

```html
<link rel="preload" href="hero-image.webp" as="image" type="image/webp" fetchpriority="high" />
```

### 8.3 Font Optimization

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=[FontName]:wght@300;400;500&display=swap" rel="stylesheet" />
```

---

## 9. ACCESSIBILITY FIXES

### 9.1 Contact Form Fix

**Current issue:** 4 fields without labels, 6 fields without id/name attributes

**Fixed template:**
```html
<form action="/contact" method="POST">
  <div class="form-group">
    <label for="name">Full Name</label>
    <input type="text" id="name" name="contact[name]" placeholder="Your Name" required aria-required="true" />
  </div>
  
  <div class="form-group">
    <label for="email">Email Address</label>
    <input type="email" id="email" name="contact[email]" placeholder="your@email.com" required aria-required="true" />
  </div>
  
  <div class="form-group">
    <label for="phone">Phone Number</label>
    <input type="tel" id="phone" name="contact[phone]" placeholder="+91 98765 43210" />
  </div>
  
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="contact[body]" rows="5" placeholder="How can we help you?" required aria-required="true"></textarea>
  </div>
  
  <button type="submit" aria-label="Send message">Send Message</button>
</form>
```

### 9.2 General Accessibility Checklist

- [ ] All images have descriptive alt text
- [ ] Form fields have associated labels
- [ ] Color contrast meets WCAG AA standards (4.5:1 ratio)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Skip navigation link available
- [ ] ARIA landmarks used (`<nav>`, `<main>`, `<footer>`, etc.)
- [ ] Focus indicators visible
- [ ] Error messages associated with form fields
- [ ] Touch targets at least 44×44px on mobile

---

## 10. ANALYTICS TRACKING

### 10.1 Google Analytics 4 Setup

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 10.2 Ecommerce Tracking Events

```javascript
// View item (product page view)
gtag('event', 'view_item', {
  currency: 'INR',
  value: product.price,
  items: [{
    item_id: product.sku,
    item_name: product.name,
    item_category: product.category,
    price: product.price
  }]
});

// Add to cart
gtag('event', 'add_to_cart', {
  currency: 'INR',
  value: product.price,
  items: [productData]
});

// Purchase
gtag('event', 'purchase', {
  transaction_id: order.id,
  value: order.total,
  currency: 'INR',
  items: order.items
});
```

---

## 11. PAGES TO CREATE/OPTIMIZE

| Page | URL | Status | Priority |
|:-----|:----|:------:|:--------:|
| Homepage | `/` | Optimize | 🔴 Critical |
| About | `/about` | Create/Optimize | 🔴 Critical |
| FAQ | `/faq` | Create | 🔴 Critical |
| Sustainability | `/sustainability` | Create | 🔴 Critical |
| Size Guide | `/size-guide` | Create | 🟡 High |
| Shipping & Returns | `/shipping-returns` | Create | 🟡 High |
| Care Instructions | `/care-guide` | Create | 🟡 High |
| Blog | `/blog` | Create | 🟡 High |
| Contact | `/contact` | Optimize (fix accessibility) | 🟡 High |

---

## 12. GOOGLE SEARCH CONSOLE SETUP

### Steps:
1. Go to https://search.google.com/search-console
2. Add property: `https://www.qissey.com`
3. Verify ownership (choose one):
   - **DNS record** (recommended) — Add TXT record to domain DNS
   - **HTML file** — Upload to root directory
   - **Google Analytics** — If already using GA
   - **Google Tag Manager** — If using GTM
4. Submit sitemap: `https://www.qissey.com/sitemap.xml`
5. Check for:
   - Index coverage issues
   - Crawl errors
   - Manual actions
   - Security issues

### Bing Webmaster Tools (also recommended):
1. Go to https://www.bing.com/webmasters
2. Import from Google Search Console (or set up manually)
3. Submit sitemap

---

## 13. IMPLEMENTATION CHECKLIST FOR DEVELOPER

### Week 1 (Critical — SEO Foundation)
- [ ] Add Organization + WebSite schema to all pages
- [ ] Add Product schema template to product pages
- [ ] Add CollectionPage schema to collection pages
- [ ] Add BreadcrumbList schema dynamically
- [ ] Add OG + Twitter meta tags to all pages
- [ ] Fix contact form accessibility
- [ ] Add H1 tag to homepage
- [ ] Submit to Google Search Console

### Week 2 (Content & Structure)
- [ ] Create /faq page with FAQ schema
- [ ] Create /about page
- [ ] Create /sustainability page
- [ ] Rewrite product descriptions for top 10 products
- [ ] Create /size-guide page
- [ ] Create /shipping-returns page
- [ ] Implement image optimization (WebP, alt text, file names)

### Week 3 (Performance & Analytics)
- [ ] Run PageSpeed Insights — document baseline
- [ ] Implement image lazy loading
- [ ] Add preload for LCP hero image
- [ ] Enable CDN
- [ ] Set up Google Analytics 4
- [ ] Set up conversion tracking
- [ ] Validate all schema with Google Rich Results Test

### Ongoing
- [ ] Monitor Google Search Console weekly
- [ ] Check schema validation monthly
- [ ] Run PageSpeed Insights monthly
- [ ] Update sitemap when new content added
- [ ] Keep product prices/availability synced with schema

---

*Generated by AI-Powered SEO Audit System — May 21, 2026*
