import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '/src/firebase';
import { toast } from 'react-toastify';
import {
  getCart,
  updateCart,
  clearCart,
  checkout,
} from '/src/utils/cartUtils';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const items = await getCart(currentUser.uid);
          if (items.length === 0) {
            setError('Your cart is empty.');
          }
          setCartItems(items);
        } catch (err) {
          console.error('Error loading cart:', err);
          setError('Failed to load cart. Please try again.');
          setCartItems([]);
        }
      } else {
        setError('Please log in to view your cart.');
        navigate('/login');
      }
      setLoading(false);
    });

    const handleCartUpdate = async () => {
      if (user) {
        try {
          const items = await getCart(user.uid);
          if (items.length === 0) {
            setError('Your cart is empty.');
          } else {
            setError(null);
          }
          setCartItems(items);
        } catch (err) {
          console.error('Error updating cart:', err);
          setError('Failed to update cart.');
        }
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user, navigate]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const updatedItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      await updateCart(user.uid, updatedItems);
      setCartItems(updatedItems);
      toast.success('Quantity updated');
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const updatedItems = cartItems.filter((item) => item.productId !== productId);
      await updateCart(user.uid, updatedItems);
      setCartItems(updatedItems);
      toast.success('Item removed from cart');
      if (updatedItems.length === 0) {
        setError('Your cart is empty.');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(user.uid);
      setCartItems([]);
      setError('Your cart is empty.');
      toast.success('Cart cleared successfully');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout(user.uid);
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      console.error('Error during checkout:', err);
      toast.error(err.message || 'Checkout failed');
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) return <div className="p-4 text-gray-600 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="bg-blue-50 p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Cart</h1>
        {error ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition text-sm"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 p-4 bg-white rounded-md shadow-sm"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">₦{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300 text-sm"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-gray-800 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="bx bx-trash text-xl"></i>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-lg font-medium text-gray-800">
                Total: ₦{totalPrice.toFixed(2)}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleClearCart}
                  className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition text-sm"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition text-sm"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;