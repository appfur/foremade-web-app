import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { auth, db } from '/src/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { addToCart } from '/src/utils/cartUtils';
import { toast } from 'react-toastify';
import ProductCard from '/src/components/home/ProductCard';
import SkeletonLoader from '/src/components/common/SkeletonLoader';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Load favorites
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        } else {
          console.warn('Favorites data invalid, resetting to empty array.');
          setFavorites([]);
          localStorage.setItem('favorites', JSON.stringify([]));
        }
      } else {
        setFavorites([]);
        localStorage.setItem('favorites', JSON.stringify([]));
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
      setFavorites([]);
      localStorage.setItem('favorites', JSON.stringify([]));
      toast.error('Failed to load favorites');
    }
  }, []);

  // Listen for favorites changes
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'favorites') {
        try {
          const updatedFavorites = event.newValue ? JSON.parse(event.newValue) : [];
          if (Array.isArray(updatedFavorites)) {
            setFavorites(updatedFavorites);
          } else {
            console.warn('Favorites data invalid in storage event, resetting.');
            setFavorites([]);
            localStorage.setItem('favorites', JSON.stringify([]));
            toast.error('Favorites data invalid');
          }
        } catch (err) {
          console.error('Error parsing updated favorites:', err);
          setFavorites([]);
          localStorage.setItem('favorites', JSON.stringify([]));
          toast.error('Failed to sync favorites');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (err) {
      console.error('Error saving favorites:', err);
      toast.error('Failed to save favorites');
    }
  }, [favorites]);

  // Load product and similar products
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const data = productSnap.data();
          if (!data.name || !data.price || !data.category || !data.imageUrl) {
            console.warn('Invalid product data:', { id, data });
            setError('Invalid product data.');
            setProduct(null);
            return;
          }
          const productData = {
            id: productSnap.id,
            name: data.name,
            description: data.description || '',
            price: data.price,
            stock: data.stock || 0,
            category: data.category.trim().toLowerCase(),
            categoryId: {
              'tablet & phones': 1,
              'health & beauty': 2,
              'foremade fashion': 3,
              'electronics': 4,
              'baby products': 5,
              'computers & accessories': 6,
              'game & fun': 7,
              'drinks & categories': 8,
              'home & kitchen': 9,
              'smart watches': 10,
            }[data.category.toLowerCase()] || 0,
            colors: data.colors || [],
            sizes: data.sizes || [],
            condition: data.condition || '',
            imageUrl: data.imageUrl,
            seller: data.seller || { name: 'Unknown Seller' },
            rating: data.rating || Math.random() * 2 + 3,
            reviews: data.reviews || [],
          };
          if (!productData.imageUrl || !productData.imageUrl.startsWith('https://')) {
            console.warn('Invalid product imageUrl:', { id, imageUrl: productData.imageUrl });
            setError('Invalid product image.');
            setProduct(null);
            return;
          }
          setProduct(productData);

          // Fetch similar products
          const similarQuery = query(collection(db, 'products'), where('category', '==', productData.category));
          const querySnapshot = await getDocs(similarQuery);
          console.log('Raw similar products count:', querySnapshot.size);
          const similar = querySnapshot.docs
            .map((doc) => {
              const data = doc.data();
              if (!data.name || !data.price || !data.category || !data.imageUrl || doc.id === id) {
                console.warn('Invalid similar product data:', { id: doc.id, data });
                return null;
              }
              return {
                id: doc.id,
                name: data.name,
                description: data.description || '',
                price: data.price,
                stock: data.stock || 0,
                category: data.category,
                categoryId: {
                  'tablet & phones': 1,
                  'health & beauty': 2,
                  'foremade fashion': 3,
                  'electronics': 4,
                  'baby products': 5,
                  'computers & accessories': 6,
                  'game & fun': 7,
                  'drinks & categories': 8,
                  'home & kitchen': 9,
                  'smart watches': 10,
                }[data.category.toLowerCase()] || 0,
                colors: data.colors || [],
                sizes: data.sizes || [],
                condition: data.condition || '',
                imageUrl: data.imageUrl,
                seller: data.seller || { name: 'Unknown Seller' },
                rating: data.rating || Math.random() * 2 + 3,
              };
            })
            .filter((product) => {
              if (!product) return false;
              const isValidImage = product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.startsWith('https://');
              if (!isValidImage) {
                console.warn('Filtered out similar product with invalid imageUrl:', {
                  id: product.id,
                  name: product.name,
                  imageUrl: product.imageUrl,
                });
              }
              return isValidImage;
            });

          console.log('Fetched similar products:', similar);
          setSimilarProducts(similar);
        } else {
          setError('Product not found.');
          setProduct(null);
          setSimilarProducts([]);
        }
      } catch (err) {
        console.error('Error loading product:', {
          message: err.message,
          code: err.code,
          stack: err.stack,
        });
        setError('Failed to load product: ' + err.message);
        setProduct(null);
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!auth.currentUser) {
      toast.error('Please log in to add items to cart');
      navigate('/login');
      return;
    }

    try {
      if (quantity > product.stock) {
        toast.error(`Cannot add more than ${product.stock} units of ${product.name}`);
        setQuantity(product.stock > 0 ? product.stock : 1);
        return;
      }
      await addToCart(auth.currentUser.uid, product.id, quantity);
      toast.success(`${product.name} added to cart!`);
      setQuantity(1);
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart');
    }
  };

  const toggleFavorite = () => {
    if (!product) return;
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(product.id)) {
        toast.success('Removed from favorites');
        return prevFavorites.filter((id) => id !== product.id);
      }
      toast.success('Added to favorites!');
      return [...prevFavorites, product.id];
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader type="productDetail" count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">Product not found.</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const category = product.category || 'unknown';
  const seller = product.seller?.name || 'Unknown Seller';

  const DESCRIPTION_LIMIT = 100;
  const truncatedDescription =
    product.description.length > DESCRIPTION_LIMIT
      ? `${product.description.substring(0, DESCRIPTION_LIMIT)}...`
      : product.description;
  const shouldShowToggle = product.description.length > DESCRIPTION_LIMIT;

  return (
    <div className="relative container mx-auto p-5">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img
                src={product.imageUrl || '/images/placeholder.jpg'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  console.error('Image load error:', { id: product.id, imageUrl: product.imageUrl });
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <p className="text-sm text-gray-600 mb-2">
                Category: <span className="font-medium">{category}</span>
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Sold by: <span className="font-medium">{seller}</span>
              </p>
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`bx bx-star text-yellow-400 text-lg ${
                      i < Math.floor(product.rating) ? 'bx-star-filled' : ''
                    }`}
                  ></i>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-4">
                ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Stock:{' '}
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                </span>
              </p>
              <div className="flex items-center mb-4">
                <label className="mr-2 text-sm text-gray-600">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 p-1 border border-gray-300 rounded"
                  disabled={product.stock === 0}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`w-full px-2 py-1 text-xs rounded-lg transition ${
                    product.stock > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center justify-center gap-2 px-2 py-1 text-xs border rounded-lg transition ${
                    favorites.includes(product.id)
                      ? 'border-red-500 text-red-500 hover:bg-red-50'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i
                    className={`bx bxs-heart text-xl ${
                      favorites.includes(product.id) ? 'text-red-500' : 'text-gray-400'
                    }`}
                  ></i>
                  {favorites.includes(product.id) ? 'Remove' : 'Add'}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Product Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {showFullDescription ? product.description : truncatedDescription}
            </p>
            {shouldShowToggle && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                {showFullDescription ? 'Show Less' : 'See More'}
              </button>
            )}
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Customer Reviews</h2>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 py-3">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bx bx-star text-yellow-400 text-sm ${
                          i < Math.floor(review.rating) ? 'bx-star-filled' : ''
                        }`}
                      ></i>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">({review.rating})</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
                  <p className="text-xs text-gray-500">Posted on {review.date}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/5 max-md:hidden overflow-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Similar Products</h2>
          <div className="flex flex-col gap-4 md:border-l md:pl-4">
            {similarProducts.length > 0 ? (
              similarProducts.map((similarProduct) => (
                <div key={similarProduct.id} className="md:w-full">
                  <ProductCard product={similarProduct} />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No similar products found.</p>
            )}
          </div>
        </div>
      </div>
      <div className="md:hidden lg:hidden xl:hidden mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Similar Products</h2>
        <div className="grid grid-cols-2 gap-4 overflow-auto">
          {similarProducts.length > 0 ? (
            similarProducts.map((similarProduct) => (
              <ProductCard key={similarProduct.id} product={similarProduct} />
            ))
          ) : (
            <p className="text-sm text-gray-600 col-span-2">No similar products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;