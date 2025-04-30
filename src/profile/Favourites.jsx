import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import Sidebar from '../profile/Sidebar';
import Spinner from '../components/common/Spinner';

export default function Favorites() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);
  const [userData, setUserData] = useState(null);

  // Mock data for counts
  const mockOrderCount = 5;
  const mockWishlistCount = 3;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(true);
      if (!user) {
        setError('Please sign in to view your wishlist.');
        setIsAuthError(true);
        setLoading(false);
        return;
      }

      const storedUserData = localStorage.getItem('userData');
      let additionalData = {};
      if (storedUserData) {
        additionalData = JSON.parse(storedUserData);
      }

      setUserData({
        email: user.email,
        name: user.displayName || 'User',
        profileImage: additionalData.profileImage || null,
        createdAt: additionalData.createdAt || null,
        address: additionalData.address || 'Not provided',
        uid: user.uid,
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
        {isAuthError ? (
          <Link to="/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        ) : (
          <button
            onClick={() => setError('')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 text-gray-800">
      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar userData={userData} orderCount={mockOrderCount} wishlistCount={mockWishlistCount} />
        <div className="md:w-3/4">
          <div className="rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Wish List</h3>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 rounded-full mb-2 bg-gray-100">
                <span className="text-2xl">❤️</span>
              </div>
              <p className="text-gray-400">No items in your wish list!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}