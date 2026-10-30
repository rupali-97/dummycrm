const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const patientValidation = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('phone').optional().trim().notEmpty().withMessage('Phone is required'),
  body('date_of_birth').optional().isISO8601().withMessage('Invalid date of birth'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  handleValidationErrors
];

const doctorValidation = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim().notEmpty().withMessage('Phone is required'),
  body('specialty').trim().notEmpty().withMessage('Specialty is required'),
  body('license_number').trim().notEmpty().withMessage('License number is required'),
  handleValidationErrors
];

const appointmentValidation = [
  body('patient_id').isInt({ min: 1 }).withMessage('Valid patient is required'),
  body('doctor_id').isInt({ min: 1 }).withMessage('Valid doctor is required'),
  body('appointment_date').isISO8601().withMessage('Valid appointment date is required'),
  body('appointment_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time (HH:MM) is required'),
  body('status').optional().isIn(['scheduled', 'completed', 'cancelled']).withMessage('Invalid status'),
  handleValidationErrors
];

const prescriptionValidation = [
  body('appointment_id').isInt({ min: 1 }).withMessage('Valid appointment is required'),
  body('patient_id').isInt({ min: 1 }).withMessage('Valid patient is required'),
  body('doctor_id').isInt({ min: 1 }).withMessage('Valid doctor is required'),
  body('medication').trim().notEmpty().withMessage('Medication is required'),
  body('dosage').optional().trim().notEmpty().withMessage('Dosage is required'),
  body('instructions').optional().trim().notEmpty().withMessage('Instructions are required'),
  handleValidationErrors
];

const billingValidation = [
  body('patient_id').isInt({ min: 1 }).withMessage('Valid patient is required'),
  body('appointment_id').optional().isInt({ min: 1 }).withMessage('Valid appointment is required'),
  body('amount').isDecimal().withMessage('Valid amount is required'),
  body('status').optional().isIn(['paid', 'pending', 'overdue']).withMessage('Invalid status'),
  body('description').optional().trim().notEmpty().withMessage('Description is required'),
  handleValidationErrors
];

const idParam = [
  param('id').isInt({ min: 1 }).withMessage('Valid ID is required'),
  handleValidationErrors
];

const authValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

module.exports = {
  patientValidation,
  doctorValidation,
  appointmentValidation,
  prescriptionValidation,
  billingValidation,
  idParam,
  authValidation,
  handleValidationErrors
};
