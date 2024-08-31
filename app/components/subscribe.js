import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutButton() {
  const handleSubscribe = async () => {
    const stripe = await stripePromise;
//s
    if (!stripe) {
      console.error('Stripe.js has not loaded');
      return;
    }

    const response = await fetch('/api/checkout', { method: 'POST' });

    if (!response.ok) {
      console.error('Failed to create checkout session');
      return;
    }

    const { sessionId } = await response.json();

    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Error redirecting to checkout:', error);
    }
  };

  return (
    <button role="link" onClick={handleSubscribe}>
      Subscribe
    </button>
  );
}
