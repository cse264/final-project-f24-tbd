import { query } from '../../lib/db'; 
import jwt from 'jsonwebtoken'; 

export async function DELETE(req) {
  try {
    const { bookId } = await req.json(); // Get bookId from request body
    const authHeader = req.headers.get('Authorization'); // Get the Authorization header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Authorization token is required', { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    const secretKey = process.env.JWT_SECRET;

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

    return new Response('Liked book and associated reviews removed successfully', { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error removing liked book', { status: 500 });
  }
}