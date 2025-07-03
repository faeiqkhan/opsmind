const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const auditRoutes = require('../modules/audit/audit.routes');
const userRoutes = require('./userRoutes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/audit', auditRoutes);
router.use('/', userRoutes);
router.use('/logs', auditRoutes);

module.exports = router;
