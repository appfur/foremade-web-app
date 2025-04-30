import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyCRWR2Z2xlmcGBSVHEbbkIm9nL_qpTGSno",
  authDomain: "foremade-backend.firebaseapp.com",
  projectId: "foremade-backend",
  storageBucket: "foremade-backend.firebasestorage.app",
  messagingSenderId: "957543574407",
  appId: "1:957543574407:web:315572254cc0ba6b80c122"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize and export storage

export { auth, db, storage }; // Export storage