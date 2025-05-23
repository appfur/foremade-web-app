import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../db.json';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [userData, setUserData] = useState(null);

  // Load watchlist and user data on mount
  useEffect(() => {
    // Load watchlist from localStorage
    const storedWatchlist = localStorage.getItem('watchlist');
    if (storedWatchlist) {
      setWatchlist(JSON.parse(storedWatchlist));
    }

    // Load user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const watchlistProducts = watchlist.map((id) => db.products.find((p) => p.id === id));

  const removeFromWatchlist = (productId) => {
    setWatchlist((prevWatchlist) => prevWatchlist.filter((id) => id !== productId));
  };

  // Get display name (first name or 'Guest')
  const getDisplayName = () => {
    if (userData && userData.name) {
      return userData.name.split(' ')[0] || 'Guest';
    }
    return 'Guest';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        {userData ? (
          <div className="text-gray-800">
            <h2 className="text-xl font-semibold">
              Hello, {getDisplayName()}!
            </h2>
            <p className="text-sm">
              Username: {userData.username || 'Not set'}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">
            Please{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              log in
            </Link>{' '}
            to view your watchlist.
          </p>
        )}
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Watchlist</h1>
      {watchlistProducts.length === 0 ? (
        <p className="text-gray-600">
          Your watchlist is empty.{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {watchlistProducts.map((product) => (
            <div key={product.id} className="bg-gray-100 rounded-lg p-4">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="text-sm font-bold text-gray-800">{product.name}</h3>
                <p className="text-xs text-gray-600">
                  ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </Link>
              <button
                onClick={() => removeFromWatchlist(product.id)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                <i className="bx bx-bookmark text-xl"></i> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;