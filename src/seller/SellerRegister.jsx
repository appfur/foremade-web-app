import React, { useState } from 'react';

export default function SellerRegister() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      return 'Please Enter Your Email.';
    } else if (!emailRegex.test(value)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateEmail(email);
    setEmailError(error);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row gap-8">
        {/* Left Image Section */}
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src="https://via.placeholder.com/300x400?text=Seller+Registration+Image"
            alt="Seller Registration Illustration"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sellers Registration</h2>
          <p className="text-gray-600 mb-6">Create your own Store / Already have a Store? Login</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 transition-all duration-200 ${
                  email ? 'text-xs -translate-y-4' : ''
                }`}
              >
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                  emailError ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                } ${email ? 'pt-4' : ''}`}
              />
              {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <div className="mt-1 flex items-center border border-gray-300 rounded">
                  <span className="px-2 bg-gray-100 text-gray-700">🇳🇬 +234</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-800 transition duration-200"
            >
              Proceed To Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}