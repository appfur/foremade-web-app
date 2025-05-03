import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './auth/Login';
import NotFound from './pages/NotFound';
import BestSelling from './components/product/BestSelling';
import Product from './pages/Product';
import AddPhone from './auth/AddPhone'; // Import the new AddPhone component
import ProtectedRoute from './auth/ProtectedRoute'; // Import ProtectedRoute

// Cart & Other Components
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import Orders from './pages/Orders';
import Profile from './profile/Profile';
import Settings from './pages/Settings';
import Register from './auth/Register';
import Wallet from './profile/Wallet';
import Loyalty from './profile/Loyalty';
import Checkout from './components/checkout/Checkout';
import SellerRegister from './seller/SellerRegister';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        <Routes>
          {/* Unprotected Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-phone" element={<AddPhone />} />

          {/* Public Routes (accessible without auth) */}
          <Route path="/" element={<Home />} />
          <Route path="/bestSelling" element={<BestSelling />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              // <ProtectedRoute>
                <Cart />
              // </ProtectedRoute> 
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loyalty"
            element={
              <ProtectedRoute>
                <Loyalty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              // <ProtectedRoute>
                <Checkout />
              // </ProtectedRoute> 
            }
          />
          <Route
            path="/sell"
            element={
              // <ProtectedRoute>
                <SellerRegister />
              // </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;