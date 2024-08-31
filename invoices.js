const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to parse JSON bodies
router.use(express.json());

// GET /invoices
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, comp_code FROM invoices');
    res.json({ invoices: result.rows });
  } catch (err) {
    next(err);
  }
});

// GET /invoices/[id]
router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM invoices WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    const invoice = result.rows[0];
    const companyResult = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [invoice.comp_code]);
    invoice.company = companyResult.rows[0];
    res.json({ invoice });
  } catch (err) {
    next(err);
  }
});

// POST /invoices
router.post('/', async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    const result = await db.query(
      'INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *',
      [comp_code, amt]
    );
    res.status(201).json({ invoice: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// PUT /invoices/[id]
router.put('/:id', async (req, res, next) => {
  try {
    const { amt } = req.body;
    const result = await db.query(
      'UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING *',
      [amt, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ invoice: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// DELETE /invoices/[id]
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM invoices WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ status: 'deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;