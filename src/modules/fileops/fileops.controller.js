const path = require('path');
const { saveFileMeta, getUserStorageUsed, getFileById } = require('./file.model');

const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const userId = req.user?.id || 'guest';
  const fileSize = req.file.size;

  const used = await getUserStorageUsed(userId);
  const quota = 100 * 1024 * 1024; // 100MB

  if (used + fileSize > quota) {
    return res.status(403).json({ error: 'Storage quota exceeded' });
  }

  await saveFileMeta({
    filename: req.file.filename,
    size: fileSize,
    userId,
    access: req.body.access || 'private'
  });

  res.json({ success: true, file: req.file.filename });
};

const serveFile = async (req, res) => {
  const file = await getFileById(req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });

  const userId = req.user?.id || 'guest';
  if (file.access !== 'public' && file.user_id !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const filePath = path.join(__dirname, '../../../uploads', file.filename);
  res.sendFile(filePath);
};

module.exports = { uploadFile, serveFile };
