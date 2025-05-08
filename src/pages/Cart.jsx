import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '/src/firebase';
import { toast } from 'react-toastify';
import {
  getCart,
  updateCart,
  clearCart,
  checkout,
  mergeGuestCart,
} from '/src/utils/cartUtils';
import CartItem from '/src/components/cart/CartItem';
import CartSummary from '/src/components/cart/CartSummary';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      try {
        if (currentUser) {
          await mergeGuestCart(currentUser.uid);
          const items = await getCart(currentUser.uid);
          setCartItems(items);
          if (items.length === 0) {
            setError('Your cart is empty.');
          }
        } else {
          const items = await getCart();
          setCartItems(items);
          if (items.length === 0) {
            setError('Your cart is empty.');
          }
        }
      } catch (err) {
        console.error('Error loading cart:', err);
        setError('Failed to load cart. Please try again.');
        setCartItems([]);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    });

    const handleCartUpdate = async () => {
      try {
        const items = await getCart(user?.uid);
        setCartItems(items);
        if (items.length === 0) {
          setError('Your cart is empty.');
        } else {
          setError(null);
        }
      } catch (err) {
        console.error('Error updating cart:', err);
        setError('Failed to update cart.');
        toast.error('Failed to update cart');
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user, navigate]);

  const updateCartQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const item = cartItems.find((i) => i.productId === productId);
      if (item && item.product && newQuantity > item.product.stock) {
        toast.error(`Cannot add more than ${item.product.stock} units of ${item.product.name}`);
        return;
      }
      const updatedItems = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      await updateCart(updatedItems, user?.uid);
      setCartItems(updatedItems);
      toast.success('Quantity updated');
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const updatedItems = cartItems.filter((item) => item.productId !== productId);
      await updateCart(updatedItems, user?.uid);
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
      await clearCart(user?.uid);
      setCartItems([]);
      setError('Your cart is empty.');
      toast.success('Cart cleared successfully');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to checkout');
      navigate('/login');
      return;
    }
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
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  if (loading) return <div className="p-4 text-gray-600 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Your Cart
      </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          {error && cartItems.length === 0 ? (
            <div className="">
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                to="/products"
                className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  updateCartQuantity={updateCartQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>
          )}
        </div>
        <div className="lg:w-1/3">
          <CartSummary
            totalPrice={totalPrice}
            handleCheckout={handleCheckout}
            cartItems={cartItems}
            clearCart={handleClearCart}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;