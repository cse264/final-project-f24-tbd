import { query } from '../../lib/db'; // Import the query function from db.js
import jwt from 'jsonwebtoken'; // Import JWT library

export async function DELETE(req) {
  try {
    const { bookId, reviews } = await req.json(); // Get bookId and reviews from request body
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


    // Delete the liked book from the user's liked books
    await query(
      `DELETE FROM liked_books
       WHERE google_book_id = $1 AND user_id = $2`,
      [bookId, userId]
    );

    return new Response('Liked book removed successfully', { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error removing liked book', { status: 500 });
  }
}