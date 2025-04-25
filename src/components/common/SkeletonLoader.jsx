import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import db from '../../db.json';
import ProductCard from '../home/ProductCard';
import SkeletonLoader from '../common/SkeletonLoader';

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // Find the product by ID
      const foundProduct = db.products.find((p) => p.id === parseInt(id));
      if (foundProduct) {
        setProduct(foundProduct);

        // Find similar products (same category, excluding the current product)
        const related = db.products
          .filter((p) => p.categoryId === foundProduct.categoryId && p.id !== foundProduct.id)
          .slice(0, 4); // Limit to 4 similar products
        setSimilarProducts(related);
      } else {
        setProduct(null);
        setSimilarProducts([]);
      }
      setLoading(false);
    }, 1500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <SkeletonLoader type="productDetail" count={1} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">Product not found.</p>
        <Link to="/products" className="text-blue-500 underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const category = db.categories.find((cat) => cat.id === product.categoryId)?.name || 'Unknown';
  const seller = db.sellers.find((seller) => seller.id === product.sellerId)?.storeName || 'Unknown Seller';

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Product Details */}
        <div className="w-full md:w-3/4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="md:w-1/2">
              <img
                src={product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            </div>
            {/* Product Info */}
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
                <span className="text-sm text-gray-600 ml-2">({product.reviews?.length || 0} reviews)</span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-4">{product.price.toLocaleString()} USD</p>
              <p className="text-sm text-gray-700 mb-4">{product.description}</p>
              <p className="text-sm text-gray-600 mb-4">
                Stock: <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                </span>
              </p>
              <button
                className={`w-full text-sm py-3 rounded-lg transition ${
                  product.stock > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
          {/* Description Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Product Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>
          {/* Reviews Section */}
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
        {/* Similar Products (Desktop: Sidebar, Mobile: Below) */}
        <div className="w-full md:w-1/4">
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
      {/* Similar Products for Mobile (Below Product Details) */}
      <div className="md:hidden mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Similar Products</h2>
        <div className="grid grid-cols-2 gap-4">
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

export default ProductDetail;