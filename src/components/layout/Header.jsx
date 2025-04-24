import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-white">
      {/* Status Bar (Mobile Only) */}
      <div className="bg-black text-white text-xs p-1 flex justify-between sm:hidden">
        <span>10:42 AM</span>
        <span>🔋 100%</span>
      </div>

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
                <Link to="/login" className="text-gray-600 hover:underline">
                  Sign in
                </Link>{' '}
                or{' '}
                <Link to="/register" className="text-gray-600 hover:underline">
                  Register
                </Link>
              </p>
            )}
            <Link to="/deals" className="hover:text-blue-600">
              Daily Deals
            </Link>
            {/* Show these links inline on desktop (lg and above) */}
            <Link to="/brands" className="hover:text-blue-600 hidden lg:inline">
              Brand Outlet
            </Link>
            <Link to="/gift-cards" className="hover:text-blue-600 hidden lg:inline">
              Gift Cards
            </Link>
            <Link to="/help" className="hover:text-blue-600 hidden lg:inline">
              Help & Contact
            </Link>
            {/* Show "More" dropdown only on tablet (sm to lg) */}
            <div className="relative group lg:hidden">
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
            <Link to="/sell" className="hover:text-blue-600">
              Sell
            </Link>
            <Link to="/watchlist" className="hover:text-blue-600">
              Watchlist
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
            <i className="bx bx-bell text-gray-600"></i>
            <Link to="/cart" className="flex items-center">
              <i className="bx bx-cart-alt text-gray-600"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
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

        {/* Search Bar (Visible on Desktop and Tablet) */}
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

        {/* Cart Icon (Visible on Mobile) */}
        <div className="flex items-center space-x-4 sm:hidden">
          <Link to="/cart">
            <i className="bx bx-cart-alt text-gray-600 text-2xl"></i>
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 focus:outline-none"
          >
            <i className="bx bx-menu text-2xl"></i>
          </button>
        </div>
      </div>

      {/* Category Links (Visible on Desktop and Tablet, Centered) */}
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
            {/* Show these links inline on desktop (lg and above) */}
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
            {/* Show "More" dropdown only on tablet (sm to lg) */}
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

      {/* Sidebar for Mobile */}
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
        <nav className="flex flex-col p-4 space-y-3 text-sm text-gray-600">
          {user ? (
            <p className="cursor-pointer text-gray-800 font-medium">
              Hi, {user.email}!
            </p>
          ) : (
            <p className="cursor-pointer">
              Hi!{' '}
              <Link to="/login" className="text-blue-600 underline">
                Sign in
              </Link>
              <span className="mx-1">|</span>
              <Link to="/register" className="text-blue-600 underline">
                Register
              </Link>
            </p>
          )}
          <Link to="/deals" className="hover:text-blue-600">
            Hot Deals
          </Link>
          <Link to="/brands" className="hover:text-blue-600">
            Premium Brands
          </Link>
          <Link to="/gift-cards" className="hover:text-blue-600">
            Gift Vouchers
          </Link>
          <Link to="/help" className="hover:text-blue-600">
            Support Center
          </Link>
          <Link to="/ship-to" className="hover:text-blue-600">
            Delivery Options
          </Link>
          <Link to="/sell" className="text-gray-800 hover:text-blue-600">
            Start Selling
          </Link>
          <Link to="/favorites" className="hover:text-blue-600">
            Favorites
          </Link>
          <Link to="/my-account" className="hover:text-blue-600">
            My Account
          </Link>
          <Link to="/watchlist" className="hover:text-blue-600">
            Watchlist
          </Link>
          {user && (
            <button
              onClick={() => {
                logout();
                setIsSidebarOpen(false);
              }}
              className="text-left text-gray-600 hover:text-blue-600"
            >
              Logout
            </button>
          )}
        </nav>
      </div>

      {/* Search Input and Category Buttons for Mobile */}
      <div className="container mx-auto px-4 py-2 sm:hidden">
        <div>
          <div className="relative flex-1 mx-2">
            <input
              type="text"
              placeholder="Search for anything"
              className="w-full text-black border border-gray-300 rounded-full p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <i className="bx bx-camera absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"></i>
          </div>
        </div>

        {/* Category Buttons for Mobile */}
        <div className="flex items-center justify-start gap-2 m-2 overflow-x-auto hide-scrollbar">
          <Link
            to="/saved"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-heart mr-2"></i>Saved
          </Link>
          <Link
            to="/local"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-map mr-2"></i>Local
          </Link>
          <Link
            to="/fashion"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-closet mr-2"></i>Fashion
          </Link>
          <Link
            to="/motors"
            className="flex items-center justify-center bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 whitespace-nowrap"
          >
            <i className="bx bx-car mr-2"></i>Motors
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;