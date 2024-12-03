import { query } from '../../lib/db'; // Import the query function from db.js
import jwt from 'jsonwebtoken'; // Import JWT library

export async function DELETE(req) {
  try {
    const { reviewId, bookId } = await req.json(); // Get reviewId and bookId from request body
    const authHeader = req.headers.get('Authorization'); // Get the Authorization header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Authorization token is required', { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    const secretKey = process.env.JWT_SECRET; // Ensure you have your secret key set in the environment variables

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey); // Decode and verify the token
    } catch (err) {
      console.error('JWT Verification Error:', err);
      return new Response('Invalid or expired token', { status: 403 });
    }

    const userId = decoded.userId; // Extract userId from the token payload

    if (!userId) {
      return new Response('User ID not found in token', { status: 400 });
    }

    // Check if the review belongs to the logged-in user
    console.log('Request body:', { reviewId, bookId });
    console.log('Decoded userId:', userId);
    const reviewResult = await query(
      `SELECT * FROM reviews WHERE id = $1 AND user_id = $2 AND book_id = $3`,
      [reviewId, userId, bookId]
    );

    if (reviewResult.rows.length === 0) {
      console.log('Review not found or does not belong to the user');
      return new Response('Review not found or does not belong to the user', {
        status: 404,
      });
    }

    // Delete the review from the reviews table
    await query(
      `DELETE FROM reviews WHERE id = $1 AND user_id = $2 AND book_id = $3`,
      [reviewId, userId, bookId]
    );

    return new Response('Review removed successfully', { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error removing review', { status: 500 });
  }
}