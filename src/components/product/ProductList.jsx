import { useState, useEffect } from 'react';
import ProductCard from '../home/ProductCard';
import SkeletonLoader from '../common/SkeletonLoader';

const ProductList = ({ products = [] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [products]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader type="featuredProduct" count={8} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length === 0 ? (
          <p className="text-center col-span-full">No products found.</p>
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