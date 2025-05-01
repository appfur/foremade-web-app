import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Only import Firebase Auth
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Spinner from '../components/common/Spinner';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userData, setUserData] = useState(null);

  // Mock data for counts (since we're not fetching from Firestore)
  const mockOrderCount = 5;
  const mockWishlistCount = 3;
  const mockWalletBalance = 100.50;
  const mockLoyaltyPoints = 250;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(true);
      if (!user) {
        setError('Please sign in to view your profile.');
        setIsAuthError(true);
        setLoading(false);
        return;
      }

      // Load additional user data from local storage
      const storedUserData = localStorage.getItem('userData');
      let additionalData = {};
      if (storedUserData) {
        additionalData = JSON.parse(storedUserData);
      }

      // Fetch name and email from Firebase Auth, merge with local storage data
      setUserData({
        email: user.email,
        name: user.displayName || 'User', // Fetch name from Firebase Auth
        profileImage: additionalData.profileImage || null,
        createdAt: additionalData.createdAt || null, // Date joined
        address: additionalData.address || 'Not provided',
        uid: user.uid,
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB.');
      return;
    }

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadError('');
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;

    try {
      setUploading(true);
      setUploadError('');

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 200);

      // Simulate image upload by saving to local storage
      const newImageUrl = URL.createObjectURL(profileImage);
      setTimeout(() => {
        setUserData((prev) => {
          const updatedData = { ...prev, profileImage: newImageUrl };
          // Update local storage with new image URL
          localStorage.setItem('userData', JSON.stringify(updatedData));
          return updatedData;
        });
        setProfileImage(null);
        setImagePreview(null);
        setUploadProgress(0);
        setUploading(false);
      }, 2000); // Simulate a 2-second upload
    } catch (err) {
      console.error('Image upload error:', err);
      setUploadError('Failed to upload image. Please try again.');
      setUploading(false);
    }
  };

  // Format the createdAt date for display
  const formatDate = (isoString) => {
    if (!isoString) return 'Not available';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar userData={userData} orderCount={mockOrderCount} wishlistCount={mockWishlistCount} />
        <div className="md:w-3/4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-lg p-4 text-center bg-gray-50">
              <p className="text-gray-400">Orders</p>
              <p className="text-lg font-semibold text-gray-800">{mockOrderCount}</p>
            </div>
            <div className="rounded-lg p-4 text-center bg-gray-50">
              <p className="text-gray-400">Wish List</p>
              <p className="text-lg font-semibold text-gray-800">{mockWishlistCount}</p>
            </div>
            <div className="rounded-lg p-4 text-center bg-gray-50">
              <p className="text-gray-400">Wallet</p>
              <p className="text-lg font-semibold text-gray-800">₦{mockWalletBalance.toFixed(2)}</p>
            </div>
            <div className="rounded-lg p-4 text-center bg-gray-50">
              <p className="text-gray-400">Loyalty Points</p>
              <p className="text-lg font-semibold text-gray-800">{mockLoyaltyPoints} 🌟</p>
            </div>
          </div>
          <div className="rounded-lg p-6 mb-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : userData.profileImage ? (
                  <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500 text-2xl">👤</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer text-blue-600 hover:underline">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleImageUpload}
                      disabled={uploading}
                      className={`px-4 py-2 rounded-lg bg-blue-500 text-white ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setProfileImage(null);
                        setUploadError('');
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                {uploadError && (
                  <p className="text-red-600 text-sm mt-2">{uploadError}</p>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-lg p-6 mb-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Personal Details</h3>
              <Link
                to="/edit"
                className="flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition duration-200"
              >
                Edit Profile
                <span className="ml-2">✏️</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400">First Name</p>
                <p className="font-semibold text-gray-800">{userData.name.split(' ')[0]}</p>
              </div>
              <div>
                <p className="text-slate-400">Last Name</p>
                <p className="font-semibold text-gray-800">{userData.name.split(' ').slice(1).join(' ') || '-'}</p>
              </div>
              <div>
                <p className="text-slate-400">Email</p>
                <p className="font-semibold flex items-center text-gray-800">
                  {userData.email}
                  <span className="ml-2 text-green-500">✅</span>
                </p>
              </div>
              <div>
                <p className="text-slate-400">Date Joined</p>
                <p className="font-semibold text-gray-800">{formatDate(userData.createdAt)}</p>
              </div>
              <div>
                <p className="text-slate-400">Address</p>
                <p className="font-semibold text-gray-800">{userData.address}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">My Addresses</h3>
              <Link
                to="/profile/add-address"
                className="flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition duration-200"
              >
                Add Address
                <span className="ml-2">📍</span>
              </Link>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 rounded-full mb-2 bg-gray-100">
                <span className="text-2xl">📍</span>
              </div>
              <p className="text-gray-400">No address found!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}