import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '/src/firebase';
import ProductCard from '/src/components/home/ProductCard';

export default function TrendingGadgets() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingGadgets = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'products'),
          where('category', '==', 'Electronics'),
          orderBy('createdAt', 'desc'),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (!data.name || !data.price || !data.imageUrl) {
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
              categoryId: 1, // Electronics
              colors: data.colors || [],
              sizes: data.sizes || [],
              condition: data.condition || '',
              imageUrl: data.imageUrl,
              sellerId: data.sellerId || '',
              sellerName: data.sellerName || 'Unknown Seller',
              rating: Math.random() * 2 + 3, // Mock rating 3–5
              createdAt: data.createdAt || { seconds: 0 },
            };
          })
          .filter((product) => {
            if (!product) return false;
            const isValidImage = product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.startsWith('https://');
            if (!isValidImage) {
              console.warn('Filtered out product with invalid imageUrl:', {
                id: product.id,
                name: product.name,
                imageUrl: product.imageUrl,
              });
            }
            return isValidImage;
          });

        console.log('Fetched trending gadgets:', products);
        setLatestProducts(products);
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Trending in Gadgets
        </h2>
        <Link to="/products?category=1" className="text-blue-600 hover:underline text-sm sm:text-base">
          See All
        </Link>
      </div>
      {error ? (
        <p className="text-red-600 text-sm sm:text-base">{error}</p>
      ) : loading ? (
        <div className="flex space-x-4 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="min-w-[200px] sm:min-w-0 h-[300px] bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      ) : latestProducts.length === 0 ? (
        <p className="text-gray-600 text-sm sm:text-base">No trending gadgets found.</p>
      ) : (
        <div className="flex space-x-4 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-4 scrollbar-hide">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}