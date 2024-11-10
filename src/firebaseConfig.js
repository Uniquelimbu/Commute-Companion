// Import necessary functions from the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD80vOOzkHt9gDKh4MYIbDIlzLBSt2L1yA",
  authDomain: "commute-companion-dcf55.firebaseapp.com",
  projectId: "commute-companion-dcf55",
  storageBucket: "commute-companion-dcf55.firebasestorage.app",
  messagingSenderId: "407348983468",
  appId: "1:407348983468:web:ff1f81063876e74eaf5109",
  measurementId: "G-B522ZRMDQJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Google Authentication functions
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};