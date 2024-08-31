import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Subscribe() {
  const handleSubscribe = async () => {
    const stripe = await stripePromise;

    const response = await fetch('/api/checkout', {
      method: 'POST',
    });

    const { id: sessionId } = await response.json();

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
