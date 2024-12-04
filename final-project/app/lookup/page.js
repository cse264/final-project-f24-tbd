'use client' // Ensure this is a client component since we're using hooks

import { useState } from 'react';
import axios from 'axios';

export default function Search() {
  const [bookName, setBookName] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(1); // For now, hardcoded userId (replace with actual user ID)
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeBookId, setActiveBookId] = useState(null); // Track which book is currently being reviewed

  const handleSearch = async (e) => {
    e.preventDefault();

    setBooks([]);
    setError('');

    if (!bookName) return;

    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
        params: {
          q: bookName,
          key: process.env.GOOGLE_BOOKS_API_KEY, // Store your API key in .env.local
        },
      });

      if (res.data.items) {
        setBooks(res.data.items);
      } else {
        setError('No books found.');
      }
    } catch (err) {
      setError('An error occurred while fetching data.');
    }
  };

  const handleLike = async (book) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token
  
      const response = await axios.post(
        '/api/likeBook',
        {
          googleBookId: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors,
          description: book.volumeInfo.description,
          thumbnailUrl: book.volumeInfo.imageLinks?.thumbnail || '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );
  
      if (response.status === 200) {
        alert('Book liked successfully!');
      } else {
        alert('Failed to like the book.');
      }
    } catch (error) {
      alert('An error occurred while liking the book.');
      console.error('Like error:', error);
    }
  };
  

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmitReview = async () => {
    if (!reviewText) return;
  
    setIsSubmittingReview(true);
  
    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token
  
      const response = await axios.post(
        '/api/review',
        {
          bookId: activeBookId,
          reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );
  
      if (response.status === 200) {
        alert('Review added successfully!');
        setReviewText(''); // Clear the review form
        setActiveBookId(null); // Close the review form
      } else {
        alert('Failed to add the review.');
      }
    } catch (error) {
      alert('An error occurred while submitting the review.');
      console.error('Review submission error:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };  

  return (
    <div className="min-h-screen flex flex-col justify-between bg-black-100 bg-[url('/giphy.webp')] bg-cover bg-center">
    <main className="flex-grow flex flex-col items-center justify-center text-center">
      <h1 className="lg:text-5xl my-6 font-bold">Search</h1>
      {/* <hr className="w-full max-w-2xl border-t-2 border-gray-300 mb-4" /> */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter book name"
          value={bookName}
          className="lg:text-2xl mb-3 text-white-200"
          onChange={(e) => setBookName(e.target.value)}
        />
        <button type="submit" className="px-4 py-1 bg-orange-400 text-white font-semibold rounded-full hover:bg-orange-600 mb-2 my-4">Search</button>
        <hr className="w-full max-w-5xl border-t-2 border-gray-300 mb-8 my-4" />

      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {books.length > 0 && (
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <h2 className="lg:text-3xl font-bold mb-1">{book.volumeInfo.title}</h2>
                <p className="my-2 mb-8">{book.volumeInfo.authors?.join(', ')}</p>
                <p>{book.volumeInfo.description}</p>
                {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail && (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    className="mx-auto w-60 h-100 mb-4 my-4 flex-grow flex flex-col items-center justify-center text-center"

                  />
                )}
                <button onClick={() => handleLike(book)} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-400">Like</button>

                {/* Add Review Button */}
                <button onClick={() => setActiveBookId(book.id)} className="ml-2 px-4 py-2 bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-400">Add Review</button>
                <hr className="w-full border-t-2 border-gray-300 mx-auto my-4 mb-4" />


                {/* Review Form (shown when 'Add Review' is clicked) */}
                {activeBookId === book.id && (
                  <div>
                    <textarea
                      placeholder="Write your review here"
                      value={reviewText}
                      onChange={handleReviewChange}
                      rows="4"
                      cols="50"
                    />
                    <br />
                    <button
                      onClick={handleSubmitReview}
                      disabled={isSubmittingReview}   
                      className="px-4 py-1 text-white font-semibold rounded-full bg-orange-600 hover:bg-orange-400 my-2 mb-8"           >
                      {isSubmittingReview ? 'Submitting Review...' : 'Submit Review'}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      </main>
    </div>
  );
}
