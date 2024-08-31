import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    // Ensure environment variables are correctly used
    const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`;

    // Check if URLs are correctly defined
    if (!successUrl.startsWith('http') || !cancelUrl.startsWith('http')) {
      throw new Error('Invalid URL in environment variables');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Subscription', // Example product name
            },
            unit_amount: 999, // Example amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return new Response(JSON.stringify({ id: session.id }), { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
