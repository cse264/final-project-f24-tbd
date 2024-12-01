import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/postgres.js';  // Your PostgreSQL connection (adjust based on your db setup)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      // Query the database for the user with the given username
      const query = 'SELECT * FROM users WHERE username = $1';
      const { rows } = await pool.query(query, [username]);

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare the password with the hashed password in the database
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create a JWT token
      const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send the token as a cookie or in the response
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
