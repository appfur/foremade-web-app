import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Add Firestore
import { getAuth } from "firebase/auth"; // Add Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRWR2Z2xlmcGBSVHEbbkIm9nL_qpTGSno",
  authDomain: "foremade-backend.firebaseapp.com",
  projectId: "foremade-backend",
  storageBucket: "foremade-backend.firebasestorage.app",
  messagingSenderId: "957543574407",
  appId: "1:957543574407:web:315572254cc0ba6b80c122"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Authentication

// console.log("Firebase initialized", app, db, auth);

// Export the initialized services
export { app, db, auth };