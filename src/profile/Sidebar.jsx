import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ userData, orderCount, wishlistCount }) {
  const safeUserData = {
    username: typeof userData?.username === 'string' ? userData.username : 'emmaChi',
    name: typeof userData?.name === 'string' && !userData.name.includes('{') 
      ? userData.name 
      : 'Emmanuel Chinecherem',
    profileImage: userData?.profileImage || null,
  };

  return (
    <div className="md:w-1/4 bg-gray-50 p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {safeUserData.profileImage ? (
            <img src={safeUserData.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <i className="bx bx-user text-gray-500 text-3xl"></i>
          )}
        </div>
        <h3 className="mt-2 text-lg font-semibold text-gray-800">
          {safeUserData.name.split(' ')[0]}
        </h3>
        <p className="text-gray-600 text-sm">{safeUserData.username}</p>
      </div>
      <nav className="flex flex-col space-y-2">
        <Link
          to="/profile"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
        >
          <i className="bx bx-user text-lg"></i>
          <span>Profile</span>
        </Link>
        <Link
          to="/orders"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
        >
          <i className="bx bx-package text-lg"></i>
          <span>Orders ({orderCount})</span>
        </Link>
        <Link
          to="/favorites"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
        >
          <i className="bx bx-heart text-lg"></i>
          <span>Wishlist ({wishlistCount})</span>
        </Link>
        <Link
          to="/address"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
        >
          <i className="bx bx-map text-lg"></i>
          <span>Addresses</span>
        </Link>
        <Link
          to="/setting"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
        >
          <i className="bx bx-cog text-lg"></i>
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}