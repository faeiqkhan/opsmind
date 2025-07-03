const express = require('express');
const { loginUser, registerUser } = require('../controllers/userController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/users', (req, res) => {
    res.json({ message: 'User route working' });
  });

module.exports = router; 