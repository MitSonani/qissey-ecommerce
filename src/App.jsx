import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import Account from './pages/Account';
import ProtectedRoute from './components/auth/ProtectedRoute';

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="bottom-right" expand={false} richColors />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
            <Route path="/product/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<MainLayout><Account /></MainLayout>} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
