import React, { useState } from 'react';

const PayWithPaystack = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const payNow = () => {
    if (!email || !amount) return alert('Fill in all fields');

    const handler = window.PaystackPop.setup({
      key: 'pk_live_80ce5e6562afd9418a07b2fd2f1a261dbb62a9bd', // ✅ your actual public key
      email,                                // ✅ Valid user email
      amount: parseInt(amount, 10) * 100,   // ✅ Convert ₦ to Kobo
      currency: 'NGN',
      ref: `ref-${Date.now()}`,             // ✅ Unique reference
      callback: (response) => {
        alert(`Payment complete! Reference: ${response.reference}`);
      },
      onClose: () => alert('Transaction was closed'),
    });

    handler.openIframe();
  };

  return (
    <div className="p-4">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="number"
        placeholder="Enter amount (₦)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button onClick={payNow} className="bg-green-600 text-white p-2 w-full">
        Pay Now
      </button>
    </div>
  );
};

export default PayWithPaystack;
