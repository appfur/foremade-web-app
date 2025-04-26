import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../db.json';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const favoriteProducts = favorites.map((id) => db.products.find((p) => p.id === id));

  const removeFromFavorites = (productId) => {
    setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== productId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Favorites</h1>
      {favoriteProducts.length === 0 ? (
        <p className="text-gray-600">
          You have no favorite products.{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {favoriteProducts.map((product) => (
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
                onClick={() => removeFromFavorites(product.id)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                <i className="bx bx-heart text-xl"></i> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;