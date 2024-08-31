import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

<<<<<<< HEAD
// Your web app's Firebase configuration using environment variables
=======
// Your web app's Firebase configuration from environment variables
>>>>>>> dd014170031abab1302d77145d71257c38704bd4
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
<<<<<<< HEAD
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
=======
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
>>>>>>> dd014170031abab1302d77145d71257c38704bd4
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the authentication service
export const auth = getAuth(app);
