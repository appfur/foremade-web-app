import { useState } from 'react';
import { auth } from '/src/firebase';
import { addToCart } from '/src/utils/cartUtils';
import { toast } from 'react-toastify';

const AddToCartButton = ({ productId }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(productId, 1, auth.currentUser?.uid);
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`p-1 rounded-full transition ${
        loading ? 'bg-gray-300 cursor-not-allowed' : 'text-2xl bg-gray-50 shadow-xl text-black text-center hover:bg-[#ec9d38]'
      }`}
      aria-label="Add to cart"
    >
      <i className={`bx bx-plus text-black ${loading ? 'opacity-50' : ''}`}></i>
    </button>
  );
};

export default AddToCartButton;