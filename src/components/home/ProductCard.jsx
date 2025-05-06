import { Link } from 'react-router-dom';
import Help from '../common/Help';
import AddToCartButton from '/src/components/cart/AddToCartButton';

const ProductCard = ({ product }) => {
  // Truncate product name if > 17 characters
  const truncateName = (name) => {
    if (name.length > 17) {
      return name.slice(0, 14) + '...';
    }
    return name;
  };

  return (
    <div className="relative">
      <Link to={`/product/${product.id}`} className="flex-col">
        <div className="rounded-lg max-md:p-4 p-5 grid justify-center">
          <div className="relative">
            <img
              src={product.image || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="h-40 w-[200px] border max-md:h-36 max-md:w-[160px] object-cover rounded-lg mb-2"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
            />
            <AddToCartButton
              productId={product.id}
              className="absolute top-2 right-2"
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">{truncateName(product.name)}</h3>
          <p className="text-gray-600">
            ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`bx bx-star text-black text-lg ${
                    i < Math.floor(product.rating) ? 'bx-star-filled' : ''
                  }`}
                ></i>
              ))}
            </div>
            <div className="ml-auto">
              <Help />
            </div>
          </div>
          <span className="inline-block mt-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            Brand Store
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;