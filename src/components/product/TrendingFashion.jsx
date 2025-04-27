import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../../db.json';
import ProductCard from '/src/components/home/ProductCard';

export default function TrendingFashion() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      try {
        const fashionProducts = db.products
          .filter((product) => product.categoryId === 1 && product.rating >= 4.5)
          .slice(0, 4); // Limit to 4 products
        setTrendingProducts(fashionProducts);
      } catch (err) {
        console.error('Error loading trending fashion products:', err);
        setTrendingProducts([]);
      } finally {
        setLoading(false);
      }
    }, 1000); // Simulate loading delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-lg md:text-xl font-bold mt-4 text-gray-800 mb-4">
          Trending in Fashion
        </h2>        
        <Link to="/products?category=1" className="text-blue-600 hover:underline text-sm">
          See All
        </Link>
      </div>
      {loading ? (
        <div className="flex space-x-4 overflow-x-auto">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="min-w-[200px] h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : trendingProducts.length === 0 ? (
        <p className="text-gray-600">No trending fashion products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}