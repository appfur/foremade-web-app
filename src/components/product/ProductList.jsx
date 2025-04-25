import { useState, useEffect } from 'react';
import db from '../../db.json';
import ProductCard from '../home/ProductCard';
import SkeletonLoader from '../common/SkeletonLoader';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = () => {
      try {
        setTimeout(() => {
          const productData = Array.isArray(db.products) ? db.products : [];
          setProducts(productData);
          setLoading(false);
        }, 1500); // 1.5-second delay to match other components
      } catch (err) {
        console.error('Error loading products from db.json:', err);
        setError('Failed to load products');
        setProducts([]);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader type="featuredProduct" count={8} />
      </div>
    );
  }
  
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length === 0 ? (
          <p className="text-center col-span-full">No products available.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;