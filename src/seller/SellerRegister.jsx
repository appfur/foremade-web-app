import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import countryCodes from '../components/common/countryCodes';
import countries from '../components/common/countries';
import sellIllustration from '/src/assets/icons/sell-registration.svg';

export default function SellerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [user, setUser] = useState(null);
  const [isPhoneCodeManual, setIsPhoneCodeManual] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load userData from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setFormData((prev) => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || '',
      }));
    }

    // Monitor auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFormData((prev) => ({
          ...prev,
          email: currentUser.email || prev.email,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const getCountryCode = (countryName) => {
    const country = countryCodes.find((c) => c.country === countryName);
    return country ? country.code : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      if (name === 'country') {
        setIsPhoneCodeManual(false);
        const newCode = getCountryCode(value);
        const currentNumber = prev.phone.includes('-') ? prev.phone.split('-')[1] || '' : '';
        newFormData.phone = newCode ? `${newCode}-${currentNumber}` : currentNumber;
      }
      return newFormData;
    });
    setErrors((prev) => ({ ...prev, [name]: '', phone: '' }));
  };

  const handlePhoneCodeChange = (e) => {
    const selectedCode = e.target.value;
    setIsPhoneCodeManual(true);
    setFormData((prev) => {
      const number = prev.phone.includes('-') ? prev.phone.split('-')[1] || '' : '';
      return { ...prev, phone: `${selectedCode}-${number}` };
    });
    setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const handlePhoneNumberChange = (e) => {
    const number = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev) => {
      const code = isPhoneCodeManual
        ? prev.phone.includes('-')
          ? prev.phone.split('-')[0]
          : getCountryCode(prev.country)
        : getCountryCode(prev.country);
      return { ...prev, phone: code ? `${code}-${number}` : number };
    });
    setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }
    if (!formData.country) {
      newErrors.country = 'Please select a country.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.includes('-') || !formData.phone.split('-')[1]) {
      newErrors.phone = 'Please enter a valid phone number.';
    } else if (formData.phone.split('-')[1].length < 7) {
      newErrors.phone = 'Phone number must be at least 7 digits.';
    }
    if (!user) {
      if (!formData.password) {
        newErrors.password = 'Please enter a password.';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password.';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }
    return newErrors;
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.country &&
      formData.email.trim() &&
      formData.phone.includes('-') &&
      formData.phone.split('-')[1] &&
      (user || (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      let currentUser;
      if (user) {
        currentUser = user;
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        currentUser = userCredential.user;
      }

      const sellerData = {
        name: formData.name,
        country: formData.country,
        phone: formData.phone,
        createdAt: new Date().toISOString(),
      };

      await updateProfile(currentUser, {
        displayName: JSON.stringify(sellerData),
      });

      console.log('Seller data saved to Authentication user document:', currentUser.uid);
      navigate('/seller-product-details');
    } catch (error) {
      console.error('Error registering seller:', error);
      setSubmitError(
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered.'
          : 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-blue-50 p-4 sm:p-6 rounded-lg flex flex-col gap-6">
        <div className="w-full flex items-center justify-center">
          <img
            src={sellIllustration}
            alt="Seller Registration Illustration"
            className="w-full max-w-xs sm:max-w-sm h-auto object-contain rounded-lg"
          />
        </div>
        <div className="w-full">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Create an account</h2>
          <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
            Create your own Store / Already have a Store? <Link to="/seller/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
          {submitError && <p className="text-red-600 text-xs sm:text-sm mb-3 sm:mb-4">{submitError}</p>}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                className={`block text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 ${
                  formData.name ? 'text-xs -translate-y-4' : ''
                }`}
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                  errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                } ${formData.name ? 'pt-4' : ''}`}
              />
              {errors.name && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Country or region <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md py-3 px-2 text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                  errors.country ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select a country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.country}</p>}
            </div>
            <div>
              <label
                className={`block text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 ${
                  formData.email ? 'text-xs -translate-y-4' : ''
                }`}
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                  errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                } ${formData.email ? 'pt-4' : ''}`}
              />
              {errors.email && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex items-center border border-gray-300 rounded">
                  <select
                    value={
                      isPhoneCodeManual
                        ? formData.phone.split('-')[0] || ''
                        : getCountryCode(formData.country)
                    }
                    onChange={handlePhoneCodeChange}
                    className="px-2 py-3 text-xs sm:text-sm bg-gray-100 text-gray-700 border-r border-gray-300 focus:outline-none"
                  >
                    {countryCodes.map((country) => (
                      <option key={`${country.code}-${country.country}`} value={country.code}>
                        {country.code} ({country.country})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={formData.phone.includes('-') ? formData.phone.split('-')[1] || '' : formData.phone}
                    onChange={handlePhoneNumberChange}
                    placeholder="Enter phone number"
                    className={`w-full py-3 px-2 text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                      errors.phone ? 'border-red-500' : 'focus:ring-blue-500'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.phone}</p>}
              </div>
              <div className="w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`mt-1 w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={user}
                />
                {errors.password && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.password}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`mt-1 w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  disabled={user}
                />
                {errors.confirmPassword && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-3 px-4 rounded text-white text-sm sm:text-base transition duration-200 ${
                isFormValid()
                  ? 'bg-blue-900 hover:bg-blue-800'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Proceed To Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}