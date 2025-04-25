import { useState, useEffect } from 'react';
import ProductCard from '../home/ProductCard';
import SkeletonLoader from '../common/SkeletonLoader';

const ProductList = ({ products = [] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ProductList received products:', products);

    // Reset loading state
    setLoading(true);

    // Simulate loading delay
    const timer = setTimeout(() => {
      console.log('Setting loading to false');
      setLoading(false);
    }, 1500);

    return () => {
      console.log('Clearing timer');
      clearTimeout(timer);
    };
  }, []); // Run only on mount, not on products change

  useEffect(() => {
    // If products are available, stop loading immediately
    if (products.length > 0 && loading) {
      console.log('Products available, stopping loader');
      setLoading(false);
    }
  }, [products, loading]);

  if (loading) {
    console.log('Showing SkeletonLoader');
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader type="featuredProduct" count={8} />
      </div>
    );
  }

  console.log('Rendering products:', products);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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