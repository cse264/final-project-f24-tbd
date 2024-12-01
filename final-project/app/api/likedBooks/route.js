// /app/api/likedBooks/route.js

import { query } from '../../lib/db'; // Import the query function from db.js

export async function GET(req) {
  try {
    // Get the userId from the query parameters or request body
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId'); // Extract userId from query params

    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    // Query the liked_books table for the user's liked books
    const result = await query(
      'SELECT * FROM liked_books WHERE user_id = $1',
      [userId]
    );

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error fetching liked books', { status: 500 });
  }
}