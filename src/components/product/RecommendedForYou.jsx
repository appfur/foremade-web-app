import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../../db.json';
import SkeletonLoader from '../common/SkeletonLoader';
import BestSelling from './BestSelling';

const RecommendedForYou = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    const fetchProducts = () => {
      try {
        setTimeout(() => {
          const productData = Array.isArray(db.products) ? db.products.slice(0, 8) : [];
          setProducts(productData);
          setLoading(false);
        }, 1500); // 1.5-second delay
      } catch (err) {
        console.error('Error loading products from db.json:', err);
        setProducts([]);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Format price in Naira
  const formatPrice = (price) => {
    return `₦${price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Sort products for "Latest Products" (e.g., by id descending)
  const getLatestProducts = () => {
    return [...products].sort((a, b) => b.id - a.id);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex-col items-center justify-between mb-4">
          <h2 className="text-lg text-center sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-4">
            Recommended For You
          </h2>
          {/* Desktop Skeleton (Text) */}
          <div className="hidden sm:flex items-center justify-center gap-4 sm:gap-6">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          {/* Mobile Skeleton (Icons) */}
          <div className="flex sm:hidden items-center justify-center gap-4">
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <SkeletonLoader type="recommended" count={4} />
        <SkeletonLoader type="recommended" count={4} />
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex-col items-center justify-between mb-4">
        <h2 className="text-lg text-center sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-4">
          Recommended For You
        </h2>
        {/* Desktop Tabs (Text) */}
        <div className="hidden sm:flex items-center justify-center gap-4 sm:gap-6 mb-10">
          <button
            className={`text-sm ${
              activeTab === 'featured' ? 'text-blue-600 font-semibold' : 'text-gray-600'
            } hover:text-blue-600`}
            onClick={() => setActiveTab('featured')}
          >
            Featured Products
          </button>
          <button
            className={`text-sm ${
              activeTab === 'bestSelling' ? 'text-blue-600 font-semibold' : 'text-gray-600'
            } hover:text-blue-600`}
            onClick={() => setActiveTab('bestSelling')}
          >
            Best Selling
          </button>
          <button
            className={`text-sm ${
              activeTab === 'latest' ? 'text-blue-600 font-semibold' : 'text-gray-600'
            } hover:text-blue-600`}
            onClick={() => setActiveTab('latest')}
          >
            Latest Products
          </button>
          <Link to="/products" className="text-blue-600 text-sm hover:underline">
            View All
          </Link>
        </div>
        {/* Mobile Tabs (Icons) */}
        <div className="flex sm:hidden items-center justify-center gap-4">
          <button
            className={`text-xl ${
              activeTab === 'featured' ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600`}
            onClick={() => setActiveTab('featured')}
          >
            <i className="bx bx-star"></i>
          </button>
          <button
            className={`text-xl ${
              activeTab === 'bestSelling' ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600`}
            onClick={() => setActiveTab('bestSelling')}
          >
            <i className='bx bxs-hot'></i>
          </button>
          <button
            className={`text-xl ${
              activeTab === 'latest' ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600`}
            onClick={() => setActiveTab('latest')}
          >
            <i className="bx bx-time"></i>
          </button>
          <Link to="/products" className="text-blue-600 text-xl hover:text-blue-600">
            <i className="bx bx-right-arrow-alt"></i>
          </Link>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'featured' && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`bx bx-star text-yellow-400 text-sm ${
                      i < Math.floor(product.rating) ? 'bx-star-filled' : ''
                    }`}
                  ></i>
                ))}
                <span className="text-xs text-gray-600 ml-1">({product.reviewCount || 0})</span>
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1 uppercase truncate">
                {product.name}
              </h3>
              <p className="text-sm font-bold text-gray-800">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'bestSelling' && <BestSelling />}

      {activeTab === 'latest' && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {getLatestProducts().map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`bx bx-star text-yellow-400 text-sm ${
                      i < Math.floor(product.rating) ? 'bx-star-filled' : ''
                    }`}
                  ></i>
                ))}
                <span className="text-xs text-gray-600 ml-1">({product.reviewCount || 0})</span>
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1 uppercase truncate">
                {product.name}
              </h3>
              <p className="text-sm font-bold text-gray-800">{formatPrice(product.price)}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedForYou;