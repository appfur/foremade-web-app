import React, { useState } from 'react';

const PaystackCheckout = ({ email, amount, totalPrice, onSuccess, onClose, disabled, buttonText }) => {
  const [inputAmount, setInputAmount] = useState('');
  const [error, setError] = useState(null);

  const payNow = () => {
    // Validate user-input amount against totalPrice
    const inputAmountInNaira = parseFloat(inputAmount);
    if (isNaN(inputAmountInNaira) || inputAmountInNaira !== totalPrice) {
      setError(`Amount must be exactly ₦${totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`);
      return;
    }

    if (!email || !amount) {
      setError('Please provide a valid email and amount.');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: 'pk_live_80ce5e6562afd9418a07b2fd2f1a261dbb62a9bd', // Your actual public key
      email,
      amount: parseInt(amount, 10), // Amount in Kobo
      currency: 'NGN',
      ref: `ref-${Date.now()}`,
      callback: (response) => {
        onSuccess(response);
      },
      onClose: () => {
        onClose();
      },
    });

    handler.openIframe();
  };

  return (
    <div className="p-4">
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        disabled
        className="border p-2 mb-2 w-full bg-gray-100"
      />
      <input
        type="number"
        placeholder="Enter amount (₦)"
        value={inputAmount}
        onChange={(e) => {
          setInputAmount(e.target.value);
          setError(null);
        }}
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={payNow}
        disabled={disabled}
        className={`w-full p-2 text-white rounded ${
          disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PaystackCheckout;