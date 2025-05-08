import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '/src/firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import dbJson from '/src/db.json';
import { getCart, clearCart, checkout } from '/src/utils/cartUtils';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '/src/components/common/Spinner';
import CartSummary from '/src/components/cart/CartSummary.jsx';
import PaystackCheckout from './PaystackCheckout';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeCheckoutForm = ({ totalPrice, cartItems, formData, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert NGN to GBP (example rate: 1 NGN = 0.0005 GBP, adjust as needed)
      const gbpAmount = totalPrice * 0.0005;

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-payment-intent`,
        {
          amount: gbpAmount,
          currency: 'gbp',
          metadata: {
            userId: auth.currentUser?.uid || 'anonymous',
            orderId: `order-${Date.now()}`,
          },
        }
      );

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.postalCode,
                country: 'GB',
              },
            },
          },
        }
      );

      if (stripeError) {
        toast.error(stripeError.message, { position: 'top-right', autoClose: 3000 });
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!', { position: 'top-right', autoClose: 3000 });
        await onSuccess(paymentIntent);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="p-3 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !stripe || !elements}
          className={`flex-1 py-3 px-4 rounded-lg text-white text-sm font-medium transition duration-200 shadow ${
            loading || !stripe || !elements
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-900 hover:bg-blue-800'
          }`}
        >
          {loading
            ? 'Processing...'
            : `Pay £${(totalPrice * 0.0005).toLocaleString('en-GB', {
                minimumFractionDigits: 2,
              })}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Emmanuel Chinecherem',
    email: 'test@example.com',
    address: 'Not provided',
    city: '',
    postalCode: '',
    country: 'Nigeria',
    phone: '+234-8052975966',
  });

  // Load cart, user data, and authentication status
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
          toast.error('Some cart items were invalid and have been removed.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } else {
        setCart([]);
        toast.error('Cart is empty or invalid.', { position: 'top-right', autoClose: 3000 });
      }

      const unsubscribe = auth.onAuthStateChanged((user) => {
        setIsAuthenticated(!!user);
        if (user) {
          const storedUserData = localStorage.getItem('userData');
          let additionalData = {};
          if (storedUserData) {
            try {
              additionalData = JSON.parse(storedUserData);
              if (typeof additionalData.name !== 'string' || additionalData.name.includes('{')) {
                console.warn('Corrupted name field:', additionalData.name);
                additionalData.name = 'Emmanuel Chinecherem';
              }
              if (typeof additionalData.username !== 'string') {
                additionalData.username = 'emmaChi';
              }
            } catch (err) {
              console.error('Error parsing userData:', err);
              additionalData = {};
            }
          }
          setFormData((prev) => ({
            ...prev,
            email: user.email || 'test@example.com',
            name: additionalData.name || user.displayName || 'Emmanuel Chinecherem',
            address: additionalData.address || 'Not provided',
            country: additionalData.country || 'Nigeria',
            phone: additionalData.phone || '+234-8052975966',
          }));
        }
      }, (error) => {
        console.error('Auth state error:', error);
        setIsAuthenticated(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Error loading cart:', err);
      setCart([]);
      toast.error('Failed to load cart.', { position: 'top-right', autoClose: 3000 });
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
  console.log(totalItems)
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
  };

  // Validate form
  const validateForm = () => {
    const { name, email, address, city, postalCode, country } = formData;
    if (!name || !email || !address || !city || !postalCode || !country) {
      return { isValid: false, message: 'Please fill in all required fields.' };
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { isValid: false, message: 'Please enter a valid email address.' };
    }
    if (!['Nigeria', 'United Kingdom', 'UK'].includes(country)) {
      return {
        isValid: false,
        message: 'Payments are only supported for Nigeria and the United Kingdom.',
      };
    }
    return { isValid: true, message: '' };
  };

  // Memoize form validity
  const formValidity = useMemo(() => validateForm(), [formData]);

  // Handle payment success
  const handlePaymentSuccess = useCallback(
    async (paymentData) => {
      try {
        if (cart.length === 0) {
          toast.error('Your cart is empty.', { position: 'top-right', autoClose: 3000 });
          return;
        }
        const validation = validateForm();
        if (!validation.isValid) {
          toast.error(validation.message, { position: 'top-right', autoClose: 3000 });
          return;
        }
        const stockIssues = cartItems.filter((item) => item.quantity > (item.product?.stock || 0));
        if (stockIssues.length > 0) {
          const issueMessages = stockIssues.map(
            (item) => `Only ${item.product.stock} units of ${item.product.name} available.`
          );
          toast.error(`Checkout failed: ${issueMessages.join(', ')}`, {
            position: 'top-right',
            autoClose: 3000,
          });
          return;
        }

        const userId = auth.currentUser?.uid || 'anonymous';
        const orderId = `order-${Date.now()}`;
        const order = {
          userId,
          items: cart,
          total: totalPrice,
          date: new Date().toISOString(),
          shippingDetails: formData,
          status: 'completed',
          paymentGateway: formData.country === 'Nigeria' ? 'Paystack' : 'Stripe',
          paymentId: paymentData.id || paymentData.reference,
        };

        // Save order to Firestore
        await setDoc(doc(db, 'orders', orderId), order);

        // Update stock in Firestore
        for (const item of cartItems) {
          const productRef = doc(db, 'products', item.productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            const newStock = productSnap.data().stock - item.quantity;
            await updateDoc(productRef, { stock: newStock });
          }
        }

        // Update cart in localStorage
        checkout(); // Call without assigning to localOrder

        setCart([]);
        clearCart();
        toast.success('Order placed successfully!', { position: 'top-right', autoClose: 3000 });
        navigate('/order-confirmation', { state: { order } });
      } catch (err) {
        console.error('Error saving order:', err);
        toast.error('Failed to place order. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    },
    [cart, cartItems, formData, totalPrice, navigate]
  );

  // Handle checkout initiation
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to complete your purchase.', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/login', { state: { from: '/checkout' }, replace: true });
      return;
    }
    if (!formValidity.isValid) {
      toast.error(formValidity.message, { position: 'top-right', autoClose: 3000 });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    toast.info('Payment cancelled.', { position: 'top-right', autoClose: 3000 });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Spinner />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">
          Your cart is empty.{' '}
          <Link to="/products" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Shipping Details Form */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Details</h2>
            <form className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </form>
          </div>

          {/* Order Summary and Payment */}
          <div className="w-full lg:w-1/3">
            <CartSummary
              totalPrice={totalPrice}
              handleCheckout={handleCheckout}
              cartItems={cartItems}
              clearCart={clearCart}
            />
            {isAuthenticated && formValidity.isValid && cart.length > 0 && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
                {['United Kingdom', 'UK'].includes(formData.country) ? (
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm
                      totalPrice={totalPrice}
                      cartItems={cartItems}
                      formData={formData}
                      onSuccess={handlePaymentSuccess}
                      onCancel={handleCancel}
                    />
                  </Elements>
                ) : formData.country === 'Nigeria' ? (
                  <PaystackCheckout
                    email={formData.email}
                    amount={totalPrice * 100} // Amount in Kobo
                    totalPrice={totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onClose={handleCancel}
                    disabled={!formValidity.isValid || cart.length === 0}
                    buttonText="Pay Now"
                    className={`w-full py-3 px-4 rounded-lg text-white text-sm font-medium transition duration-200 shadow ${
                      !formValidity.isValid || cart.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-900 hover:bg-blue-800'
                    }`}
                    iconClass="bx bx-cart mr-2"
                  />
                ) : (
                  <p className="text-red-600 text-sm">
                    Please select a valid country (Nigeria or United Kingdom) to proceed with payment.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Checkout;