import { useEffect } from 'react';

const PaystackCheckout = ({
  email,
  amount,
  totalPrice,
  onSuccess,
  onClose,
  disabled,
  buttonText,
  className,
  iconClass,
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const payNow = () => {
    if (!window.PaystackPop) {
      alert('Paystack not loaded. Please try again.');
      return;
    }

    if (!email || !amount) {
      alert('Please provide a valid email and amount.');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: 'pk_test_80ce5e6562afd9418a07b2fd2f1a261dbb62a9bd', // Test key (replace with your test key)
      email,
      amount: parseInt(amount, 10), // Amount in Kobo
      currency: 'NGN',
      ref: `ref-${Date.now()}`,
      callback: (response) => {
        onSuccess(response);
      },
      onClose,
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={payNow}
      disabled={disabled}
      className={className}
    >
      {iconClass && <i className={iconClass}></i>}
      {buttonText}
    </button>
  );
};

export default PaystackCheckout;