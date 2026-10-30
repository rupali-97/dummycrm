const express = require('express');
const router = express.Router();
const { dashboardStats, appointmentsByStatus, billingByStatus, recentAppointments } = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

router.get('/dashboard-stats', authenticateToken, dashboardStats);
router.get('/appointments-by-status', authenticateToken, appointmentsByStatus);
router.get('/billing-by-status', authenticateToken, billingByStatus);
router.get('/recent-appointments', authenticateToken, recentAppointments);

module.exports = router;
