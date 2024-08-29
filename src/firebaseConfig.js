// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Authentication
import { getDatabase } from "firebase/database"; // Import Realtime Database
import { getAnalytics } from "firebase/analytics"; // Import Analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgIbJptLXSmLeUfh-Acg00bs4AHkXD_XA",
  authDomain: "grievancereporting-bd228.firebaseapp.com",
  projectId: "grievancereporting-bd228",
  storageBucket: "grievancereporting-bd228.appspot.com",
  messagingSenderId: "690652872984",
  appId: "1:690652872984:web:7eb97b7dfa015afdb19e6d",
  measurementId: "G-ZRZ20YD5MP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialize Analytics
export const auth = getAuth(app); // Export Auth instance
export const db = getDatabase(app); // Export Realtime Database instance