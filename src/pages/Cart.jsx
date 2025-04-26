import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../db.json';
import CartItem from '/src/components/cart/CartItem';
import CartSummary from '/src/components/cart/CartSummary';

const Cart = () => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Map cart items to include product details from db.json
  const cartItems = cart.map((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const order = {
      id: Date.now(),
      items: cart,
      total: totalPrice,
      date: new Date().toISOString(),
    };

    // Load existing orders from localStorage
    const storedOrders = localStorage.getItem('orders');
    const orders = storedOrders ? JSON.parse(storedOrders) : [];

    // Add new order
    localStorage.setItem('orders', JSON.stringify([...orders, order]));

    // Clear cart
    setCart([]);
    alert('Order placed successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">
          Your cart is empty.{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div>
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
          <CartSummary totalPrice={totalPrice} handleCheckout={handleCheckout} />
        </div>
      )}
    </div>
  );
};

export default Cart;