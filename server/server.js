require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto'); // Native Node.js module for encryption

const app = express();
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Database connection pool setup using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// --- Encryption Utilities ---
// Ensure this key is defined in your server/.env file (must be exactly 32 bytes for AES-256)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_key_must_be_changed_32b';
const IV_LENGTH = 16; // Initialization vector length for AES

// Encrypts plain text (like Spotify tokens) into a secure hex string using AES-256-CBC
function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex'); // Store IV alongside the encrypted data
}

// Decrypts the hex string back into plain text for API usage
function decrypt(text) {
  if (!text) return null;
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
// ----------------------------

// Register a new user account with hashed passwords
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

// Standard email/password login generating a JSON Web Token (JWT)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM account WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const userAccount = result.rows[0];
    
    // Verify that the provided password matches the hashed one in the database
    const isMatch = await bcrypt.compare(password, userAccount.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate an application session token valid for 2 hours
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

// Helper Function: Exchanges the OAuth authorization code for Spotify profile and tokens
async function getSpotifyData(code) {
  // 1. Request access and refresh tokens from Spotify
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI
    })
  });
  
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) throw new Error('Error fetching Spotify token');

  // 2. Fetch user profile data using the newly acquired access token
  const profileResponse = await fetch('https://api.spotify.com/v1/me', {
    headers: { 'Authorization': 'Bearer ' + tokenData.access_token }
  });
  const profile = await profileResponse.json();
  
  // Return both profile and tokens to process them in the respective endpoint
  return { profile, tokenData };
}

// Endpoint 1: Link Spotify account to an existing active session
app.post('/api/spotify/link', async (req, res) => {
  const { code } = req.body;
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const jwtToken = authHeader.split(' ')[1];

  try {
    // 1. Verify the current user's session JWT
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    
    // 2. Retrieve user ID and tokens from Spotify using the authorization code
    const { profile, tokenData } = await getSpotifyData(code);
    
    // 3. Encrypt the Spotify tokens before storing them in the database for security
    const encryptedAccessToken = encrypt(tokenData.access_token);
    const encryptedRefreshToken = encrypt(tokenData.refresh_token);
    
    // 4. Update the account record with the spotify_id and the encrypted tokens
    await pool.query(
      'UPDATE account SET spotify_id = $1, spotify_access_token = $2, spotify_refresh_token = $3 WHERE id = $4',
      [profile.id, encryptedAccessToken, encryptedRefreshToken, decoded.accountId]
    );
    
    res.json({ message: 'Spotify account linked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal error or invalid token' });
  }
});

// Endpoint 2: Log in directly using a previously linked Spotify account
app.post('/api/spotify/login', async (req, res) => {
  const { code } = req.body;
  try {
    const { profile, tokenData } = await getSpotifyData(code);
    
    // Check if the retrieved spotify_id is already linked to a registered user
    const result = await pool.query('SELECT * FROM account WHERE spotify_id = $1', [profile.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Spotify account not linked to any user' });
    }
    
    const userAccount = result.rows[0];
    
    // Update the tokens in the database to ensure we always have valid credentials
    // Note: Spotify might not always return a new refresh token, so we keep the old one if missing
    const encryptedAccessToken = encrypt(tokenData.access_token);
    const encryptedRefreshToken = tokenData.refresh_token 
      ? encrypt(tokenData.refresh_token) 
      : userAccount.spotify_refresh_token;
      
    await pool.query(
      'UPDATE account SET spotify_access_token = $1, spotify_refresh_token = $2 WHERE id = $3',
      [encryptedAccessToken, encryptedRefreshToken, userAccount.id]
    );
    
    // Generate the standard application session token for the user
    const token = jwt.sign(
      { accountId: userAccount.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2h' }
    );
    
    res.json({ message: 'Authentication successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error authenticating with Spotify' });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));