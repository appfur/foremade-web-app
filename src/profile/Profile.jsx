import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the reusable Sidebar component
import Spinner from '../components/common/Spinner';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [theme, setTheme] = useState('light'); // Theme state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          // Fetch user data
          const userDoc = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
          } else {
            setError('User data not found.');
            return;
          }

          // Fetch order count
          const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
          const ordersSnapshot = await getDocs(ordersQuery);
          setOrderCount(ordersSnapshot.size);

          // Fetch wishlist count
          const wishlistQuery = query(collection(db, 'wishlist'), where('userId', '==', user.uid));
          const wishlistSnapshot = await getDocs(wishlistQuery);
          setWishlistCount(wishlistSnapshot.size);

          // Fetch wallet balance (assuming a wallet document exists)
          const walletDoc = doc(db, 'wallets', user.uid);
          const walletSnapshot = await getDoc(walletDoc);
          if (walletSnapshot.exists()) {
            setWalletBalance(walletSnapshot.data().balance || 0);
          }

          // Fetch loyalty points (assuming a loyalty document exists)
          const loyaltyDoc = doc(db, 'loyalty', user.uid);
          const loyaltySnapshot = await getDoc(loyaltyDoc);
          if (loyaltySnapshot.exists()) {
            setLoyaltyPoints(loyaltySnapshot.data().points || 0);
          }
        } else {
          setError('Please sign in to view your profile.');
        }
      } catch (err) {
        setError('Failed to load profile data. Please try again later.');
        console.error('Profile load error:', err);
      } finally {
        setLoading(false);
      }
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

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
      const user = auth.currentUser;
      if (!user) {
        setUploadError('You must be signed in to upload an image.');
        setUploading(false);
        return;
      }

      // Simulate upload progress (Firebase Storage doesn't provide progress natively in this setup)
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 200);

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `profile_pictures/${user.uid}/${profileImage.name}`);
      await uploadBytes(storageRef, profileImage);
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firestore with the image URL
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, { profileImage: downloadURL });

      // Update local state
      setUserData((prev) => ({ ...prev, profileImage: downloadURL }));
      setProfileImage(null);
      setImagePreview(null);
      setUploadProgress(0);
    } catch (err) {
      console.error('Image upload error:', err);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
        <Link to="/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
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
        {/* Sidebar */}
        <Sidebar userData={userData} orderCount={orderCount} wishlistCount={wishlistCount} theme={theme} />

        {/* Main Content */}
        <div className="md:w-3/4">
          {/* Stats Section */}
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

          {/* Profile Image Upload Section */}
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

          {/* Personal Details Section */}
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

          {/* My Addresses Section */}
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