import { query } from '../../lib/db';  // Make sure the path is correct

export async function POST(req, res) {
  try {
    const { username, password } = await req.json();

    // Query the database for the user
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];

    // Compare the entered password with the stored password (plaintext comparison)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token as a cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
