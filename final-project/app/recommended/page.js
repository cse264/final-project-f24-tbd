"use client"

import { useState, useEffect } from "react";

export default function Recommended() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        // Retrieve the token from local storage or context
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token is missing");
        }

        const res = await fetch(`/api/recommendations`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setRecommendations(data.recommendations);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[url('/giphy.webp')] bg-contain bg-center">
      <main className="flex-grow flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl md:text-5xl lg:text-5xl my-4 text-white font-bold mb-6">Recommended for You</h1>
        <hr className="w-full border-t-2 border-gray-300 mb-6" />
      <ul>
        {recommendations.length > 0 ? (
          recommendations.map((book, index) => (
            <li key={index} className="flex-grow flex flex-col items-center justify-center text-center">
              <h3 className = "lg:text-2xl font-bold">{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(", ")}</p>
              
              <img 
                src={book.volumeInfo.imageLinks?.thumbnail} 
                alt={book.volumeInfo.title} 
                className="w-60 h-100 mb-4 my-4"
                />
                <hr className="w-full max-w-3xl border-t-2 border-gray-300 mx-auto my-10 mb-6" />

            </li>
          ))
        ) : (
          <p>No recommendations available.</p>
        )}
      </ul>
      </main>
    </div>
  );
}