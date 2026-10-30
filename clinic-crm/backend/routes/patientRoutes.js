const express = require('express');
const router = express.Router();
const {
  getAll, getById, create, update, remove
} = require('../controllers/patientController');
const { authenticateToken } = require('../middleware/auth');
const { patientValidation, idParam } = require('../middleware/validate');

router.get('/', authenticateToken, getAll);
router.get('/:id', authenticateToken, idParam, getById);
router.post('/', authenticateToken, patientValidation, create);
router.put('/:id', authenticateToken, idParam, patientValidation, update);
router.delete('/:id', authenticateToken, idParam, remove);

module.exports = router;
