import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddPhone() {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Validate phone number format (basic regex for international numbers)
  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Accepts formats like +1234567890 or 1234567890
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPhoneError('');
    setSuccessMessage('');

    if (!phone.trim()) {
      setPhoneError('Phone number is required.');
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid phone number (e.g., +1234567890).');
      return;
    }

    // Simulate saving the phone number (e.g., to local storage for now)
    localStorage.setItem('userPhone', phone);
    setSuccessMessage('Phone number added successfully! Proceeding to login...');

    // Redirect to login after a short delay
    setTimeout(() => {
      navigate('/login');
    }, 2000);
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
          <div className="mb-4 relative">
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full p-3 border rounded-lg transition-all duration-300 peer ${
                phoneError ? 'border-red-500' : successMessage ? 'border-green-500' : 'border-gray-300'
              }`}
              placeholder="e.g., +1234567890"
              autoComplete="tel"
            />
            <label
              htmlFor="phone"
              className={`absolute left-3 top-3 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 ${
                phone ? '-translate-y-6 scale-75 text-blue-500 bg-white px-1' : ''
              }`}
            >
              Phone Number
            </label>
            {phoneError && (
              <p className="text-red-600 text-[10px] mt-1">{phoneError}</p>
            )}
          </div>

          {successMessage && (
            <p className="text-green-600 text-[10px] mb-4">{successMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}