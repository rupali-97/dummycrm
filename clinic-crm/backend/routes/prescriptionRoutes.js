const express = require('express');
const router = express.Router();
const {
  getAll, getById, create, update, remove
} = require('../controllers/prescriptionController');
const { authenticateToken } = require('../middleware/auth');
const { prescriptionValidation, idParam } = require('../middleware/validate');

router.get('/', authenticateToken, getAll);
router.get('/:id', authenticateToken, idParam, getById);
router.post('/', authenticateToken, prescriptionValidation, create);
router.put('/:id', authenticateToken, idParam, prescriptionValidation, update);
router.delete('/:id', authenticateToken, idParam, remove);

module.exports = router;
