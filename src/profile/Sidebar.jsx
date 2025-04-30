import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ userData, orderCount, wishlistCount, theme }) {
  return (
    <div className={`md:w-1/4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg p-6`}>
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-600'} ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-blue-200'} transition duration-200`}
        >
          <span>👤</span> My Profile
        </Link>
        <Link
          to="/orders"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition duration-200`}
        >
          <span>📦</span> My Orders <span className="ml-auto text-gray-400">{orderCount}</span>
        </Link>
        <Link
          to="/wishlist"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition duration-200`}
        >
          <span>❤️</span> Wish List <span className="ml-auto text-gray-400">{wishlistCount}</span>
        </Link>
        <Link
          to="/wallet"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition duration-200`}
        >
          <span>💳</span> Wallet
        </Link>
        <Link
          to="/loyalty"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} ${theme === 'dark' ? 'text-white' : 'text-gray-800'} transition duration-200`}
        >
          <span>🌟</span> Loyalty Points
        </Link>
        <button
        //   onClick={() => auth.signOut()}
          className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-red-600 text-white' : 'bg-red-500 text-white'} ${theme === 'dark' ? 'hover:bg-red-700' : 'hover:bg-red-600'} transition duration-200`}
        >
          <span>🚪</span> Sign Out
        </button>
      </nav>
    </div>
  );
}