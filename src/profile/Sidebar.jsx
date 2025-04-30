import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ userData, orderCount, wishlistCount, theme }) {
  return (
    <div className={`md:w-1/4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg p-6`}>
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 overflow-hidden">
          {userData.profileImage ? (
            <img
              src={userData.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-gray-500 text-2xl">👤</span>
          )}
        </div>
        <h2 className="text-lg font-semibold">{userData.name}</h2>
        <p className="text-sm text-gray-500">
          Joined {new Date(userData.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
      <nav className="space-y-2">
        <Link
          to="/profile"
          className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-600'}`}
        >
          <span className="mr-3">👤</span>
          My Profile
        </Link>
        <Link
          to="/orders"
          className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <span className="mr-3">📦</span>
          Orders
          <span className={`ml-auto ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs rounded-full px-2 py-1`}>
            {orderCount || 0}
          </span>
        </Link>
        <Link
          to="/restock-requests"
          className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <span className="mr-3">🔄</span>
          Restock Requests
        </Link>
        <Link
          to="/wishlist"
          className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <span className="mr-3">❤️</span>
          Wish List
          <span className={`ml-auto ${theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs rounded-full px-2 py-1`}>
            {wishlistCount || 0}
          </span>
        </Link>
        <Link
          to="/compare-list"
          className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <span className="mr-3">⚖️</span>
          Compare List
        </Link>
        <Link
          to="/wallet"
          className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <span className="mr-3">💼</span>
          Wallet
        </Link>
      </nav>
    </div>
  );
}