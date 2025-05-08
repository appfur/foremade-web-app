import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '/src/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { toast } from 'react-toastify';
import AddToCartButton from '/src/components/cart/AddToCartButton';

const NotFound = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    'tablet & phones',
    'health & beauty',
    'foremade fashion',
    'electronics',
    'baby products',
    'computers & accessories',
    'game & fun',
    'drinks & categories',
    'home & kitchen',
    'smart watches',
  ];

  useEffect(() => {
    const fetchRandomProducts = async () => {
      setLoading(true);
      try {
        // Select 3–5 random categories
        const selectedCategories = categories
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 3);

        // Fetch up to 4 products per category
        const productPromises = selectedCategories.map(async (category) => {
          const q = query(
            collection(db, 'products'),
            where('category', '==', category),
            limit(4)
          );
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        });

        // Combine, shuffle, and limit to 12 products
        const productArrays = await Promise.all(productPromises);
        const allProducts = productArrays.flat();
        const shuffledProducts = allProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, 12);
        setProducts(shuffledProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <i className="bx bx-error-circle text-8xl text-red-600"></i>
        <h2 className="text-2xl font-bold text-gray-800 mt-6 text-center">{error}</h2>
        <Link
          to="/"
          className="mt-8 inline-flex items-center text-blue-600 hover:underline text-lg"
        >
          <i className="bx bx-home-alt mr-2"></i>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Discover More Products
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Shop sell, smile, check out these great products!
      </p>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <i className="bx bx-cart text-8xl text-gray-600"></i>
          <h2 className="text-2xl font-bold text-gray-800 mt-6 text-center">
            No Products Available
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            Our catalog is empty. Come back soon!
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center text-blue-600 hover:underline text-lg"
          >
            <i className="bx bx-home-alt mr-2"></i>
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm transition-shadow duration-300"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                  }}
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 truncate hover:text-blue-600">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 mt-2 text-xl font-bold">
                  ₦{product.price.toFixed(2)}
                </p>
                <div className="mt-4">
                  <AddToCartButton
                    productId={product.id}
                    stock={product.stock}
                    className="w-full bg-slate-600 text-black py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotFound;