import React from 'react';

const CartItem = ({ item, updateCartQuantity, removeFromCart }) => {
  const stock = item.product?.stock || 0;
  const isOutOfStock = stock === 0;

  if (!item.product) {
    return (
      <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500 text-xs">Image N/A</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-800">Product Not Found</h3>
          <p className="text-xs text-gray-600">Item ID: {item.productId}</p>
          <p className="text-xs text-red-600">This product is no longer available.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => removeFromCart(item.productId)}
            className="text-red-500 hover:text-red-700"
            aria-label="Remove unavailable product from cart"
          >
            <i className="bx bx-trash text-xl"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
      <img
        src={item.product.image || 'https://via.placeholder.com/64'}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded"
        onError={(e) => (e.target.src = 'https://via.placeholder.com/64')}
      />
      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-800">{item.product.name}</h3>
        <p className="text-xs text-gray-600">
          ₦{(item.product.price * item.quantity).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="text-xs text-gray-600">
          Stock: <span className={isOutOfStock ? 'text-red-600' : 'text-green-600'}>
            {isOutOfStock ? 'Out of stock' : `${stock} units available`}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max={stock}
          value={item.quantity}
          onChange={(e) => updateCartQuantity(item.productId, parseInt(e.target.value) || 1)}
          className="w-16 p-1 border border-gray-300 rounded"
          disabled={isOutOfStock}
          aria-label={`Quantity of ${item.product.name}`}
        />
        <button
          onClick={() => removeFromCart(item.productId)}
          className="text-red-500 hover:text-red-700"
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <i className="bx bx-trash text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default CartItem;