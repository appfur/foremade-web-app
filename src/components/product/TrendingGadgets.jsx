import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '/src/firebase';
import ProductCard from '/src/components/home/ProductCard';

export default function TrendingGadgets() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingGadgets = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (!data.name || !data.price || !data.category || !data.imageUrl) {
              console.warn('Invalid product data:', { id: doc.id, data });
              return null;
            }
            return {
              id: doc.id,
              name: data.name,
              description: data.description || '',
              price: data.price,
              stock: data.stock || 0,
              category: data.category,
              categoryId: data.category === 'Electronics' ? 1 : null,
              colors: data.colors || [],
              sizes: data.sizes || [],
              condition: data.condition || '',
              imageUrl: data.imageUrl,
              sellerId: data.sellerId || '',
              rating: Math.random() * 2 + 3, // Mock rating 3–5
            };
          })
          .filter((product) => {
            if (!product || product.category !== 'Electronics' || product.rating < 4.5) {
              return false;
            }
            const isValidImage = product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.startsWith('https://');
            if (!isValidImage) {
              console.warn('Filtered out product with invalid imageUrl:', {
                id: product.id,
                name: product.name,
                imageUrl: product.imageUrl,
              });
            }
            return isValidImage;
          })
          .slice(0, 4); // Limit to 4

        console.log('Fetched trending gadget products:', products);
        setTrendingProducts(products);
      } catch (err) {
        console.error('Error loading trending gadgets:', err);
        setError('Failed to load trending gadgets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGadgets();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-lg md:text-xl font-bold mt-4 text-gray-800 mb-4">
          Trending in Gadgets
        </h2>
        <Link to="/products?category=1" className="text-blue-600 hover:underline text-sm">
          See All
        </Link>
      </div>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : loading ? (
        <div className="flex space-x-4 overflow-x-auto">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="min-w-[200px] h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : trendingProducts.length === 0 ? (
        <p className="text-gray-600">No trending gadgets found.</p>
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