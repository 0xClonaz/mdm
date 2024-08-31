'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe("pk_test_51PtsZlIN3vjsoaxX77iBEIzrTgxVF6WhMxUYKaEtmIxmgUba1p8creyhQJO2cmIvSwSzHYABsTyXbxrTxHwgQrIn00TrgH00DL");

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const { data } = await axios.post('/api/checkout', { amount: 9.99 }); // Amount in cents ($9.99)

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} className="button">
      {loading ? 'Processing...' : 'Subscribe for $9.99'}
    </button>
  );
}
