import { pool } from '../../lib/db';  // Ensure this is your correct path to the DB connection

export async function POST(req) {
  const { userId, googleBookId, title, authors, description, thumbnailUrl } = await req.json();

  // Ensure required fields are present
  if (!userId || !googleBookId || !title) {
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  try {
    // Insert the liked book into the database
    const result = await pool.query(
      'INSERT INTO liked_books (user_id, google_book_id, title, authors, description, thumbnail_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, googleBookId, title, authors, description, thumbnailUrl]
    );

    const newLikedBook = result.rows[0];
    return new Response(JSON.stringify({ message: 'Book liked successfully', book: newLikedBook }), { status: 200 });
  } catch (error) {
    console.error('Error adding liked book:', error);
    return new Response(JSON.stringify({ message: 'Failed to like book' }), { status: 500 });
  }
}
