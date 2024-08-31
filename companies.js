const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to parse JSON bodies
router.use(express.json());

// GET /companies
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT code, name FROM companies');
    res.json({ companies: result.rows });
  } catch (err) {
    next(err);
  }
});

// GET /companies/[code]
router.get('/:code', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM companies WHERE code = $1', [req.params.code]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    const company = result.rows[0];
    const invoicesResult = await db.query('SELECT id FROM invoices WHERE comp_code = $1', [company.code]);
    company.invoices = invoicesResult.rows.map(row => row.id);
    res.json({ company });
  } catch (err) {
    next(err);
  }
});

// POST /companies
router.post('/', async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const result = await db.query(
      'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *',
      [code, name, description]
    );
    res.status(201).json({ company: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// PUT /companies/[code]
router.put('/:code', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const result = await db.query(
      'UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING *',
      [name, description, req.params.code]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ company: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// DELETE /companies/[code]
router.delete('/:code', async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM companies WHERE code = $1 RETURNING code', [req.params.code]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ status: 'deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;