const express = require('express');
const router = express.Router();
const {
  getAll, getById, create, update, remove
} = require('../controllers/doctorController');
const { authenticateToken } = require('../middleware/auth');
const { doctorValidation, idParam } = require('../middleware/validate');

router.get('/', authenticateToken, getAll);
router.get('/:id', authenticateToken, idParam, getById);
router.post('/', authenticateToken, doctorValidation, create);
router.put('/:id', authenticateToken, idParam, doctorValidation, update);
router.delete('/:id', authenticateToken, idParam, remove);

module.exports = router;
