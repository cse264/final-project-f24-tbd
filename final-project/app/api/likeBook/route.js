import jwt from 'jsonwebtoken';
import { pool } from '../../lib/db';

export async function POST(req) {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1]; // Format: "Bearer <token>"
    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Parse the request body
    const { googleBookId, title, authors, description, thumbnailUrl } = await req.json();

    // Ensure required fields are present
    if (!googleBookId || !title) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    // Insert the liked book into the database
    const result = await pool.query(
      'INSERT INTO liked_books (user_id, google_book_id, title, authors, description, thumbnail_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, googleBookId, title, authors, description, thumbnailUrl]
    );

    const newLikedBook = result.rows[0];
    return new Response(
      JSON.stringify({ message: 'Book liked successfully', book: newLikedBook }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding liked book:', error);
    return new Response(JSON.stringify({ message: 'Failed to like book' }), { status: 500 });
  }
}