import { query } from "../../lib/db"; 
import jwt from "jsonwebtoken"; 

export async function GET(req) {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authorization token required" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    
    // Verify and decode the token
    const secret = process.env.JWT_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 403 });
    }

    const userId = decoded.userId; 
    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID missing from token" }), { status: 400 });
    }

    // Fetch liked books for the user from the liked_books table
    const likedBooksQuery = `
      SELECT google_book_id, title, authors, description, thumbnail_url
      FROM liked_books
      WHERE liked_books.user_id = $1
    `;
    const likedBooksResult = await query(likedBooksQuery, [userId]);

    const likedBooks = likedBooksResult.rows;

    if (!likedBooks.length) {
      return new Response(JSON.stringify({ error: "No liked books found for this user" }), { status: 404 });
    }

    // Retrieve genres from the Google Books API for each liked book
    const genrePromises = likedBooks.map(async (book) => {
      const apiUrl = `https://www.googleapis.com/books/v1/volumes/${book.google_book_id}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch book details from API for book ID: ${book.google_book_id}`);
      }

      const apiData = await response.json();
      const genres = apiData.volumeInfo.categories || []; 

      return {
        ...book,
        genres,
      };
    });

    // Wait for all genre data to be fetched
    const booksWithGenres = await Promise.all(genrePromises);

    // Extract unique genres
    const genres = booksWithGenres
      .flatMap((book) => book.genres)
      .filter(Boolean);
    const uniqueGenres = [...new Set(genres)];

    if (!uniqueGenres.length) {
      return new Response(
        JSON.stringify({ error: "No genres found in liked books" }),
        { status: 404 }
      );
    }

    // Fetch random books from the Google Books API based on genres
    const randomGenre = uniqueGenres[Math.floor(Math.random() * uniqueGenres.length)];
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
      randomGenre
    )}&maxResults=10`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch books from API. Status: ${response.status}`);
    }

    const apiData = await response.json();

    // Return the recommendations
    const recommendations = apiData.items || [];
    return new Response(JSON.stringify({ recommendations }), { status: 200 });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch recommendations" }),
      { status: 500 }
    );
  }
}
