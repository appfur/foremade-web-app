import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaystackCheckout = ({
  email,
  amount,
  onSuccess,
  onClose,
  disabled,
  buttonText,
  className,
  iconClass,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const payNow = async () => {
    if (!window.PaystackPop) {
      toast.error('Paystack not loaded. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (!email || !amount) {
      toast.error('Please provide a valid email and amount.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const { data } = await axios.post(`${backendUrl}/initiate-paystack-payment`, {
        amount: amount / 100, // Convert back to NGN
        email,
        metadata: {
          userId: auth.currentUser?.uid || 'anonymous',
          orderId: `order-${Date.now()}`,
        },
      });

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email,
        amount: parseInt(amount, 10),
        currency: 'NGN',
        ref: data.reference,
        callback: (response) => {
          onSuccess(response);
          setLoading(false);
        },
        onClose: () => {
          onClose();
          setLoading(false);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error('Paystack payment error:', err);
      toast.error(
        err.response?.status === 404
          ? 'Payment service unavailable. Please check backend URL.'
          : 'Payment initiation failed. Try again.',
        { position: 'top-right', autoClose: 3000 }
      );
      setLoading(false);
    }
  };

  return (
    <button onClick={payNow} disabled={disabled || loading} className={className}>
      {iconClass && <i className={iconClass}></i>}
      {loading ? 'Processing...' : buttonText}
    </button>
  );
};

export default PaystackCheckout;