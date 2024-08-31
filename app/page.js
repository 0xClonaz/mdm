'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function HomePage() {
  const [tags, setTags] = useState([]);
  const [story, setStory] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingTags, setLoadingTags] = useState(true);
  const [loadingSuggestedTags, setLoadingSuggestedTags] = useState(false);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const db = getDatabase();
        const userRef = ref(db, 'users/' + currentUser.uid);

        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setIsPremium(data ? data.isPremium : false);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await axios.get('/api/scrape');
        setTags(response.data.slice(0, 10));
        setLoadingTags(false);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setLoadingTags(false);
      }
    }

    fetchTags();
  }, []);

  const handleStorySubmit = async (event) => {
    event.preventDefault();
    if (story.trim() === '') return;

    if (!isPremium) {
      alert('Please upgrade to premium to use this feature.');
      return;
    }

    setLoadingSuggestedTags(true);

    try {
      const response = await axios.post('/api/find-tags', { story });
      setSuggestedTags(response.data);
      setLoadingSuggestedTags(false);
    } catch (error) {
      console.error('Error finding tags:', error);
      setLoadingSuggestedTags(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Medium Trends</h1>
        <nav>
          {user ? (
            <>
              <span className="user-email">Logged in as: {user.email}</span>
              <span className="user-status">
                Account Status: {isPremium ? 'Premium' : 'Free'}
              </span>
              <Link href="/subscribe" className="nav-link">Subscribe</Link>
              <Link href="/profile" className="nav-link">Profile</Link>
              <button onClick={() => signOut(auth)} className="button">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="button">Login</Link>
              <Link href="/register" className="button">Register</Link>
            </>
          )}
        </nav>
      </header>
      <section className="summary">
        <h2>Unlock the Power of Trending Tags</h2>
        <p>
          Get ahead of the curve with our comprehensive tag insights. Whether you're crafting the perfect story or optimizing your content strategy, our premium features give you the edge.
        </p>
        {user ? (
            <Link href="/subscribe" className="button">Subscribe</Link>
        ) : (
          <p>Please <Link href="/login" className="button">log in</Link> to access premium features.</p>
        )}
      </section>
      <section className="side-by-side">
        <div className="featured-tags">
          <h2>Top 10 Tags</h2>
          {loadingTags ? (
            <div className="loading">Loading...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tag</th>
                  <th>Value</th>
                  <th>Followers</th>
                  <th>Stories</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag, index) => (
                  <tr key={index}>
                    <td>{tag.rank}</td>
                    <td>{tag.name}</td>
                    <td>{tag.value}</td>
                    <td>{tag.followers}</td>
                    <td>{tag.stories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="find-tags">
          <h2>Find Tags for Your Story</h2>
          <form onSubmit={handleStorySubmit}>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Paste your story here..."
              rows="5"
            ></textarea>
            <button type="submit" className="button">Find Tags</button>
          </form>
          {loadingSuggestedTags ? (
            <div className="loading">Loading...</div>
          ) : (
            suggestedTags.length > 0 && (
              <div>
                <h3>Suggested Tags:</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tag</th>
                      <th>Value</th>
                      <th>Followers</th>
                      <th>Stories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suggestedTags.map((tag, index) => (
                      <tr key={index}>
                        <td>{tag.rank}</td>
                        <td>{tag.name}</td>
                        <td>{tag.value}</td>
                        <td>{tag.followers}</td>
                        <td>{tag.stories}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </section>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Sign Up Required</h2>
            <p>Please sign up and subscribe to use the Find Tags feature.</p>
            <button onClick={() => window.location.href = '/register'} className="button">Sign Up</button>
            <button onClick={() => setShowModal(false)} className="button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
