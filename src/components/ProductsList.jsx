import { useState, useEffect } from 'react';
import api from '../api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api.php');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {products.length === 0 ? (
        <p className="text-center">No products yet.</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <img
              src={`http://localhost/foremadeWebApp/${product.image_url}`}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="text-green-600">${product.price}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;