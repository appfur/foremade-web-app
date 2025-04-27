import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
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

  const toggleFavorite = (e, productId) => {
    e.stopPropagation(); // Prevent the Link click event from firing
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter((id) => id !== productId);
      }
      return [...prevFavorites, productId];
    });
  };

  return (
    <div className="relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="border rounded-lg max-md:p-4 p-8">
          <img
            src={product.image || 'https://via.placeholder.com/150'}
            alt={product.name}
            className="w-full h-48 object-cover rounded mb-2"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
          />
          <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
          <p className="text-gray-600">
            ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bx bx-star text-yellow-400 text-sm ${
                  i < Math.floor(product.rating) ? 'bx-star-filled' : ''
                }`}
              ></i>
            ))}
            <span className="text-xs text-gray-600 ml-1">({product.reviews?.length || 0})</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Stock: {product.stock} units</p>
        </div>
      </Link>
      <button
        onClick={(e) => toggleFavorite(e, product.id)}
        className="absolute top-2 right-2 text-xl"
      >
        <i
          className={`bx bx-heart ${
            favorites.includes(product.id) ? 'text-red-500' : 'text-gray-400'
          } hover:text-red-400`}
        ></i>
      </button>
    </div>
  );
};

export default ProductCard;