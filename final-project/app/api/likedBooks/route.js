import { query } from '../../lib/db'; // Import the query function from db.js
import jwt from 'jsonwebtoken'; // Import JWT library

export async function GET(req) {
  try {
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
   
    const result = await query(
      `SELECT 
         lb.google_book_id, 
         lb.title, 
         lb.thumbnail_url, 
         lb.authors, 
         COALESCE(
           json_agg(
             json_build_object(
               'review_id', r.id,
               'review_text', r.review_text,
               'review_author_id', r.user_id,
               'review_author_name', u.username
             )
           ) FILTER (WHERE r.review_text IS NOT NULL), 
           '[]'
         ) AS reviews
       FROM 
         liked_books lb
       LEFT JOIN 
         reviews r 
       ON 
         lb.google_book_id = r.book_id
       LEFT JOIN 
         users u 
       ON 
         r.user_id = u.id
       WHERE 
         lb.user_id = $1
       GROUP BY 
         lb.google_book_id, lb.title, lb.thumbnail_url, lb.authors`,
      [userId]
    );

    console.log('Query Result:', result.rows);

    return new Response(JSON.stringify(result.rows), {
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error fetching liked books', { status: 500 });
  }
}