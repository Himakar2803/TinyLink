require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const validUrl = require('valid-url');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Health Check
app.get('/healthz', (req, res) => {
  res.json({ ok: true, version: '1.0' });
});

// Create a link
app.post('/api/links', async (req, res) => {
  try {
    const { target, code } = req.body;

    if (!target || !validUrl.isUri(target)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    let finalCode = code;

    if (!finalCode) {
      finalCode = Math.random().toString(36).substring(2, 8);
    }

    const check = await pool.query('SELECT * FROM links WHERE code=$1', [finalCode]);
    if (check.rows.length > 0) {
      return res.status(409).json({ error: 'Code already exists' });
    }

    await pool.query(
      'INSERT INTO links(code, target, clicks) VALUES($1,$2,0)',
      [finalCode, target]
    );

    res.status(201).json({ code: finalCode, target });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all
app.get('/api/links', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM links');
  res.json(rows);
});

// Redirect
app.get('/:code', async (req, res) => {
  const code = req.params.code;

  const result = await pool.query('SELECT target FROM links WHERE code=$1', [code]);

  if (result.rows.length === 0) {
    return res.status(404).send('Not found');
  }

  const target = result.rows[0].target;

  await pool.query(
    'UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code=$1',
    [code]
  );

  res.redirect(target);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
