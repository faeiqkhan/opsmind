const express = require('express');
const router = express.Router();
const db = require('../../config/db');

router.get('/', async (req, res) => {
  const { userId, method, route, start, end } = req.query;

  let filters = [];
  let values = [];
  let index = 1;

  if (userId) {
    filters.push(`user_id = $${index++}`);
    values.push(userId);
  }

  if (method) {
    filters.push(`method = $${index++}`);
    values.push(method);
  }

  if (route) {
    filters.push(`route = $${index++}`);
    values.push(route);
  }

  if (start && end) {
    filters.push(`created_at BETWEEN $${index++} AND $${index++}`);
    values.push(new Date(start), new Date(end));
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const query = `SELECT * FROM audit_logs ${whereClause} ORDER BY created_at DESC LIMIT 100`;

  const { rows } = await db.query(query, values);
  res.json(rows);
});

module.exports = router;
