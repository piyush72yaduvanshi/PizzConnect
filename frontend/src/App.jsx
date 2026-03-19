import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { DeliveryDashboardPage } from './pages/delivery/DeliveryDashboardPage';

// Pages with no navbar/footer (auth pages)
const AuthLayout = ({ children }) => <>{children}</>;

// Pages with navbar+footer
const MainLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontFamily: 'Outfit, sans-serif',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: 'white' } },
              error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
            }}
          />
          <Routes>
            {/* Auth routes — no navbar */}
            <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

            {/* Public routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/menu" element={<MainLayout><MenuPage /></MainLayout>} />

            {/* Protected user routes */}
            <Route path="/cart" element={<MainLayout><ProtectedRoute><CartPage /></ProtectedRoute></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><ProtectedRoute><CheckoutPage /></ProtectedRoute></MainLayout>} />
            <Route path="/order-success" element={<MainLayout><ProtectedRoute><OrderSuccessPage /></ProtectedRoute></MainLayout>} />
            <Route path="/orders" element={<MainLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></MainLayout>} />
            <Route path="/orders/:id" element={<MainLayout><ProtectedRoute><OrderDetailPage /></ProtectedRoute></MainLayout>} />
            <Route path="/profile" element={<MainLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></MainLayout>} />

            {/* Admin routes */}
            <Route path="/admin" element={<MainLayout><RoleRoute roles={['admin']}><AdminDashboardPage /></RoleRoute></MainLayout>} />
            <Route path="/admin/products" element={<MainLayout><RoleRoute roles={['admin']}><AdminProductsPage /></RoleRoute></MainLayout>} />
            <Route path="/admin/orders" element={<MainLayout><RoleRoute roles={['admin']}><AdminOrdersPage /></RoleRoute></MainLayout>} />

            {/* Delivery routes */}
            <Route path="/delivery" element={<MainLayout><RoleRoute roles={['deliveryman', 'admin']}><DeliveryDashboardPage /></RoleRoute></MainLayout>} />

            {/* 404 */}
            <Route path="*" element={
              <MainLayout>
                <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <p style={{ fontSize: '5rem' }}>🍕</p>
                  <h2 style={{ fontSize: '2rem' }}>Page Not Found</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Looks like this page got eaten!</p>
                  <a href="/" className="btn btn-primary">Go Home</a>
                </div>
              </MainLayout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
