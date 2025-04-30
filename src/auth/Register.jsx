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
      return 'This email is already in use. Please log in instead.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled. Please try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
};

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to handle navigation after signup
  const handleNavigation = () => {
    console.log('Attempting to navigate to /login');
    navigate('/login', { replace: true });
    console.log('Navigation should have completed');
  };

  // Handle email/password registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');

    // Client-side validation
    let hasError = false;
    if (!name.trim()) {
      setNameError('Full name is required.');
      hasError = true;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      hasError = true;
    }

    if (hasError) return;

    try {
      console.log('Starting email/password registration...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created successfully:', user.uid);

      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        name: name,
        address: '',
        createdAt: new Date().toISOString(),
        uid: user.uid
      });
      console.log('User document created in Firestore');

      const firstName = name.split(' ')[0];
      setSuccessMessage(`Welcome, ${firstName}! Registration successful!`);
      console.log('Showing success alert...');
      window.alert(`Welcome, ${firstName}! Your registration was successful! You will now be redirected to the login page.`);
      console.log('Alert should have been shown, navigating to login...');
      handleNavigation();
    } catch (err) {
      console.error('Registration error:', err);
      console.log('Error code:', err.code);
      console.log('Error message:', err.message);
      const errorMessage = getFriendlyErrorMessage(err);
      if (errorMessage.includes('email')) {
        setEmailError(errorMessage);
      } else if (errorMessage.includes('password')) {
        setPasswordError(errorMessage);
      } else {
        setNameError(errorMessage); // Fallback to name field for general errors
      }
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');

    const provider = new GoogleAuthProvider();
    try {
      console.log('Starting Google Sign-In...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google Sign-In successful:', user.uid);

      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
          email: user.email,
          name: user.displayName || 'Google User',
          address: '',
          createdAt: new Date().toISOString(),
          uid: user.uid
        });
        console.log('User document created in Firestore for Google user');
      } else {
        console.log('User document already exists in Firestore');
      }

      const displayName = user.displayName || 'Google User';
      setSuccessMessage(`Welcome, ${displayName}! Google Sign-In successful!`);
      console.log('Showing success alert...');
      window.alert(`Welcome, ${displayName}! Google Sign-In successful! You will now be redirected to the login page.`);
      console.log('Alert should have been shown, navigating to login...');
      handleNavigation();
    } catch (err) {
      console.error('Google Sign-In error:', err);
      console.log('Error code:', err.code);
      console.log('Error message:', err.message);
      setEmailError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8"></div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign Up</h2>
          <p className="text-gray-600 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <form onSubmit={handleRegister}>
              {/* Full Name Field */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-3 border rounded-lg transition-all duration-300 peer ${
                    nameError ? 'border-red-500' : successMessage ? 'border-green-500' : 'border-gray-300'
                  }`}
                  autoComplete="off"
                  required
                />
                <label
                  htmlFor="name"
                  className={`absolute left-3 top-3 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 ${
                    name ? '-translate-y-6 scale-75 text-blue-500 bg-white px-1' : ''
                  }`}
                >
                  Full Name
                </label>
                {nameError && (
                  <p className="text-red-600 text-[9px] mt-1">{nameError}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-4 relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 border rounded-lg transition-all duration-300 peer ${
                    emailError ? 'border-red-500' : successMessage ? 'border-green-500' : 'border-gray-300'
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
                  <p className="text-red-600 text-sm mt-1">
                    {emailError}{' '}
                    {emailError.includes('already in use') && (
                      <Link to="/login" className="text-blue-600 hover:underline">
                        Click here to login
                      </Link>
                    )}
                  </p>
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
                    passwordError ? 'border-red-500' : successMessage ? 'border-green-500' : 'border-gray-300'
                  }`}
                  autoComplete="new-password"
                  required
                />
                <label
                  htmlFor="password"
                  className={`absolute left-3 top-3 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 ${
                    password ? '-translate-y-6 scale-75 text-blue-500 bg-white px-1' : ''
                  }`}
                >
                  Password (6+ Characters)
                </label>
                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">
                  👁️
                </span>
                {passwordError && (
                  <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              {/* Success Message */}
              {successMessage && (
                <p className="text-green-600 text-sm mb-4">{successMessage}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition duration-200"
              >
                Sign Up
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