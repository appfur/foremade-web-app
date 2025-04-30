import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
          } else {
            setError('User data not found.');
          }
        } else {
          setError('Please sign in to view your profile.');
        }
      } catch (err) {
        setError('Failed to load profile data. Please try again later.');
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <span className="text-gray-500 text-2xl">👤</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{userData.name}</h2>
            <p className="text-sm text-gray-600">
              Joined 29 Apr. 2025
            </p>
          </div>
          <nav className="space-y-2">
            <Link
              to="/profile"
              className="flex items-center p-3 bg-blue-100 text-blue-600 rounded-lg"
            >
              <span className="mr-3">👤</span>
              My Profile
            </Link>
            <Link
              to="/orders"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-3">📦</span>
              Orders
              <span className="ml-auto bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                0
              </span>
            </Link>
            <Link
              to="/restock-requests"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-3">🔄</span>
              Restock Requests
            </Link>
            <Link
              to="/wishlist"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-3">❤️</span>
              Wish List
              <span className="ml-auto bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-1">
                0
              </span>
            </Link>
            <Link
              to="/compare-list"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-3">⚖️</span>
              Compare List
            </Link>
            <Link
              to="/wallet"
              className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-3">💼</span>
              Wallet
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-gray-600">Orders</p>
              <p className="text-lg font-semibold text-gray-800">0</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-gray-600">Wish List</p>
              <p className="text-lg font-semibold text-gray-800">0</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-gray-600">Wallet</p>
              <p className="text-lg font-semibold text-gray-800">₦0.0</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-gray-600">Loyalty Point</p>
              <p className="text-lg font-semibold text-gray-800">🌟</p>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Personal Details</h3>
              <Link
                to="/profile/edit"
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition duration-200"
              >
                Edit Profile
                <span className="ml-2">✏️</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">First Name</p>
                <p className="text-gray-800 font-semibold">{userData.name.split(' ')[0]}</p>
              </div>
              <div>
                <p className="text-gray-600">Last Name</p>
                <p className="text-gray-800 font-semibold">{userData.name.split(' ').slice(1).join(' ') || '-'}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="text-gray-800 font-semibold">{userData.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="text-gray-800 font-semibold flex items-center">
                  {userData.email}
                  <span className="ml-2 text-green-500">✅</span>
                </p>
              </div>
            </div>
          </div>

          {/* My Addresses Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">My Addresses</h3>
              <Link
                to="/profile/add-address"
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition duration-200"
              >
                Add Address
                <span className="ml-2">📍</span>
              </Link>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-2">
                <span className="text-2xl">📍</span>
              </div>
              <p className="text-gray-600">No address found!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}