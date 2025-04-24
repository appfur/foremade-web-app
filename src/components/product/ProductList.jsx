import { useState, useEffect } from 'react';
import api from '../../utils/api';
import ProductCard from '../home/ProductCard';
import Spinner from '../common/Spinner';

const ProductList = () => {
  const [products, setProducts] = useState([]); // Ensure initial state is an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products.php');
        // Log response to debug
        console.log('API response:', response.data);
        // Ensure response.data is an array; fallback to empty array if not
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('API error:', err);
        setError(err.response?.data?.error || 'Failed to load products');
        setProducts([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.length === 0 ? (
        <p className="text-center col-span-full">No products available.</p>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
};

export default ProductList;