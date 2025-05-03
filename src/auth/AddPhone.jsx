import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function AddPhone() {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  useEffect(() => {
    const auth = getAuth();
    if (!window.recaptchaVerifier && recaptchaRef.current) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(recaptchaRef.current, {
          size: 'normal', // Use 'normal' for debugging, switch to 'invisible' later
          callback: (response) => {
            console.log('reCAPTCHA solved:', response);
          },
          'expired-callback': () => {
            setPhoneError('reCAPTCHA expired. Please try again.');
            if (window.recaptchaVerifier) window.recaptchaVerifier.reset();
          },
        }, auth);
        window.recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
        });
      } catch (err) {
        console.error('reCAPTCHA initialization error:', err);
        setPhoneError('Failed to initialize reCAPTCHA. Check your Firebase configuration or SDK version.');
      }
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
        if (window.recaptchaWidgetId) {
          window.grecaptcha.reset(window.recaptchaWidgetId);
          delete window.recaptchaWidgetId;
        }
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setSuccessMessage('');
    setOtpError('');

    if (!phone.trim()) {
      setPhoneError('Phone number is required.');
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid phone number (e.g., +1234567890).');
      return;
    }

    const auth = getAuth();
    if (!window.recaptchaVerifier) {
      setPhoneError('reCAPTCHA not initialized. Please refresh the page or check Firebase setup.');
      return;
    }

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setShowOtp(true);
      setSuccessMessage('OTP sent to your phone number.');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setPhoneError(getFriendlyErrorMessage(err));
      if (window.recaptchaVerifier) window.recaptchaVerifier.reset();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (!otp) {
      setOtpError('Please enter the OTP.');
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      console.log('Phone number verified for user:', user.uid);
      localStorage.setItem('userPhone', phone);
      setSuccessMessage('Phone number verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setOtpError(getFriendlyErrorMessage(err));
    }
  };

  const getFriendlyErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-verification-code':
        return 'Invalid OTP. Please try again.';
      case 'auth/code-expired':
        return 'OTP has expired. Please request a new one.';
      case 'auth/invalid-phone-number':
        return 'Invalid phone number format.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 text-gray-800">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Your Phone Number</h2>
        <p className="text-gray-600 mb-6">
          Please provide your phone number to proceed. Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Skip to Login
          </Link>
        </p>

        <form onSubmit={handleSubmit}>
          <div id="recaptcha-container" ref={recaptchaRef}></div>
          <div className="mb-4 relative">
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full p-3 border rounded-lg transition-all duration-300 peer ${
                phoneError ? 'border-red-500' : successMessage ? 'border-green-500' : 'border-gray-300'
              }`}
              autoComplete="tel"
            />
            <label
              htmlFor="phone"
              className="absolute left-3 -top-2 text-gray-500 text-xs bg-white px-1 transition-all duration-300 transform origin-left"
            >
              Phone Number
            </label>
            {phoneError && <p className="text-red-600 text-[10px] mt-1">{phoneError}</p>}
          </div>

          {showOtp && (
            <div className="mb-4 relative">
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full p-3 border rounded-lg transition-all duration-300 peer ${
                  otpError ? 'border-red-500' : 'border-gray-300'
                }`}
                autoComplete="one-time-code"
              />
              <label
                htmlFor="otp"
                className="absolute left-3 -top-2 text-gray-500 text-xs bg-white px-1 transition-all duration-300 transform origin-left"
              >
                OTP
              </label>
              {otpError && <p className="text-red-600 text-[10px] mt-1">{otpError}</p>}
              <button
                type="button"
                onClick={handleOtpSubmit}
                className="mt-2 bg-blue-900 text-white p-2 rounded-lg hover:bg-blue-800 transition duration-200"
              >
                Verify OTP
              </button>
            </div>
          )}

          {!showOtp && (
            <button
              type="submit"
              className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition duration-200"
            >
              Submit
            </button>
          )}
          {successMessage && <p className="text-green-600 text-[10px] mb-4">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
}