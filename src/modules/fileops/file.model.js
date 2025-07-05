const db = require('../../config/db'); // your pg pool or client

const saveFileMeta = async ({ filename, size, userId, access }) => {
  const query = `
    INSERT INTO files (filename, size, user_id, access, uploaded_at)
    VALUES ($1, $2, $3, $4, NOW())
  `;
  const values = [filename, size, userId, access || 'private'];
  await db.query(query, values);
};

const getUserStorageUsed = async (userId) => {
  const { rows } = await db.query(
    'SELECT SUM(size) as used FROM files WHERE user_id = $1', [userId]
  );
  return rows[0].used || 0;
};

const getFileById = async (id) => {
  const { rows } = await db.query('SELECT * FROM files WHERE id = $1', [id]);
  return rows[0];
};

module.exports = { saveFileMeta, getUserStorageUsed, getFileById };
