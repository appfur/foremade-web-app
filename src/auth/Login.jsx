import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
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
      return 'An account already exists with this email.';
    default:
      return 'An error occurred. Please try again later.';
  }
};

// Generate username from full name (e.g., "Emmanuel Chinecherem" -> "emmaChi021")
const generateUsername = (fullName) => {
  const nameParts = fullName.trim().split(' ').filter(part => part);
  const firstName = nameParts[0] || '';
  const lastName = nameParts[1] || '';
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  let usernameBase;
  if (firstName) {
    usernameBase = (firstName.slice(0, 4) + lastName.slice(0, 3)).toLowerCase();
  } else {
    usernameBase = 'user';
  }
  const username = (usernameBase + randomNum).replace(/[^a-z0-9]/g, '');
  return username;
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Resend verification email
  const handleResendVerification = async () => {
    setLoading(true);
    setEmailError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      setEmailError(
        `A new verification email has been sent to ${email}. Please check your inbox or spam folder.`
      );
    } catch (err) {
      console.error('Resend verification error:', err);
      setEmailError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');
    setLoading(true);

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

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setEmailError(
          <>
            Your email is not verified. Please check your inbox or spam folder for the verification email sent to {email}. Click the link to verify, then try logging in again. Need a new link?{' '}
            <button
              onClick={handleResendVerification}
              className="text-blue-600 hover:underline"
              disabled={loading}
            >
              Resend Verification
            </button>
          </>
        );
        setLoading(false);
        return;
      }

      console.log('User logged in successfully:', user);
      setSuccessMessage('Login successful! Redirecting to profile...');
      setTimeout(() => {
        setLoading(false);
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      const errorMessage = getFriendlyErrorMessage(err);
      if (errorMessage.includes('email') || errorMessage.includes('account')) {
        setEmailError(
          <>
            {errorMessage}{' '}
            {errorMessage.includes('sign up') && (
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign up here
              </Link>
            )}
          </>
        );
      } else if (errorMessage.includes('password')) {
        setPasswordError(errorMessage);
      } else {
        setEmailError(errorMessage);
      }
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setEmailError('');
    setPasswordError('');
    setSuccessMessage('');
    setLoading(true);

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setEmailError(
          <>
            Your email is not verified. Please check your inbox or spam folder for the verification email sent to {user.email}. Click the link to verify, then try logging in again. Need a new link?{' '}
            <button
              onClick={() => {
                sendEmailVerification(user).then(() => {
                  setEmailError(`A new verification email has been sent to ${user.email}. Please check your inbox or spam folder.`);
                }).catch((err) => {
                  console.error('Resend verification error:', err);
                  setEmailError(getFriendlyErrorMessage(err));
                });
              }}
              className="text-blue-600 hover:underline"
              disabled={loading}
            >
              Resend Verification
            </button>
          </>
        );
        setLoading(false);
        return;
      }

      // Check if user already exists in Firestore
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        // New user, save their data to Firestore
        const fullName = user.displayName || user.email.split('@')[0];
        const username = generateUsername(fullName);
        await setDoc(userDoc, {
          email: user.email,
          name: fullName,
          username: username,
          address: '',
          createdAt: new Date().toISOString(),
          uid: user.uid,
          profileImage: null,
        });

        // Update local storage for consistency with Register.jsx
        const userData = {
          email: user.email,
          name: fullName,
          username: username,
          address: '',
          createdAt: new Date().toISOString(),
          uid: user.uid,
          profileImage: null,
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        console.log('User registered with Google successfully');
      }

      console.log('User signed in with Google successfully');
      setSuccessMessage('Google Sign-In successful! Redirecting to profile...');
      setTimeout(() => {
        setLoading(false);
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error('Google Sign-In error:', err);
      setLoading(false);
      setEmailError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8"></div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign In</h2>
          <p className="text-gray-600 mb-6">
            Don't have an account?{' '}
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
                  <p className="text-red-600 text-[10px] mt-1">{emailError}</p>
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
                  <p className="text-red-600 text-[10px] mt-1">{passwordError}</p>
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
                <p className="text-green-600 text-[10px] mb-4">{successMessage}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-900 text-white p-3 rounded-lg hover:bg-blue-800 transition duration-200"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Google/Facebook Sign-In Section */}
            <div className="flex flex-col justify-center items-center md:border-l md:pl-6">
              <p className="text-gray-600 mb-4">Or continue with</p>
              <button
                onClick={handleGoogleSignIn}
                className="w-full max-w-xs bg-white border border-gray-300 p-3 rounded-lg flex items-center justify-center mb-4 hover:bg-gray-100 transition duration-200"
                disabled={loading}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                {loading ? 'Processing...' : 'Google'}
              </button>
              <button
                className="w-full max-w-xs bg-white border border-gray-300 p-3 rounded-lg flex items-center justify-center hover:bg-gray-100 transition duration-200"
                disabled={loading}
              >
                <img
                  src="https://www.facebook.com/favicon.ico"
                  alt="Facebook"
                  className="w-5 h-5 mr-2"
                />
                {loading ? 'Processing...' : 'Facebook'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}