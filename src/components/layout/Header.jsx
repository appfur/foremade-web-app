import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import db from '../../db.json';
import { getCart } from '/src/utils/cartUtils';
import { auth } from '../../firebase';
import logo from '/src/assets/logo.png';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setDataLoading(true);
    try {
      const cartItems = getCart();
      setCart(Array.isArray(cartItems) ? cartItems : []);
      const storedFavorites = localStorage.getItem('favorites');
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
      localStorage.setItem('favorites', JSON.stringify([]));
    } catch (err) {
      console.error('Error loading cart/favorites:', err);
      setCart([]);
      setFavorites([]);
      localStorage.setItem('favorites', JSON.stringify([]));
      setError('Failed to load cart or favorites.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      const updatedCart = getCart();
      setCart(Array.isArray(updatedCart) ? updatedCart : []);
    };

    const handleStorageChange = (event) => {
      if (event.key === 'favorites') {
        try {
          const storedFavorites = localStorage.getItem('favorites');
          setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
        } catch (err) {
          console.error('Error parsing favorites:', err);
          setFavorites([]);
        }
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    try {
      setLoading(true);
      const productData = Array.isArray(db.products) ? db.products : [];
      setProducts(productData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
        console.log('Authenticated user:', {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        setUserData(null);
      }
    });
    return unsubscribe;
  }, []);

  const getDisplayName = () => {
    if (userData && userData.name) {
      return userData.name.split(' ')[0] || 'User';
    }
    return 'Guest';
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
    setShowDropdown(true);
  };

  const handleFocus = () => {
    if (searchQuery.trim() !== '' && searchResults.length > 0) setShowDropdown(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favoritesCount = favorites.length;

  if (loading || dataLoading) return <div className="p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (products.length === 0) return <div className="p-4 text-gray-600">No products available.</div>;

  return (
    <header className="">
      <div className="hidden sm:block border-b border-gray-200 text-gray-600 py-2">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            {user ? (
              <Link to="/profile" className="cursor-pointer hover:text-blue-600">
                Hello, {getDisplayName()}
              </Link>
            ) : (
              <p className="cursor-pointer">
                Hi!{' '}
                <Link to="/login" className="text-blue-500 underline">
                  Sign in
                </Link>{' '}
                or{' '}
                <Link to="/register" className="text-blue-500 underline">
                  Register
                </Link>
              </p>
            )}
            <Link to="/deals" className="hover:text-blue-600">
              Daily Deals
            </Link>
            <Link to="/brands" className="hover:text-blue-600 hidden lg:inline">
              Brand Outlet
            </Link>
            <Link to="/gift-cards" className="hover:text-blue-600 hidden lg:inline">
              Gift Cards
            </Link>
            <Link to="/help" className="hover:text-blue-600 hidden lg:inline">
              Help & Contact
            </Link>
            <div className="relative group lg:hidden p-1">
              <button className="hover:text-blue-600 flex items-center">
                More <i className="bx bx-chevron-down ml-1"></i>
              </button>
              <div className="absolute hidden group-hover:block bg-white border border-gray-200 py-2 mt-1 z-10 w-48 rounded-md shadow-lg">
                <Link to="/brands" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Brand Outlet
                </Link>
                <Link to="/gift-cards" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Gift Cards
                </Link>
                <Link to="/help" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Help & Contact
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs mt-2 sm:mt-0">
            <Link to="/ship-to" className="hover:text-blue-600">
              Ship to
            </Link>
            <div className="relative group">
              <button className="hover:text-blue-600 flex items-center">
                My Foremade <i className="bx bx-chevron-down ml-1"></i>
              </button>
              <div className="absolute hidden group-hover:block bg-white border border-gray-200 py-3 z-10 w-48 rounded-md shadow-lg">
                <Link to="/profile" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/orders" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Orders
                </Link>
                <Link to="/favorites" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Favorites ({favoritesCount})
                </Link>
              </div>
            </div>
            <Link to="/seller/register" className="hover:text-blue-600">
              Sell
            </Link>
            <Link to="/watchlist" className="hover:text-blue-600">
              Watchlist
            </Link>
            <Link to="/notifications" className="relative">
              <i className="bx bx-bell text-lg text-gray-600"></i>
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2 flex justify-between items-center sm:border-b sm:border-gray-200">
        <div className="flex items-center">
            <img
              src={logo}
              className="h-14 sm:w-[400px] md:w-[400px] lg:w-[400px] xl:w-72 "
              alt="Foremade"
            />
        </div>

        <div className="hidden sm:flex items-center w-full mx-4 relative">
          <div className="flex items-center border-2 border-black rounded-full w-full">
            <div className="relative">
              <select className="bg-gray-100 py-2 pl-3 pr-8 text-xs focus:outline-none appearance-none rounded-l-full border-r border-gray-300">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Motors</option>
                <option>Home & Garden</option>
              </select>
              <i className="bx bx-chevron-down absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm"></i>
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Foremade"
                className="w-full bg-white py-2 pl-10 pr-3 text-xs focus:outline-none placeholder-black border-none rounded-r-full"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm"></i>
            </div>
          </div>
          <button className="bg-blue-700 sm:hidden md:flex lg:flex xl:flex text-white px-6 py-2 rounded-full hover:bg-blue-800 text-xs ml-2">
            Search
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center p-2 hover:bg-gray-100"
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchQuery('');
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded mr-2"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40?text=Image+Not+Found';
                      }}
                    />
                    <span className="text-sm text-gray-800">{product.name}</span>
                  </Link>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-600">No results found</div>
              )}
            </div>
          )}
        </div>

        <div className="sm:hidden flex items-center gap-3">
          <Link to="/profile">
            <i className="bx bx-user text-gray-600 text-xl"></i>
          </Link>
          <Link to="/favorites" className="relative">
            <i className="bx bx-heart text-gray-600 text-xl"></i>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative">
            <i className="bx bx-cart-alt text-gray-600 text-xl"></i>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 focus:outline-none">
            <i className="bx bx-menu text-2xl"></i>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Link to="/favorites" className="flex items-center relative">
            <i className="bx bx-heart text-gray-600 text-xl"></i>
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="flex items-center relative">
            <i className="bx bx-cart-alt text-gray-600 text-xl"></i>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="sm:hidden px-4 py-2">
        <div className="flex items-center w-full mb-2 relative">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search Foremade"
              className="w-full h-48 max-md:h-auto text-black border border-gray-300 rounded-l-md p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <i className="bx bx-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg"></i>
          </div>
          <button className="bg-blue-600 text-white p-1 rounded-r-md">
            <i className="bx bx-search text-xl"></i>
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center p-2 hover:bg-gray-100"
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchQuery('');
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded mr-2"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40?text=Image+Not+Found';
                      }}
                    />
                    <span className="text-sm text-gray-800">{product.name}</span>
                  </Link>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-600">No results found</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-start gap-2 overflow-x-auto scrollbar-hide p-2">
          {!user && (
            <Link
              to="/login"
              className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
            >
              <i className="bx bx-log-in mr-2"></i>Sign in
            </Link>
          )}
          <Link
            to="/fashion"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-closet mr-2"></i>Fashion
          </Link>
          <Link
            to="/seller/register"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-camera mr-2"></i>Selling
          </Link>
          <Link
            to="/local"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-map mr-2"></i>Local
          </Link>
          <Link
            to="/electronics"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-chip mr-2"></i>Electronics
          </Link>
          <Link
            to="/motors"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-car mr-2"></i>Motors
          </Link>
          <Link
            to="/collectibles"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-collection mr-2"></i>Collectibles
          </Link>
          <Link
            to="/sports"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-football mr-2"></i>Sports
          </Link>
          <Link
            to="/health-beauty"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-heart-circle mr-2"></i>Health & Beauty
          </Link>
          <Link
            to="/home-garden"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-home-heart mr-2"></i>Home & Garden
          </Link>
        </div>
      </div>

      <div className="hidden sm:block border-t border-gray-200 py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs text-gray-600">
            <Link to="/foremade-live" className="hover:text-blue-600">
              Tablet & Phones
            </Link>
            <Link to="/favorites" className="hover:text-blue-600">
              Health & Beauty
            </Link>
            <div className="relative group lg:hidden">
              <button className="hover:text-blue-600 flex items-center">
                More <i className="bx bx-chevron-down ml-1"></i>
              </button>
              <div className="absolute hidden group-hover:block bg-white border border-gray-200 py-2 mt-1 z-10 w-48 rounded-md shadow-lg">
                <Link to="/collectibles" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Baby Products
                </Link>
                <Link to="/sports" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Computer & Accessories
                </Link>
                <Link to="/health-beauty" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Game & Fun
                </Link>
              </div>
            </div>
            <Link to="/electronics" className="hover:text-blue-600">
              Foremade Fashion
            </Link>
            <Link to="/motors" className="hover:text-blue-600">
              Electronics
            </Link>
            <Link to="/health-beauty" className="hover:text-blue-600 hidden lg:inline">
              Drinks & Categories
            </Link>
            <Link to="/home-garden" className="hover:text-blue-600 hidden lg:inline">
              Home & Kitchen
            </Link>
            <Link to="/smart-watches" className="hover:text-blue-600 hidden lg:inline">
              Smart Watches
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 sm:hidden z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-800">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-600 focus:outline-none">
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2 mb-4">
            <Link to="/profile" onClick={() => setIsSidebarOpen(false)}>
              <i className="bx bx-user-circle text-2xl text-gray-600"></i>
            </Link>
            {user ? (
              <Link to="/profile" className="cursor-pointer hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
                Hello, {getDisplayName()}
              </Link>
            ) : (
              <p className="cursor-pointer">
                Hi!{' '}
                <Link to="/login" className="text-blue-600 underline" onClick={() => setIsSidebarOpen(false)}>
                  Sign in
                </Link>
                <span className="mx-1">|</span>
                <Link to="/register" className="text-blue-600 underline" onClick={() => setIsSidebarOpen(false)}>
                  Register
                </Link>
              </p>
            )}
          </div>
          <Link to="/deals" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-bolt-circle text-lg"></i>
            <span>Hot Deals</span>
          </Link>
          <Link to="/brands" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-store text-lg"></i>
            <span>Premium Brands</span>
          </Link>
          <Link to="/gift-cards" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-gift text-lg"></i>
            <span>Gift Vouchers</span>
          </Link>
          <Link to="/help" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-help-circle text-lg"></i>
            <span>Support Center</span>
          </Link>
          <Link to="/ship-to" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-globe text-lg"></i>
            <span>Delivery Options</span>
          </Link>
          <Link to="/seller/register" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-camera text-lg"></i>
            <span>Start Selling</span>
          </Link>
          <Link to="/favorites" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-heart text-lg"></i>
            <span>Favorites ({favoritesCount})</span>
          </Link>
          <Link to="/profile" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-user text-lg"></i>
            <span>Profile</span>
          </Link>
          <Link to="/watchlist" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-bookmark text-lg"></i>
            <span>Watchlist</span>
          </Link>
          <Link to="/orders" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-package text-lg"></i>
            <span>Orders</span>
          </Link>
          <Link to="/settings" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-cog text-lg"></i>
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-40">
        <Link
          to="/"
          className={`flex flex-col items-center ${
            location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'
          } hover:text-blue-600`}
        >
          <i className="bx bx-home-alt text-2xl"></i>
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center ${
            location.pathname === '/profile' ? 'text-blue-600' : 'text-gray-600'
          } hover:text-blue-600`}
        >
          <i className="bx bx-user text-2xl"></i>
          <span className="text-xs">Profile</span>
        </Link>
        <Link
          to="/search"
          className={`flex flex-col items-center ${
            location.pathname === '/search' ? 'text-blue-600' : 'text-gray-600'
          } hover:text-blue-600`}
        >
          <i className="bx bx-search text-2xl"></i>
          <span className="text-xs">Search</span>
        </Link>
        <Link
          to="/notifications"
          className={`flex flex-col items-center relative ${
            location.pathname === '/notifications' ? 'text-blue-600' : 'text-gray-600'
          } hover:text-blue-600`}
        >
          <i className="bx bx-bell text-2xl"></i>
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            6
          </span>
          <span className="text-xs">Notifications</span>
        </Link>
        <Link
          to="/seller/register"
          className={`flex flex-col items-center ${
            location.pathname === '/seller/register' ? 'text-blue-600' : 'text-gray-600'
          } hover:text-blue-600`}
        >
          <i className="bx bx-camera text-2xl"></i>
          <span className="text-xs">Selling</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;