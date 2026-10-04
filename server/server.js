require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Register a new account
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body; 
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      'INSERT INTO account (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, email',
      [firstName, lastName, email, hashedPassword]
    );
    res.status(201).json({ message: 'Account registered successfully', account: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log in and generate JWT
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const userAccount = result.rows[0];
    
    // Verify password match
    const isMatch = await bcrypt.compare(password, userAccount.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate session token
    const token = jwt.sign(
      { accountId: userAccount.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2h' }
    );
    res.json({ message: 'Authentication successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));