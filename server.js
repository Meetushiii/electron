const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize database
const db = new sqlite3.Database('waitlist.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected');
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      }
    });
  }
});

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// API endpoint to register email
app.post('/api/register', (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email || !email.trim()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email is required' 
    });
  }

  const emailTrimmed = email.trim().toLowerCase();

  if (!isValidEmail(emailTrimmed)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format' 
    });
  }

  // Check for duplicates and insert
  db.get('SELECT email FROM emails WHERE email = ?', [emailTrimmed], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error. Please try again.' 
      });
    }

    if (row) {
      return res.status(409).json({ 
        success: false, 
        message: 'This email is already registered' 
      });
    }

    // Insert new email
    db.run('INSERT INTO emails (email) VALUES (?)', [emailTrimmed], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Server error. Please try again.' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Successfully registered. Thank you!' 
      });
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get waitlist count (optional endpoint)
app.get('/api/count', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM emails', (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ count: row.count });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database: waitlist.db`);
  console.log(`API endpoints:`);
  console.log(`  POST /api/register - Register email`);
  console.log(`  GET  /api/health - Health check`);
  console.log(`  GET  /api/count - Get waitlist count`);
});

