import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../db.json';
import ProductCard from '/src/components/home/ProductCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  // Load favorites from localStorage on mount and update favoriteProducts
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const parsedFavorites = JSON.parse(storedFavorites);
      if (Array.isArray(parsedFavorites)) {
        setFavorites(parsedFavorites);
      } else {
        setFavorites([]);
        localStorage.setItem('favorites', JSON.stringify([]));
      }
    } else {
      setFavorites([]);
      localStorage.setItem('favorites', JSON.stringify([]));
    }
  }, []);

  // Update favoriteProducts whenever favorites changes
  useEffect(() => {
    const products = favorites
      .map((id) => db.products.find((p) => p.id === id))
      .filter((product) => product !== undefined); // Remove undefined entries
    setFavoriteProducts(products);
  }, [favorites]);

  // Listen for changes to localStorage for favorites
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'favorites') {
        try {
          const updatedFavorites = event.newValue ? JSON.parse(event.newValue) : [];
          if (Array.isArray(updatedFavorites)) {
            setFavorites(updatedFavorites);
          } else {
            setFavorites([]);
            localStorage.setItem('favorites', JSON.stringify([]));
          }
        } catch (err) {
          console.error('Error parsing updated favorites from storage event:', err);
          setFavorites([]);
          localStorage.setItem('favorites', JSON.stringify([]));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Favorites</h1>
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="bx bx-heart text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600 mb-4">
            You have no favorite products.
          </p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-400 font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;