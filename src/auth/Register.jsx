import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Adjust path if needed (e.g., '../firebase')
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

// Helper function to map Firebase errors to user-friendly messages
const getFriendlyErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/network-request-failed':
      return 'Check your network connection and try again.';
    case 'auth/email-already-in-use':
      return 'This email is already in use. Please use a different email or sign in.';
    case 'auth/weak-password':
      return 'Password is too weak. It should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
};

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        name: name,
        role: 'buyer',
        address: '',
        createdAt: new Date().toISOString(),
        uid: user.uid
      });

      console.log("User registered successfully");
      navigate('/login');
    } catch (err) {
      setError(getFriendlyErrorMessage(err)); // Use friendly error message
    }
  };

  return (
    <div className="bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          {/* <h1 className="text-3xl font-bold text-blue-600">Foremade</h1> */}
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign Up</h2>
          <p className="text-gray-600 mb-6">
            Create a new account. Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Form and Social Login Container */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form */}
            <form onSubmit={handleRegister}>
              {/* Full Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email/Phone Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email / Phone
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email or phone number"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 6+ Character"
                  required
                />
                <span className="absolute right-3 top-12 text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition duration-200"
              >
                Sign Up
              </button>
            </form>

            {/* Social Login */}
            <div className="flex flex-col justify-center items-center md:border-l md:pl-6">
              <p className="text-gray-600 mb-4">Or continue with</p>
              <button className="w-full max-w-xs bg-white border border-gray-300 p-3 rounded-lg flex items-center justify-center mb-4 hover:bg-gray-100 transition duration-200">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Google
              </button>
              <button className="w-full max-w-xs bg-white border border-gray-300 p-3 rounded-lg flex items-center justify-center hover:bg-gray-100 transition duration-200">
                <img
                  src="https://www.facebook.com/favicon.ico"
                  alt="Facebook"
                  className="w-5 h-5 mr-2"
                />
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}