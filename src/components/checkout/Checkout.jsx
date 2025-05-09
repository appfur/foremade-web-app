import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '/src/firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { getCart, clearCart } from '/src/utils/cartUtils';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '/src/components/common/Spinner';
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
      const gbpAmount = Math.round(totalPrice * 0.0005 * 100); // Convert to pence
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
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
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
      });
      if (error) {
        toast.error(error.message, { position: 'top-right', autoClose: 3000 });
        return;
      }
      if (paymentIntent.status === 'succeeded') {
        await onSuccess(paymentIntent);
      }
    } catch (err) {
      console.error('Stripe payment error:', err);
      toast.error(
        err.code === 'ERR_NETWORK'
          ? 'Unable to connect to payment server. Please try again later.'
          : 'Payment failed. Try again.',
        { position: 'top-right', autoClose: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <CardElement
          options={{
            style: {
              base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
              invalid: { color: '#9e2146' },
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
          {loading ? 'Processing...' : `Pay £${(totalPrice * 0.0005).toFixed(2)}`}
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
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Nigeria',
    phone: '',
  });

  useEffect(() => {
    const loadCartAndUserData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        const cartItems = await getCart(user?.uid);
        console.log('Loaded cart items:', cartItems);
        setCart(cartItems);

        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setFormData((prev) => ({
              ...prev,
              name: userData.name || user.displayName || '',
              email: userData.email || user.email || '',
              address: userData.address || '',
              city: userData.city || '',
              postalCode: userData.postalCode || '',
              country: userData.country || 'Nigeria',
              phone: userData.phone || '',
            }));
          }
        }
      } catch (err) {
        console.error('Error loading cart or user data:', err);
        setCart([]);
        toast.error('Failed to load data.', { position: 'top-right', autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    const handleCartUpdate = async () => {
      try {
        const user = auth.currentUser;
        const cartItems = await getCart(user?.uid);
        setCart(cartItems);
      } catch (err) {
        console.error('Error updating cart:', err);
        toast.error('Failed to update cart.', { position: 'top-right', autoClose: 3000 });
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      loadCartAndUserData();
    });

    return () => {
      unsubscribe();
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) => total + (item.product ? item.product.price * item.quantity : 0),
    0
  );
  const taxRate = 0.075;
  const tax = subtotal * taxRate;
  const shipping = subtotal > 0 ? 500 : 0;
  const totalPrice = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, address, city, postalCode, country, phone } = formData;
    if (!name || !email || !address || !city || !postalCode || !country || !phone) {
      return { isValid: false, message: 'All fields are required.' };
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { isValid: false, message: 'Invalid email address.' };
    }
    if (!['Nigeria', 'United Kingdom'].includes(country)) {
      return { isValid: false, message: 'Select Nigeria or United Kingdom.' };
    }
    return { isValid: true, message: '' };
  };

  const formValidity = useMemo(() => validateForm(), [formData]);

  const handlePaymentSuccess = useCallback(
    async (paymentData) => {
      try {
        if (cart.length === 0) {
          toast.error('Cart is empty.', { position: 'top-right', autoClose: 3000 });
          return;
        }
        const validation = validateForm();
        if (!validation.isValid) {
          toast.error(validation.message, { position: 'top-right', autoClose: 3000 });
          return;
        }
        const stockIssues = cart.filter((item) => item.quantity > (item.product?.stock || 0));
        if (stockIssues.length > 0) {
          toast.error('Stock issues detected.', { position: 'top-right', autoClose: 3000 });
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

        await setDoc(doc(db, 'orders', orderId), order);
        for (const item of cart) {
          const productRef = doc(db, 'products', item.productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            await updateDoc(productRef, { stock: productSnap.data().stock - item.quantity });
          }
        }

        if (auth.currentUser) {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          await setDoc(
            userDocRef,
            {
              name: formData.name,
              email: formData.email,
              address: formData.address,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
              phone: formData.phone,
            },
            { merge: true }
          );
        }

        await clearCart(auth.currentUser?.uid);
        setCart([]);
        toast.success('Order placed successfully!', { position: 'top-right', autoClose: 3000 });
        navigate('/order-confirmation', { state: { order } });
      } catch (err) {
        console.error('Checkout error:', err);
        toast.error('Failed to place order.', { position: 'top-right', autoClose: 3000 });
      }
    },
    [cart, formData, totalPrice, navigate]
  );

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
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Your cart is empty.{' '}
            <Link to="/products" className="text-blue-600 hover:underline">
              Continue shopping
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
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
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </form>
          </div>
          <div className="w-full lg:w-1/3">
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>
                {cart.map((item) => (
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
                  <span>₦{totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="mt-6 border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
                  <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
                  <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
                  <p><strong>Address:</strong> {formData.address || 'Not provided'}</p>
                  <p><strong>City:</strong> {formData.city || 'Not provided'}</p>
                  <p><strong>Postal Code:</strong> {formData.postalCode || 'Not provided'}</p>
                  <p><strong>Country:</strong> {formData.country || 'Not provided'}</p>
                </div>
              </div>
              {isAuthenticated && formValidity.isValid && cart.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
                  {formData.country === 'United Kingdom' ? (
                    <Elements stripe={stripePromise}>
                      <StripeCheckoutForm
                        totalPrice={totalPrice}
                        cartItems={cart}
                        formData={formData}
                        onSuccess={handlePaymentSuccess}
                        onCancel={handleCancel}
                      />
                    </Elements>
                  ) : formData.country === 'Nigeria' ? (
                    <PaystackCheckout
                      email={formData.email}
                      amount={totalPrice * 100}
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
                    <p className="text-red-600 text-sm">Please select a valid country.</p>
                  )}
                </div>
              )}
              {!isAuthenticated && (
                <div className="mt-4 text-sm text-red-600">
                  Please{' '}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    log in
                  </Link>{' '}
                  to proceed with payment.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;