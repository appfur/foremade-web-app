import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="border rounded-lg max-md:p-4 p-8">
        <img
          src={product.image || 'https://via.placeholder.com/150'}
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-2"
          onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
        />
        <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600">
          ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`bx bx-star text-yellow-400 text-sm ${
                i < Math.floor(product.rating) ? 'bx-star-filled' : ''
              }`}
            ></i>
          ))}
          <span className="text-xs text-gray-600 ml-1">({product.reviews?.length || 0})</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Stock: {product.stock} units</p>
      </div>
    </Link>
  );
};

export default ProductCard;