import { useNavigate } from 'react-router-dom';
import { auth } from '/src/firebase';
import { addToCart } from '/src/utils/cartUtils';
import { toast } from 'react-toastify';

const AddToCartButton = ({ productId, className = '' }) => {
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent parent click events
    if (!auth.currentUser) {
      toast.error('Please log in to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(auth.currentUser.uid, productId, 1);
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart.');
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`text-2xl text-gray-600 hover:text-green-500 transition duration-200 ${className}`}
      aria-label="Add to cart"
    >
      <i className="bx bx-cart-add p-[3px] border rounded-full"></i>
    </button>
  );
};

export default AddToCartButton;