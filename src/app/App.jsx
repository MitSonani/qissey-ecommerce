import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom'; import { Toaster } from 'sonner';
// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const Shop = lazy(() => import('../pages/Shop'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const CollectionPage = lazy(() => import('../features/products/pages/CollectionPage'));
const NewArrivalsPage = lazy(() => import('../features/products/pages/NewArrivalsPage'));
const Auth = lazy(() => import('../pages/Auth'));
const Account = lazy(() => import('../pages/Account'));
const OrderDetail = lazy(() => import('../pages/OrderDetail'));
const ShoppingBag = lazy(() => import('../pages/ShoppingBag'));
const SavedProducts = lazy(() => import('../pages/SavedProducts'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Contact = lazy(() => import('../pages/Contact'));
const ShippingPolicy = lazy(() => import('../pages/ShippingPolicy'));
const PaymentPolicy = lazy(() => import('../pages/PaymentPolicy'));
const ReturnPolicy = lazy(() => import('../pages/ReturnPolicy'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const PurchaseConditions = lazy(() => import('../pages/PurchaseConditions'));
const AboutUs = lazy(() => import('../pages/AboutUs'));
const Sitemap = lazy(() => import('../pages/Sitemap'));
const FAQ = lazy(() => import('../pages/FAQ'));


import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import { CartProvider } from '../features/cart';
import { AuthProvider, ProtectedRoute } from '../features/auth';
import PageLoader from '../components/ui/PageLoader';
import PageTitle from '../components/ui/PageTitle';
import ScrollToTop from '../components/ui/ScrollToTop';
import './styles/App.css';

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      <Toaster
        position="top-right"
        duration={1000}
        expand={false}
        richColors={false}
        toastOptions={{
          style: {
            background: 'white',
            color: '#1A1A1A',
            border: '1px solid #1A1A1A10',
            borderRadius: '0px',
            fontFamily: '"Helvetica Now Text", "Helvetica Neue", "Helvetica", sans-serif',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '16px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
          },
          className: 'premium-toast',
        }}
      />
    </div>
  );
}





function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <PageTitle />
        <Suspense fallback={<PageLoader />}>
          <Routes>

            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<MainLayout><Account /></MainLayout>} />
              <Route path="/account/order/:id" element={<MainLayout><OrderDetail /></MainLayout>} />
              <Route path="/shopping-bag" element={<MainLayout><ShoppingBag /></MainLayout>} />
              <Route path="/saved-products" element={<MainLayout><SavedProducts /></MainLayout>} />
            </Route>

            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
            <Route path="/new-arrivals" element={<MainLayout><NewArrivalsPage /></MainLayout>} />
            <Route path="/collection/:id" element={<MainLayout><CollectionPage /></MainLayout>} />
            <Route path="/product/:slug" element={<MainLayout><ProductDetail /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/shipping-policy" element={<MainLayout><ShippingPolicy /></MainLayout>} />
            <Route path="/payment-policy" element={<MainLayout><PaymentPolicy /></MainLayout>} />
            <Route path="/return-policy" element={<MainLayout><ReturnPolicy /></MainLayout>} />
            <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
            <Route path="/purchase-conditions" element={<MainLayout><PurchaseConditions /></MainLayout>} />
            <Route path="/about" element={<MainLayout><AboutUs /></MainLayout>} />
            <Route path="/sitemap" element={<MainLayout><Sitemap /></MainLayout>} />
            <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </CartProvider>
    </AuthProvider >
  );
}

export default App;
