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
    <div className="min-h-screen flex flex-col justify-between bg-[url('/giphy.webp')] bg-contain bg-center">
      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="lg:text-5xl my-4 text-white font-bold mb-6">Your Liked Books</h1>
        <hr className="w-full border-t-2 border-gray-300 mb-6" />
        <div>
          {likedBooks.length > 0 ? (
            <ul>
              {likedBooks.map((book) => (
                <li key={book.google_book_id} className="mb-6">
                  <div className="flex flex-col items-center mb-4">
                    {book.thumbnail_url && (
                      <img
                        src={book.thumbnail_url}
                        alt={book.title}
                        className="w-60 h-100 mb-2 my-6"
                      />
                    )}
                    <div className="text-center lg:text-3xl my-4 mb-4">
                      <strong>{book.title}</strong> by {book.authors || 'Unknown'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(book.google_book_id)}
                    className="px-3 py-2 text-xs bg-red-800 text-white font-semibold rounded-md hover:bg-red-600 mb-8"
                  >
                    Remove Book
                  </button>
                  <div>
                    <h4 className="text-3xl text-white font-semibold mb-4 underline">Reviews</h4>
                    {book.reviews && book.reviews.length > 0 ? (
                      <ul>
                        {book.reviews.map((review) => {
                          console.log('Review object:', review); // Log the review object here
                          return (
                            <li key={review.review_id} className="flex flex-col mx-auto w-80 h-40 bg-neutral-900 rounded-lg flex items-center justify-center mb-4">
                              <p className="text-2xl">{review.review_text}</p>
                              <small className="text-lg">By {review.review_author_name || 'Unknown User'}</small>
                              {review.review_author_id === userId && (
                                <button
                                  onClick={() => handleRemoveReview(book.google_book_id, review.review_id)}
                                  className="px-2 py-1 text-xs bg-red-800 text-white font-semibold rounded-md hover:bg-red-600 mt-2"
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
                    <hr className="w-full max-w-3xl border-t-2 border-gray-300 mx-auto my-10 mb-6" />

                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No liked books found.</p>
          )}
        </div>
      </main>
    </div>
  );
  
}