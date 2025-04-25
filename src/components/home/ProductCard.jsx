import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`}>
      <img
        src={product.image || 'https://via.placeholder.com/150'}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-2"
      />
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`bx bx-star text-yellow-400 text-sm ${
              i < Math.floor(product.rating) ? 'bx-star-filled' : ''
            }`}
          ></i>
        ))}
        <span className="text-xs text-gray-600 ml-1">({product.reviewCount || 0})</span>
      </div>
      <h3 className="text-sm font-bold text-gray-800 mb-1 uppercase truncate">
        {product.name}
      </h3>
      <p className="text-sm font-bold text-gray-800">{formatPrice(product.price)}</p>
    </Link>
  );
};

export default ProductCard;