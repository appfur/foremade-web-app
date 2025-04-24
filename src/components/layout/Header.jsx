import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="bg-white">
      {/* Top Bar (Visible on Desktop and Tablet) */}
      <div className="hidden sm:block bg-white border-b border-gray-200 text-gray-600 py-2">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            {user ? (
              <p className="cursor-pointer">
                Hi, {user.email}!
              </p>
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
              <div className="absolute hidden group-hover:block bg-white border border-gray-200 py-2 mt-1 z-10 w-48 rounded-md shadow-lg">
                <Link to="/profile" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/orders" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Orders
                </Link>
                <Link to="/favorites" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Favorites
                </Link>
                <Link to="/settings" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Settings
                </Link>
              </div>
            </div>
            <Link to="/sell" className="hover:text-blue-600">
              Sell
            </Link>
            <Link to="/watchlist" className="hover:text-blue-600">
              Watchlist
            </Link>
            <i className="bx bx-bell text-lg text-gray-600"></i>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center sm:border-b sm:border-gray-200">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src="http://foremade.com/storage/app/public/company/2025-04-20-6805437335cb6.webp"
              className="h-8 sm:h-10"
              alt="Foremade"
            />
          </Link>
        </div>

        {/* Search Bar (Desktop/Tablet) */}
        <div className="hidden sm:flex items-center w-full mx-4">
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
                placeholder="Search for anything"
                className="w-full bg-white py-2 pl-10 pr-3 text-xs focus:outline-none placeholder-black border-none rounded-r-full"
              />
              <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm"></i>
            </div>
          </div>
          <button className="bg-blue-700 text-white px-6 py-2 rounded-full hover:bg-blue-800 text-xs ml-2">
            Search
          </button>
        </div>

        {/* Icons (Mobile) */}
        <div className="sm:hidden flex items-center gap-3">
          <Link to="/my-account">
            <i className="bx bx-user text-gray-600 text-xl"></i>
          </Link>
          <Link to="/cart" className="relative">
            <i className="bx bx-cart-alt text-gray-600 text-xl"></i>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              6
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 focus:outline-none"
          >
            <i className="bx bx-menu text-2xl"></i>
          </button>
        </div>

        {/* Icons (Desktop/Tablet) */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/cart" className="flex items-center">
            <i className="bx bx-cart-alt text-gray-600 text-xl"></i>
          </Link>
        </div>
      </div>

      {/* Search Bar and Buttons (Mobile) */}
      <div className="sm:hidden px-4 py-2">
        <div className="flex items-center w-full mb-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for anything"
              className="w-full text-black border border-gray-300 rounded-l-md p-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <i className="bx bx-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg"></i>
          </div>
          <button className="bg-blue-600 text-white p-1 rounded-r-md">
            <i className="bx bx-search text-xl"></i>
          </button>
        </div>
        <div className="flex items-center justify-start gap-2 overflow-x-auto scrollbar-hide p-2">
          {user ? (
            <Link
              to="/my-account"
              className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
            >
              <i className="bx bx-user mr-2"></i>My Account
            </Link>
          ) : (
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
            to="/sell"
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

      {/* Category Links (Desktop/Tablet, Centered) */}
      <div className="hidden sm:block border-t border-gray-200 py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs text-gray-600">
            <Link to="/foremade-live" className="hover:text-blue-600">
              Foremade Live
            </Link>
            <Link to="/saved" className="hover:text-blue-600">
              Saved
            </Link>
            <Link to="/electronics" className="hover:text-blue-600">
              Electronics
            </Link>
            <Link to="/motors" className="hover:text-blue-600">
              Motors
            </Link>
            <Link to="/fashion" className="hover:text-blue-600">
              Fashion
            </Link>
            <Link to="/collectibles" className="hover:text-blue-600 hidden lg:inline">
              Collectibles and Art
            </Link>
            <Link to="/sports" className="hover:text-blue-600 hidden lg:inline">
              Sports
            </Link>
            <Link to="/health-beauty" className="hover:text-blue-600 hidden lg:inline">
              Health & Beauty
            </Link>
            <Link to="/industrial" className="hover:text-blue-600 hidden lg:inline">
              Industrial Equipment
            </Link>
            <Link to="/home-garden" className="hover:text-blue-600 hidden lg:inline">
              Home & Garden
            </Link>
            <Link to="/deals" className="hover:text-blue-600 hidden lg:inline">
              Deals
            </Link>
            <Link to="/sell" className="hover:text-blue-600 hidden lg:inline">
              Sell
            </Link>
            <div className="relative group lg:hidden">
              <button className="hover:text-blue-600 flex items-center">
                More <i className="bx bx-chevron-down ml-1"></i>
              </button>
              <div className="absolute hidden group-hover:block bg-white border border-gray-200 py-2 mt-1 z-10 w-48 rounded-md shadow-lg">
                <Link to="/collectibles" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Collectibles and Art
                </Link>
                <Link to="/sports" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Sports
                </Link>
                <Link to="/health-beauty" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Health & Beauty
                </Link>
                <Link to="/industrial" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Industrial Equipment
                </Link>
                <Link to="/home-garden" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Home & Garden
                </Link>
                <Link to="/deals" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Deals
                </Link>
                <Link to="/sell" className="block px-4 py-1 text-xs hover:bg-gray-100">
                  Sell
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar (Mobile) */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 sm:hidden z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-800">Menu</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-600 focus:outline-none"
          >
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-2 text-sm text-gray-600">
          {user ? (
            <div className="flex items-center space-x-2 mb-4">
              <i className="bx bx-user-circle text-2xl text-gray-600"></i>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
          ) : (
            <div className="flex items-center space-x-2 mb-4">
              <i className="bx bx-log-in-circle text-2xl text-gray-600"></i>
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
            </div>
          )}
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
          <Link to="/sell" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-camera text-lg"></i>
            <span>Start Selling</span>
          </Link>
          <Link to="/favorites" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-heart text-lg"></i>
            <span>Favorites</span>
          </Link>
          <Link to="/my-account" className="flex items-center space-x-2 hover:text-blue-600" onClick={() => setIsSidebarOpen(false)}>
            <i className="bx bx-user text-lg"></i>
            <span>My Account</span>
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
          {user && (
            <button
              onClick={() => {
                logout();
                setIsSidebarOpen(false);
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <i className="bx bx-log-out text-lg"></i>
              <span>Logout</span>
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
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
          to="/my-account"
          className={`flex flex-col items-center ${
            location.pathname === '/my-account' ? 'text-blue-600' : 'text-gray-600'
          } hover:text-blue-600`}
        >
          <i className="bx bx-user text-2xl"></i>
          <span className="text-xs">My Foremade</span>
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
          to="/sell"
          className={`flex flex-col items-center ${
            location.pathname === '/sell' ? 'text-blue-600' : 'text-gray-600'
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