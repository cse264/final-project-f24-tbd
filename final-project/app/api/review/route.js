import jwt from 'jsonwebtoken';
import { pool } from '../../lib/db';

export async function POST(req) {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Extract userId from the token

    // Parse request body
    const { bookId, reviewText } = await req.json();

    // Ensure required fields are present
    if (!bookId || !reviewText) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    // Insert the review into the database
    const result = await pool.query(
      'INSERT INTO reviews (user_id, book_id, review_text) VALUES ($1, $2, $3) RETURNING *',
      [userId, bookId, reviewText]
    );

    return new Response(
      JSON.stringify({ message: 'Review added successfully', review: result.rows[0] }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding review:', error);
    return new Response(JSON.stringify({ message: 'Failed to add review' }), { status: 500 });
  }
}
