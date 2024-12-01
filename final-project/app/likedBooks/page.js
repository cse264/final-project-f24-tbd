'use client'  // This is required to use client-side features like hooks

import { useState, useEffect } from 'react';

export default function LikedBooksPage() {
  const [likedBooks, setLikedBooks] = useState([]);
  const [userId, setUserId] = useState(''); // You can set this dynamically based on logged-in user

  useEffect(() => {
    if (userId) {
      // Fetch liked books from the backend API
      fetch(`/api/likedBooks?userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setLikedBooks(data); // Set the liked books data
        })
        .catch((error) => {
          console.error('Error fetching liked books:', error);
        });
    }
  }, [userId]); // Fetch liked books whenever userId changes

  const handleUserIdChange = (e) => {
    setUserId(e.target.value); // Update userId based on input
  };

  return (
    <div>
      <h1>Your Liked Books</h1>
      
      <div>
        <label>
          Enter User ID:
          <input type="text" value={userId} onChange={handleUserIdChange} />
        </label>
      </div>

      <div>
        {likedBooks.length > 0 ? (
          <ul>
            {likedBooks.map((book) => (
              <li key={book.google_book_id}>
                <strong>{book.title}</strong> by {book.author || 'Unknown'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No liked books found.</p>
        )}
      </div>
    </div>
  );
}
