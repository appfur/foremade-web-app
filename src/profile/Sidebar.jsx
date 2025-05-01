import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase';

export default function Sidebar({ userData, orderCount, wishlistCount }) {
  const location = useLocation();

  return (
    <div className="md:w-1/4 bg-gray-50 text-gray-800 rounded-lg p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-4">
          {userData.profileImage ? (
            <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-2xl">👤</span>
          )}
        </div>
        <h3 className="text-lg font-semibold">{userData.name || 'User'}</h3>
        <p className="text-gray-400">{userData.email}</p>
      </div>
      <nav className="space-y-4">
        <Link
          to="/profile"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
            location.pathname === '/profile'
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-800'
          }`}
        >
          <span>👤</span> My Profile
        </Link>
        <Link
          to="/orders"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
            location.pathname === '/orders'
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-800'
          }`}
        >
          <span>📦</span> My Orders <span className="ml-auto text-gray-400">{orderCount}</span>
        </Link>
        <Link
          to="/wishlist"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
            location.pathname === '/wishlist'
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-800'
          }`}
        >
          <span>❤️</span> Wish List <span className="ml-auto text-gray-400">{wishlistCount}</span>
        </Link>
        <Link
          to="/wallet"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
            location.pathname === '/wallet'
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-800'
          }`}
        >
          <span>💳</span> Wallet
        </Link>
        <Link
          to="/loyalty"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
            location.pathname === '/loyalty'
              ? 'bg-blue-100 text-blue-600'
              : 'hover:bg-gray-100 text-gray-800'
          }`}
        >
          <span>🌟</span> Loyalty Points
        </Link>
        <button
          onClick={() => auth.signOut()}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200"
        >
          <span>🚪</span> Sign Out
        </button>
      </nav>
    </div>
  );
}