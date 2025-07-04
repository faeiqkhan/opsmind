const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const auditRoutes = require('../modules/audit/audit.routes');
const userRoutes = require('./userRoutes');
const router = express.Router();
const fileRoutes = require('../modules/fileops/fileops.routes');



router.use('/auth', authRoutes);
router.use('/audit', auditRoutes);
router.use('/', userRoutes);
router.use('/logs', auditRoutes);
router.use('/files', fileRoutes);

module.exports = router;
