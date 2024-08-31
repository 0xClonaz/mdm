import { buffer } from 'micro';
import admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin SDK
const serviceAccount = require('../../path-to-your-service-account-key.json'); // Adjust path to your Firebase service account key
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://your-database-name.firebaseio.com' // Replace with your Firebase Database URL
  });
}
const db = admin.database();
const auth = admin.auth();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      // Retrieve user ID from session or metadata
      const userId = session.metadata.userId;

      // Update user subscription status in Firebase
      try {
        await db.ref('users/' + userId).update({ isPremium: true });
        console.log('User subscription status updated.');
      } catch (error) {
        console.error('Error updating user subscription status:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
