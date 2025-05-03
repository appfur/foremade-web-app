import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '/src/firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import dbJson from '/src/db.json';
import { getCart, clearCart } from '/src/utils/cartUtils.js';
import PaystackCheckout from './PaystackCheckout';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Load cart, user email, and authentication status on mount
  useEffect(() => {
    try {
      setLoading(true);
      const cartItems = getCart();
      if (Array.isArray(cartItems)) {
        const validCart = cartItems.filter((item) =>
          dbJson.products.some((p) => p.id === item.productId)
        );
        setCart(validCart);
        if (validCart.length !== cartItems.length) {
          setError('Some cart items were invalid and have been removed.');
        }
      } else {
        setCart([]);
        setError('Cart is empty or invalid.');
      }
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsAuthenticated(!!user);
        if (user?.email) {
          setFormData((prev) => ({ ...prev, email: user.email }));
        }
      }, (error) => {
        console.error('Auth state error:', error);
        setIsAuthenticated(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error('Error loading cart:', err);
      setCart([]);
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Map cart items to include product details
  const cartItems = cart.map((item) => ({
    ...item,
    product: dbJson.products.find((p) => p.id === item.productId),
  }));

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product ? item.product.price * item.quantity : 0),
    0
  );
  const taxRate = 0.075;
  const tax = subtotal * taxRate;
  const shipping = subtotal > 0 ? 500 : 0;
  const totalPrice = subtotal + tax + shipping;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Validate form
  const validateForm = () => {
    const { name, email, address, city, postalCode } = formData;
    if (!name || !email || !address || !city || !postalCode) {
      return { isValid: false, message: 'Please fill in all required fields.' };
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address.' };
    }
    return { isValid: true, message: '' };
  };

  // Memoize form validity
  const formValidity = useMemo(() => validateForm(), [formData]);

  // Handle Paystack success
  const handlePaymentSuccess = useCallback(async () => {
    try {
      if (cart.length === 0) {
        setError('Your cart is empty.');
        return;
      }
      const validation = validateForm();
      if (!validation.isValid) {
        setError(validation.message);
        return;
      }
      const stockIssues = cartItems.filter((item) => item.quantity > (item.product?.stock || 0));
      if (stockIssues.length > 0) {
        const issueMessages = stockIssues.map(
          (item) => `Only ${item.product.stock} units of ${item.product.name} available.`
        );
        setError(`Checkout failed:\n${issueMessages.join('\n')}`);
        return;
      }

      const userId = auth.currentUser?.uid || 'anonymous';
      const order = {
        userId,
        items: cart,
        total: totalPrice,
        date: new Date().toISOString(),
        shippingDetails: formData,
        status: 'completed',
      };
      const orderId = `order-${Date.now()}`;
      await setDoc(doc(db, 'orders', orderId), order);
      setCart([]);
      clearCart();
      setMessage('Order placed successfully!');
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
      setError('Failed to place order. Please try again.');
    }
  }, [cart, cartItems, formData, totalPrice, navigate]);

  // Handle payment initiation for unauthenticated users
  const handlePaymentAttempt = () => {
    if (!isAuthenticated) {
      setError('Please log in to complete your purchase.');
      navigate('/login', { state: { from: '/checkout' }, replace: true });
      return;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      {error && <p className="text-red-600 mb-4 whitespace-pre-line">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {cartItems.length === 0 ? (
        <p className="text-gray-600">
          Your cart is empty.{' '}
          <Link to="/products" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Shipping Details Form */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Details</h2>
            <form className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full md:w-1/3">
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span>
                      {item.product?.name || 'Unknown'} (x{item.quantity})
                    </span>
                    <span>
                      ₦{(item.product?.price * item.quantity || 0).toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (7.5%)</span>
                  <span>₦{tax.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₦{shipping.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 border-t pt-2">
                  <span>Grand Total</span>
                  <span>
                    ₦{totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                {isAuthenticated ? (
                  <PaystackCheckout
                    email={formData.email}
                    amount={totalPrice * 100} // Amount in Kobo
                    totalPrice={totalPrice} // Pass totalPrice for validation
                    onSuccess={handlePaymentSuccess}
                    onClose={() => setMessage('Payment cancelled.')}
                    disabled={!formValidity.isValid || cart.length === 0}
                    buttonText="Pay Now"
                  />
                ) : (
                  <div>
                    <p className="text-red-600 mb-2">Please log in to complete your purchase.</p>
                    <button
                      onClick={handlePaymentAttempt}
                      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Log In to Pay
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;