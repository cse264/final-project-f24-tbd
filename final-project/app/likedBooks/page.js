'use client'

import { useState, useEffect } from 'react';

// Function to decode JWT and extract userId
const decodeJWT = (token) => {
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1])); // Decoding the JWT payload
  return payload.userId; // Adjust this based on your token structure
};

export default function LikedBooksPage() {
  const [likedBooks, setLikedBooks] = useState([]);
  const [userId, setUserId] = useState(null); // Store user ID after decoding JWT

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve JWT from localStorage
    const decodedUserId = decodeJWT(token); // Decode userId from the JWT token

    if (decodedUserId) {
      setUserId(decodedUserId); // Set the userId if it exists in the token
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem('token');
      fetch(`/api/likedBooks?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch liked books');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched liked books:', data);
          setLikedBooks(data);  // Update state only after the data is fetched
        })
        .catch((error) => {
          console.error('Error fetching liked books:', error);
        });
    }
  }, [userId]);  // Runs when userId changes  

  const handleRemove = (bookId) => {
    const token = localStorage.getItem('token'); // Get the token
  
    fetch(`/api/removeLikedBook`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookId }), // Pass the bookId in the request body
    })
      .then((response) => {
        if (response.ok) {
          setLikedBooks((prevBooks) =>
            prevBooks.filter((book) => book.google_book_id !== bookId)
          );
        } else {
          console.error('Failed to remove liked book');
        }
      })
      .catch((err) => console.error('Error:', err));
  };  

  const handleRemoveReview = (bookId, reviewId) => {
    const token = localStorage.getItem('token'); // Get the token
    console.log('Removing review', { reviewId, bookId, token }); // Log values for debugging
  
    fetch(`/api/removeReview`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reviewId,
        bookId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Find the book with the deleted review and update the reviews array
          setLikedBooks((prevBooks) => 
            prevBooks.map((book) => {
              if (book.google_book_id === bookId) {
                // Filter out the deleted review
                const updatedReviews = book.reviews.filter(review => review.review_id !== reviewId);
                return {
                  ...book,
                  reviews: updatedReviews,
                };
              }
              return book;
            })
          );
        } else {
          console.error('Failed to remove review');
        }
      })
      .catch((err) => console.error('Error:', err));
  };  

  return (
    <div>
      <h1>Your Liked Books</h1>
  
      <div>
        {likedBooks.length > 0 ? (
          <ul>
            {likedBooks.map((book) => (
              <li key={book.google_book_id}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  {book.thumbnail_url && (
                    <img
                      src={book.thumbnail_url}
                      alt={book.title}
                      style={{ width: '50px', height: '75px', marginRight: '10px' }}
                    />
                  )}
                  <div>
                    <strong>{book.title}</strong> by {book.authors || 'Unknown'}
                  </div>
                  <button
                    onClick={() => handleRemove(book.google_book_id)}
                    style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                  >
                    Remove Book
                  </button>
                </div>

                <div style={{ marginLeft: '20px' }}>
                  <h4>Reviews:</h4>
                  {book.reviews && book.reviews.length > 0 ? (
                    <ul>
                      {book.reviews.map((review) => {
                        console.log('Review object:', review); // Log the review object here
                        return (
                          <li key={review.review_id}> {/* Check if review_id is present */}
                            <p>{review.review_text}</p>
                            <small>By {review.review_author_name || 'Unknown User'}</small>
                            {review.review_author_id === userId && (
                              <button
                                onClick={() => handleRemoveReview(book.google_book_id, review.review_id)}
                                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                              >
                                Remove Review
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>No reviews available.</p>
                  )}
                </div>
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