import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import countryCodes from '../components/common/countryCodes';

export default function SellerRegister() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      return 'Please Enter Your Email.';
    } else if (!emailRegex.test(value)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const validatePhone = (value) => {
    if (!value.includes('-') || !value.split('-')[1]) {
      return 'Please enter a valid phone number.';
    }
    const number = value.split('-')[1];
    if (number.length < 7) {
      return 'Phone number must be at least 7 digits.';
    }
    return '';
  };

  const validatePassword = (pass, confirmPass) => {
    if (!pass) {
      return 'Please enter a password.';
    } else if (pass.length < 6) {
      return 'Password must be at least 6 characters.';
    } else if (pass !== confirmPass) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validate form inputs
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passwordErr = validatePassword(password, confirmPassword);

    setEmailError(emailErr);
    setPhoneError(phoneErr);
    setPasswordError(passwordErr);

    if (emailErr || phoneErr || passwordErr) {
      return;
    }

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save seller details to Firestore
      await setDoc(doc(db, 'sellers', user.uid), {
        email: email,
        phone: phone,
        createdAt: serverTimestamp(),
        uid: user.uid,
      });

      console.log('Seller registered and saved to Firestore:', user.uid);
      // Optionally, redirect to a success page or next step
      // e.g., navigate('/seller-dashboard');
    } catch (error) {
      console.error('Error registering seller:', error);
      setSubmitError(
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered.'
          : 'An error occurred. Please try again.'
      );
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-5xl bg-blue-50 p-8 rounded-lg flex flex-col md:flex-row gap-8">
        {/* Left Image Section */}
        <div className="md:w-1/2 flex items-center justify-center">
          <img
            src="src/assets/icons/sell-registration.svg"
            alt="Seller Registration Illustration"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create an account</h2>
          <p className="text-gray-600 text-sm mb-6">Create your own Store / Already have a Store? Login</p>
          {submitError && <p className="text-red-600 text-sm mb-4">{submitError}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
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
                <label className="block text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded">
                  <select
                    className="px-2 py-2 text-sm bg-gray-100 text-gray-700 border-r border-gray-300 focus:outline-none"
                    value={phone.startsWith('+') ? phone.split('-')[0] : '+1'}
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      setPhone((prev) => {
                        const number = prev.includes('-') ? prev.split('-')[1] : prev;
                        return `${selectedCode}-${number || ''}`;
                      });
                    }}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} ({country.name})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone.includes('-') ? phone.split('-')[1] || '' : phone}
                    onChange={(e) => {
                      const number = e.target.value.replace(/[^0-9]/g, '');
                      const code = phone.includes('-') ? phone.split('-')[0] : '+1';
                      setPhone(`${code}-${number}`);
                    }}
                    placeholder="Enter phone number"
                    className={`w-full p-2 focus:outline-none focus:ring-2 ${
                      phoneError ? 'border-red-500' : 'focus:ring-blue-500'
                    }`}
                  />
                </div>
                {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={`mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                    passwordError ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
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
                  className={`mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 ${
                    passwordError ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
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