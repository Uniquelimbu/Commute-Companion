// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; 
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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