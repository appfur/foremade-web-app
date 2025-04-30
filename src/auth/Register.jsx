import React, { useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled. Please try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email. Please sign in using your previous method.';
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

  // Handle email/password registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        name: name,
        address: '',
        createdAt: new Date().toISOString(),
        uid: user.uid
      });

      console.log("User registered successfully");
      navigate('/login');
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setError('');

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        // New user, save their data to Firestore
        await setDoc(userDoc, {
          email: user.email,
          name: user.displayName || 'Google User',
          address: '',
          createdAt: new Date().toISOString(),
          uid: user.uid
        });
        console.log("User registered with Google successfully");
      } else {
        console.log("User already exists, redirecting to login");
      }

      navigate('/login');
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
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

          <div className="grid md:grid-cols-2 gap-6">
            <form onSubmit={handleRegister}>
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
                  autoComplete="off"
                  required
                />
              </div>
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
                  autoComplete="off"
                  required
                />
              </div>
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
                  autoComplete="new-password"
                  required
                />
                <span className="absolute right-3 top-12 text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition duration-200"
              >
                Sign Up
              </button>
            </form>
            <div className="flex flex-col justify-center items-center md:border-l md:pl-6">
              <p className="text-gray-600 mb-4">Or continue with</p>
              <button
                onClick={handleGoogleSignIn}
                className="w-full max-w-xs bg-white border border-gray-300 p-3 rounded-lg flex items-center justify-center mb-4 hover:bg-gray-100 transition duration-200"
              >
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