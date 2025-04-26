import React from 'react';

const CartSummary = ({ totalPrice, handleCheckout }) => {
  return (
    <div className="mt-6 flex justify-between items-center">
      <p className="text-lg font-bold text-gray-800">
        Total: ₦{totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <button
        onClick={handleCheckout}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Checkout
      </button>
    </div>
  );
};

export default CartSummary;