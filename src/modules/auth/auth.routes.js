const express = require('express');
const { login, register } = require('./auth.controller');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);

module.exports = router; 