import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg">
      <img
        src={product.image_url || 'https://via.placeholder.com/150'}
        alt={product.name}
        className="w-full h-48 object-cover mb-2"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">{formatPrice(product.price)}</p>
    </div>
  );
};

export default ProductCard; 