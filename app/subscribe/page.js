'use client';

import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import CheckoutButton from '../components/subscribe';

export default function SubscribePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  if (user === null) {
    return (
      <div className="container">
        <h1>Subscribe</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <h1>Subscribe</h1>
        <p>You must be logged in to access this page.</p>
        <a href="/login" className="button">Login</a>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Subscribe</h1>
      <p>Upgrade to our Premium plan to unlock exclusive features:</p>
      <ul>
        <li>Top 100 trending tags</li>
        <li>Advanced sorting options</li>
        <li>Find tags for your stories</li>
      </ul>
      <CheckoutButton />
    </div>
  );
}
