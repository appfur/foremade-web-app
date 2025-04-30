import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

// Helper function to map Firebase errors to user-friendly messages
const getFriendlyErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/network-request-failed':
      return 'Check your network connection and try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');

    // Client-side validation
    let hasError = false;
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    }

    if (hasError) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully:", userCredential.user);
      setSuccessMessage('Login successful! Redirecting to profile...');
      setTimeout(() => {
        navigate('/profile');
      }, 2000); // Redirect after 2 seconds to show the success message
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = getFriendlyErrorMessage(err);
      if (errorMessage.includes('email') || errorMessage.includes('account')) {
        setEmailError(errorMessage);
      } else if (errorMessage.includes('password')) {
        setPasswordError(errorMessage);
      } else {
        setEmailError(errorMessage); // Fallback to email field for general errors
      }
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');

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
      }

      console.log("User signed in with Google successfully");
      setSuccessMessage('Google Sign-In successful! Redirecting to profile...');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setEmailError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8"></div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign In</h2>
          <p className="text-gray-600 mb-6">
            Don't not have account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="mb-4 relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 border rounded-lg transition-all duration-300 peer ${
                    emailError ? 'border-red-500 shadow-[0_0_5px_rgba(255,0,0,0.5)]' : successMessage ? 'border-green-500 shadow-[0_0_5px_rgba(0,255,0,0.5)]' : 'border-gray-300'
                  }`}
                  autoComplete="off"
                  required
                />
                <label
                  htmlFor="email"
                  className={`absolute left-3 top-3 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 ${
                    email ? '-translate-y-6 scale-75 text-blue-500 bg-white px-1' : ''
                  }`}
                >
                  Email
                </label>
                {emailError && (
                  <p className="text-red-600 text-sm mt-1">{emailError}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4 relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-3 border rounded-lg transition-all duration-300 peer ${
                    passwordError ? 'border-red-500 shadow-[0_0_5px_rgba(255,0,0,0.5)]' : successMessage ? 'border-green-500 shadow-[0_0_5px_rgba(0,255,0,0.5)]' : 'border-gray-300'
                  }`}
                  autoComplete="current-password"
                  required
                />
                <label
                  htmlFor="password"
                  className={`absolute left-3 top-3 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 ${
                    password ? '-translate-y-6 scale-75 text-blue-500 bg-white px-1' : ''
                  }`}
                >
                  Password
                </label>
                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                  👁️
                </span>
                {passwordError && (
                  <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex justify-between items-center mb-6">
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  Remember Me
                </label>
                <Link to="/forgot-password" className="text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Success Message */}
              {successMessage && (
                <p className="text-green-600 text-sm mb-4">{successMessage}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition duration-200"
              >
                Login
              </button>
            </form>

            {/* Google/Facebook Sign-In Section */}
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