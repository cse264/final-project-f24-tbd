import { query } from '../../lib/db';

export async function POST(req) {
  try {
    const { bookId, userId, reviewText } = await req.json();  // Parse the incoming JSON data

    // Insert the review into the database
    const result = await query(
      'INSERT INTO reviews (book_id, user_id, review_text) VALUES ($1, $2, $3) RETURNING *',
      [bookId, userId, reviewText]  // Correct order: bookId first, then userId
    );

    if (result.rows.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Review added successfully', review: result.rows[0] }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'Failed to add review' }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error adding review:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500 }
    );
  }
}
