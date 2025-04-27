import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../db.json';
import { getCart, updateCart } from '/src/utils/cartUtils';

const Product = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const [cart, setCart] = useState([]);

  // Load product from db.json
  useEffect(() => {
    const productId = parseInt(id);
    const foundProduct = db.products.find((p) => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setProduct(null); // Handle case where product isn't found
    }
    console.log('Product ID from URL:', id, 'Parsed ID:', productId);
    console.log('Found Product:', foundProduct);
  }, [id]);

  // Load cart from cartUtils
  useEffect(() => {
    try {
      const cartItems = getCart();
      console.log('Loaded cart in Product.jsx:', cartItems);
      if (Array.isArray(cartItems)) {
        setCart(cartItems);
      } else {
        setCart([]);
        updateCart([]);
      }
    } catch (err) {
      console.error('Error loading cart in Product.jsx:', err);
      setCart([]);
      updateCart([]);
    }
  }, []);

  const addToCart = () => {
    if (!product) return;
    const existingItem = cart.find((item) => item.productId === product.id);
    const updatedCart = existingItem
      ? cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...cart, { productId: product.id, quantity }];
    setCart(updatedCart);
    updateCart(updatedCart);
    console.log('Updated cart in Product.jsx:', updatedCart);
    setMessage(
      <span>
        {product.name} added to cart!{' '}
        <button
          onClick={() => navigate('/cart')}
          className="text-blue-600 hover:underline"
        >
          View Cart
        </button>
      </span>
    );
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Not Found</h1>
        <p className="text-gray-600">
          The product you're looking for doesn't exist.{' '}
          <Link to="/products" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{product.name}</h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <img
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
          />
        </div>
        <div className="md:w-1/2">
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-lg font-semibold text-gray-800 mb-4">
            ₦{product.price.toLocaleString('en-NG', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-gray-600 mb-4">
            Stock:{' '}
            <span className={product.stock === 0 ? 'text-red-600' : 'text-green-600'}>
              {product.stock === 0 ? 'Out of stock' : `${product.stock} units available`}
            </span>
          </p>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-16 p-1 border border-gray-300 rounded text-center"
              disabled={product.stock === 0}
            />
            <button
              onClick={addToCart}
              className={`px-6 py-2 rounded-lg text-white transition ${
                product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;