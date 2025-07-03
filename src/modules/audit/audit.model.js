const db = require('../../config/db');

console.log('audit.model.js loaded');

const saveAuditLog = async (log) => {
  const dbName = await db.query('SELECT current_database()');
  console.log('Connected to DB:', dbName.rows[0].current_database);

  const query = `
    INSERT INTO audit_logs (user_id, method, route, status_code, ip_address, metadata, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  const values = [
    log.userId,
    log.method,
    log.route,
    log.statusCode,
    log.ip,
    JSON.stringify(log.metadata),
    new Date(log.timestamp),
  ];

  console.log('Attempting to insert audit log:', values);
  await db.query(query, values);
  console.log('Insert complete');
};

module.exports = { saveAuditLog };
