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
        const token = localStorage.getItem("token"); // Replace with your token storage mechanism

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
    <div>
      <h1>Recommended Books</h1>
      <ul>
        {recommendations.length > 0 ? (
          recommendations.map((book, index) => (
            <li key={index}>
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(", ")}</p>
              <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
            </li>
          ))
        ) : (
          <p>No recommendations available.</p>
        )}
      </ul>
    </div>
  );
}