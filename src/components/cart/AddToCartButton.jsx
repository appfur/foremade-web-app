import { useState } from 'react';
import { auth } from '/src/firebase';
import { addToCart } from '/src/utils/cartUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddToCartButton = ({ productId }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!productId) {
      toast.error('Invalid product ID', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await addToCart(productId, 1, auth.currentUser?.uid);
      toast.success('Added to cart!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error(err.message || 'Failed to add to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`p-1 rounded-full transition-all duration-200 ${
          loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'text-2xl bg-gray-50 shadow-xl text-black text-center hover:bg-[#ec9d38]'
        }`}
        aria-label="Add to cart"
      >
        <i className={`bx bx-plus text-black ${loading ? 'opacity-50' : ''}`}></i>
      </button>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddToCartButton;