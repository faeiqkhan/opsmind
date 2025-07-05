const express = require('express');
const router = express.Router();
const { uploadFile, serveFile } = require('./fileops.controller');
const multer = require('./multer.config');
const auth = (req, res, next) => { req.user = { id: 'testuser' }; next(); };
//const auth = require('../../middlewares/auth'); // fake or real
router.post('/upload',auth,multer.single('file'), uploadFile);
router.get('/:id', auth, serveFile);

module.exports = router;
