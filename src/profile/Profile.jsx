import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Spinner from '../components/common/Spinner';

export default function Profile() {
  const [loading, setLoading] = useState(false); // Set to false since no data fetching
  const [error, setError] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [theme, setTheme] = useState('light');

  // Mock data (no Firebase fetching)
  const mockUserData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    profileImage: null, // No profile image by default
  };
  const mockOrderCount = 5;
  const mockWishlistCount = 3;
  const mockWalletBalance = 100.50;
  const mockLoyaltyPoints = 250;

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

      // Simulate image upload (since we're not using Firebase Storage)
      setTimeout(() => {
        const mockDownloadURL = URL.createObjectURL(profileImage);
        setUserData((prev) => ({ ...prev, profileImage: mockDownloadURL }));
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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Use mock data directly
  const [userData, setUserData] = useState(mockUserData);
  const orderCount = mockOrderCount;
  const wishlistCount = mockWishlistCount;
  const walletBalance = mockWalletBalance;
  const loyaltyPoints = mockLoyaltyPoints;

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
            onClick={() => setError('')} // Reset error for retry
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <Sidebar userData={userData} orderCount={orderCount} wishlistCount={wishlistCount} theme={theme} />
        <div className="md:w-3/4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`rounded-lg p-4 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-gray-400">Orders</p>
              <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-gray-800'}`}>{orderCount}</p>
            </div>
            <div className={`rounded-lg p-4 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-gray-400">Wish List</p>
              <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-gray-800'}`}>{wishlistCount}</p>
            </div>
            <div className={`rounded-lg p-4 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-gray-400">Wallet</p>
              <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-gray-800'}`}>₦{walletBalance.toFixed(2)}</p>
            </div>
            <div className={`rounded-lg p-4 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <p className="text-gray-400">Loyalty Points</p>
              <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-gray-800'}`}>{loyaltyPoints} 🌟</p>
            </div>
          </div>
          <div className={`rounded-lg p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
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
                <label className={`cursor-pointer ${theme === 'dark' ? 'text-blue-300 hover:underline' : 'text-blue-600 hover:underline'}`}>
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
                      className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setProfileImage(null);
                        setUploadError('');
                      }}
                      className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-800'} hover:bg-gray-400`}
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
          <div className={`rounded-lg p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Personal Details</h3>
              <Link
                to="/edit"
                className={`flex items-center px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-600'} ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-blue-200'} transition duration-200`}
              >
                Edit Profile
                <span className="ml-2">✏️</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">First Name</p>
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userData.name.split(' ')[0]}</p>
              </div>
              <div>
                <p className="text-gray-400">Last Name</p>
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userData.name.split(' ').slice(1).join(' ') || '-'}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone</p>
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{userData.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className={`font-semibold flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {userData.email}
                  <span className="ml-2 text-green-500">✅</span>
                </p>
              </div>
            </div>
          </div>
          <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">My Addresses</h3>
              <Link
                to="/profile/add-address"
                className={`flex items-center px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-600'} ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-blue-200'} transition duration-200`}
              >
                Add Address
                <span className="ml-2">📍</span>
              </Link>
            </div>
            <div className="text-center">
              <div className={`inline-block p-4 rounded-full mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
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