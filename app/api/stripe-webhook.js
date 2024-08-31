import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Retrieve the user's ID from session metadata
    const userId = session.metadata.userId;

    // Update user's premium status in Firebase
    try {
      await set(ref(db, `users/${userId}`), {
        isPremium: true,
      });
      console.log(`User ${userId} marked as premium.`);
    } catch (error) {
      console.error('Error updating Firebase:', error);
      return res.status(500).send('Error updating Firebase');
    }
  }

  res.json({ received: true });
}
