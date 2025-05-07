import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './auth/Login';
import NotFound from './pages/NotFound';
import BestSelling from './components/product/BestSelling';
import Product from './pages/Product';
import AddPhone from './auth/AddPhone';
import ProtectedRoute from './auth/ProtectedRoute';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Watchlist from './profile/Watchlist';
import Profile from './profile/Profile';
import Settings from './pages/Settings';
import Register from './auth/Register';
import Wallet from './profile/Wallet';
import Loyalty from './profile/Loyalty';
import Checkout from './components/checkout/Checkout';
import SellerRegister from './seller/SellerRegister';
import SellerProductUpload from './seller/SellerProductUpload';
import Orders from './profile/Orders';
import Address from './profile/Address';
import Setting from './profile/Setting';
import SellerLogin from './seller/SellerLogin';
// import ImageUpload from './components/ImageUpload';

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

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/bestSelling" element={<BestSelling />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />

          {/* Seller Upload Route */}
          {/* <Route path="/seller/upload" element={<ImageUpload />} /> */}

          {/* Protected Routes */}
          <Route path="/cart" element={<Cart />} />
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
            path="/seller-product-upload"
            element={
              <ProtectedRoute>
                <SellerProductUpload />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          />
          <Route path="/setting" element={<Setting />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;