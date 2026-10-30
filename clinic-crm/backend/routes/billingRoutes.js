const express = require('express');
const router = express.Router();
const {
  getAll, getById, create, update, remove
} = require('../controllers/billingController');
const { authenticateToken } = require('../middleware/auth');
const { billingValidation, idParam } = require('../middleware/validate');

router.get('/', authenticateToken, getAll);
router.get('/:id', authenticateToken, idParam, getById);
router.post('/', authenticateToken, billingValidation, create);
router.put('/:id', authenticateToken, idParam, billingValidation, update);
router.delete('/:id', authenticateToken, idParam, remove);

module.exports = router;
