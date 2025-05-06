import { useState } from 'react';
import { getCart, updateCart } from '/src/utils/cartUtils';

const AddToCartButton = ({ productId, className = '' }) => {
  const [cartMessage, setCartMessage] = useState('');

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent parent click events
    try {
      const cart = getCart();
      const existingItem = cart.find((item) => item.productId === productId);
      let updatedCart;

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...cart, { productId, quantity: 1 }];
      }

      updateCart(updatedCart);
      setCartMessage('Added to cart!');
      setTimeout(() => setCartMessage(''), 2000); // Clear after 2s
    } catch (err) {
      console.error('Error adding to cart:', err);
      setCartMessage('Failed to add to cart.');
      setTimeout(() => setCartMessage(''), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleAddToCart}
        className={`text-xl text-gray-600 hover:text-blue-600 transition duration-200 ${className}`}
        aria-label="Add to cart"
      >
        <i className="bx bxs-cart-add"></i>
      </button>
      {cartMessage && (
        <span className="absolute top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] px-2 py-1 rounded">
          {cartMessage}
        </span>
      )}
    </div>
  );
};

export default AddToCartButton;