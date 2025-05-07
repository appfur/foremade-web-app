import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '/src/firebase';
import ProductCard from '/src/components/home/ProductCard';

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
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
              categoryId: data.category === 'Electronics' ? 1 : data.category === 'Clothing' ? 2 : 6,
              colors: data.colors || [],
              sizes: data.sizes || [],
              condition: data.condition || '',
              imageUrl: data.imageUrl,
              sellerId: data.sellerId || '',
              rating: Math.random() * 2 + 3, // Mock rating 3–5
              createdAt: data.createdAt || { seconds: 0 },
            };
          })
          .filter((product) => {
            if (!product) {
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
          .sort((a, b) => (b.createdAt.seconds || 0) - (a.createdAt.seconds || 0)) // Sort by createdAt descending
          .slice(0, 4); // Limit to 4

        console.log('Fetched latest products:', products);
        setProducts(products);
      } catch (err) {
        console.error('Error loading latest products:', err);
        setError('Failed to load latest products.');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {error ? (
        <p className="text-red-600 col-span-full">{error}</p>
      ) : loading ? (
        <>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="min-w-[200px] h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </>
      ) : products.length === 0 ? (
        <p className="text-gray-600 col-span-full">No latest products found.</p>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
}