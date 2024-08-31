// app/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK-KiY9uc5BxZk31LoCUM8P5CTBWCAxaQ",
  authDomain: "mediumtrends-cfa56.firebaseapp.com",
  projectId: "mediumtrends-cfa56",
  storageBucket: "mediumtrends-cfa56.appspot.com",
  messagingSenderId: "162665620462",
  appId: "1:162665620462:web:e2caf8b238ab27a2c624ff",
  measurementId: "G-SGSS62MCYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the authentication service
export const auth = getAuth(app);
