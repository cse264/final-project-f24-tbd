import jwt from 'jsonwebtoken';

import { query } from '../../lib/db';  // Ensure the path is correct

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Query the database for the user
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    const user = result.rows[0];

    // Compare the entered password with the stored password (plaintext comparison)
    if (password !== user.password) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, username: user.username, membership: user.membership }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Returning the JWT token in the response with appropriate status code
    return new Response(
      JSON.stringify({ message: 'Login successful', token }),
      { status: 200, headers: { 'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600` } }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(
      JSON.stringify({ message: 'Server error' }),
      { status: 500 }
    );
  }
}
