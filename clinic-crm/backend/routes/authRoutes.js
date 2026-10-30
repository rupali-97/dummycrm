const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authValidation } = require('../middleware/validate');

router.post('/register', authValidation, register);
router.post('/login', authValidation, login);
router.get('/me', authenticateToken, me);

module.exports = router;
