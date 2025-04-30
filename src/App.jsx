import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './auth/Login';
import NotFound from './pages/NotFound';
import BestSelling from './components/product/BestSelling';
import Product from './pages/Product';

// Cart & Other Components
import Cart from './pages/Cart';
import Favorites from './pages/Favorites'; // Assuming this is your Wishlist
import Watchlist from './pages/Watchlist';
import Orders from './pages/Orders';
import Profile from './profile/Profile';
import Settings from './pages/Settings';
import Register from './auth/Register';
import Wallet from './profile/Wallet';
import Loyalty from './profile/Loyalty';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-screen">
        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Home />} />
          <Route path="/bestSelling" element={<BestSelling />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />

          {/* Cart & Other Components */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          {/* Routes for Sidebar links */}
          <Route path="/wishlist" element={<Favorites />} /> {/* Map /wishlist to Favorites */}
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/loyalty" element={<Loyalty />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;