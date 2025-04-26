import React from 'react';

const CartItem = ({ item, updateCartQuantity, removeFromCart }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
      <img
        src={item.product?.image}
        alt={item.product?.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-800">{item.product?.name}</h3>
        <p className="text-xs text-gray-600">
          ₦{(item.product?.price * item.quantity).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => updateCartQuantity(item.productId, parseInt(e.target.value))}
          className="w-16 p-1 border border-gray-300 rounded"
        />
        <button
          onClick={() => removeFromCart(item.productId)}
          className="text-red-500 hover:text-red-700"
        >
          <i className="bx bx-trash text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default CartItem;