import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../db.json';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      setLoading(true);
      const storedCart = localStorage.getItem('cart');
      console.log('Retrieved cart from localStorage in Cart.jsx:', storedCart); // Debug log
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        console.log('Parsed cart in Cart.jsx:', parsedCart); // Debug log
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          setCart([]);
          localStorage.setItem('cart', JSON.stringify([]));
          setError('Cart data was invalid and has been reset.');
        }
      } else {
        console.log('No cart found in localStorage, setting to empty array'); // Debug log
        setCart([]);
      }
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      setCart([]);
      localStorage.setItem('cart', JSON.stringify([]));
      setError('Failed to load cart. It has been reset.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for changes to localStorage (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'cart') {
        try {
          const updatedCart = event.newValue ? JSON.parse(event.newValue) : [];
          console.log('Storage event - Updated cart in Cart.jsx:', updatedCart); // Debug log
          if (Array.isArray(updatedCart)) {
            setCart(updatedCart);
          } else {
            setCart([]);
            localStorage.setItem('cart', JSON.stringify([]));
            setError('Cart data was invalid and has been reset.');
          }
        } catch (err) {
          console.error('Error parsing updated cart from storage event:', err);
          setCart([]);
          localStorage.setItem('cart', JSON.stringify([]));
          setError('Failed to sync cart. It has been reset.');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Saved cart to localStorage in Cart.jsx:', cart); // Debug log
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
      setError('Failed to save cart changes.');
    }
  }, [cart]);

  // Map cart items to include product details from db.json
  const cartItems = cart.map((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueProducts = cart.length;
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product ? item.product.price * item.quantity : 0);
  }, 0);
  const taxRate = 0.075; // 7.5% tax
  const tax = subtotal * taxRate;
  const shipping = subtotal > 0 ? 500 : 0; // Flat 500 NGN shipping
  const totalPrice = subtotal + tax + shipping;

  // Handlers for cart actions
  const updateCartQuantity = (productId, quantity) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item.product) return;

    if (quantity <= 0) {
      removeFromCart(productId);
    } else if (quantity > item.product.stock) {
      setMessage(`Cannot add more than ${item.product.stock} units of ${item.product.name}.`);
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.product.stock } : item
        )
      );
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
      setMessage(`Updated quantity of ${item.product.name} to ${quantity}.`);
    }
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find((i) => i.productId === productId);
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    setMessage(`Removed ${item.product?.name || 'item'} from cart.`);
  };

  const clearCart = () => {
    setCart([]);
    setMessage('Cart cleared successfully!');
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Validate stock availability
    const stockIssues = cartItems.filter((item) => item.quantity > (item.product?.stock || 0));
    if (stockIssues.length > 0) {
      const issueMessages = stockIssues.map(
        (item) => `Only ${item.product.stock} units of ${item.product.name} available.`
      );
      setError(`Checkout failed:\n${issueMessages.join('\n')}`);
      return;
    }

    const order = {
      id: Date.now(),
      items: cart,
      total: totalPrice,
      date: new Date().toISOString(),
    };

    try {
      const storedOrders = localStorage.getItem('orders');
      const orders = storedOrders ? JSON.parse(storedOrders) : [];
      localStorage.setItem('orders', JSON.stringify([...orders, order]));
      setCart([]);
      setMessage('Order placed successfully!');
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
      {error && (
        <p className="text-red-600 mb-4 whitespace-pre-line">{error}</p>
      )}
      {message && (
        <p className="text-green-600 mb-4">{message}</p>
      )}
      {cartItems.length === 0 ? (
        <p className="text-gray-600">
          Your cart is empty.{' '}
          <Link to="/products" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div>
          {/* Cart Stats */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-sm text-gray-700">
              Total Items: <span className="font-bold">{totalItems}</span>
            </p>
            <p className="text-sm text-gray-700">
              Unique Products: <span className="font-bold">{uniqueProducts}</span>
            </p>
          </div>

          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => {
              const stock = item.product?.stock || 0;
              const isOutOfStock = stock === 0;

              if (!item.product) {
                return (
                  <div key={item.productId} className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Image N/A</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-800">Product Not Found</h3>
                      <p className="text-xs text-gray-600">Item ID: {item.productId}</p>
                      <p className="text-xs text-red-600">This product is no longer available.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove unavailable product from cart"
                      >
                        <i className="bx bx-trash text-xl"></i>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.productId} className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                  <Link to={`/product/${item.productId}`}>
                    <img
                      src={item.product.image || 'https://via.placeholder.com/64'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/64')}
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/product/${item.productId}`} className="text-sm font-bold text-gray-800 hover:underline">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-600">
                      Unit Price: ₦{item.product.price.toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-600">
                      Total: ₦{(item.product.price * item.quantity).toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-600">
                      Stock:{' '}
                      <span className={isOutOfStock ? 'text-red-600' : 'text-green-600'}>
                        {isOutOfStock ? 'Out of stock' : `${stock} units available`}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max={stock}
                      value={item.quantity}
                      onChange={(e) => updateCartQuantity(item.productId, parseInt(e.target.value) || 1)}
                      className="w-16 p-1 border border-gray-300 rounded"
                      disabled={isOutOfStock}
                      aria-label={`Quantity of ${item.product.name}`}
                    />
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <i className="bx bx-trash text-xl"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Items ({totalItems})</span>
                <span>₦{subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (7.5%)</span>
                <span>₦{tax.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₦{shipping.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 border-t pt-2">
                <span>Grand Total</span>
                <span>₦{totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCheckout}
                className={`flex-1 px-6 py-2 rounded-lg text-white transition ${
                  cart.length === 0 || cartItems.some((item) => item.quantity > (item.product?.stock || 0))
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={cart.length === 0 || cartItems.some((item) => item.quantity > (item.product?.stock || 0))}
                aria-label="Proceed to checkout"
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition ${
                  cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={cart.length === 0}
                aria-label="Clear cart"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;