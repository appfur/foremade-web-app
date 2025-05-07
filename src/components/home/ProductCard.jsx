import { Link } from 'react-router-dom';
import Help from '../common/Help';
import AddToCartButton from '/src/components/cart/AddToCartButton';

const ProductCard = ({ product }) => {
  // Log invalid product
  if (!product || typeof product !== 'object') {
    console.error('Invalid product prop:', product);
    return null;
  }

  // Truncate product name if > 17 characters
  const truncateName = (name) => {
    if (!name) return '';
    if (name.length > 17) {
      return name.slice(0, 14) + '...';
    }
    return name;
  };

  // Validate imageUrl
  const imageSrc = product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.startsWith('https://')
    ? product.imageUrl
    : '/images/placeholder.jpg';

  return (
    <div className="relative">
      <Link to={`/product/${product.id}`} className="flex-col">
        <div className="rounded-lg max-md:p-4 p-5 grid justify-center">
          <div className="relative">
            <img
              src={imageSrc}
              alt={product.name || 'Product'}
              className="h-40 w-[200px] border max-md:h-36 max-md:w-[160px] object-cover rounded-lg mb-2"
              onError={(e) => {
                console.error('Image load error:', {
                  productId: product.id,
                  imageUrl: product.imageUrl,
                  name: product.name,
                });
                e.target.src = '/images/placeholder.jpg';
              }}
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">{truncateName(product.name)}</h3>
          <p className="text-gray-600">
            ₦{(product.price || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`bx bx-star text-black text-lg ${
                    i < Math.floor(product.rating || 0) ? 'bx-star-filled' : ''
                  }`}
                ></i>
              ))}
            </div>
          </div>
          <span className="inline-block mt-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
            Brand Store
          </span>
        </div>
      </Link>
      <div className="absolute top-6 right-7 max-md:top-5 max-md:right-6">
        <AddToCartButton productId={product.id} />
      </div>
      <div className="absolute bottom-10 right-7 max-md:bottom-9 max-md:right-6">
        <Help />
      </div>
    </div>
  );
};

export default ProductCard;