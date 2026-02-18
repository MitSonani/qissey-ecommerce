import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Lazy load pages for code splitting
const Home = lazy(() => import('../pages/Home'));
const Shop = lazy(() => import('../pages/Shop'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const CollectionPage = lazy(() => import('../features/products/pages/CollectionPage'));
const Auth = lazy(() => import('../pages/Auth'));
const Account = lazy(() => import('../pages/Account'));
const ShoppingBag = lazy(() => import('../pages/ShoppingBag'));
const NotFound = lazy(() => import('../pages/NotFound'));

import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import { CartProvider } from '../features/cart';
import { AuthProvider, ProtectedRoute } from '../features/auth';
import PageLoader from '../components/ui/PageLoader';
import PageTitle from '../components/ui/PageTitle';
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
      <Router>
        <CartProvider>
          <PageTitle />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
              <Route path="/collection/:id" element={<MainLayout><CollectionPage /></MainLayout>} />
              <Route path="/product/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
              <Route path="/shopping-bag" element={<MainLayout><ShoppingBag /></MainLayout>} />
              <Route path="/auth" element={<Auth />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<MainLayout><Account /></MainLayout>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
