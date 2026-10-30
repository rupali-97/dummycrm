const pool = require('../config/db');

const dashboardStats = async (req, res) => {
  try {
    const [
      [patientResult],
      [doctorResult],
      [appointmentResult],
      [billingResult],
      [todayAppointments]
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) AS total FROM patients'),
      pool.query('SELECT COUNT(*) AS total FROM doctors'),
      pool.query("SELECT COUNT(*) AS total FROM appointments WHERE status = 'scheduled'"),
      pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM billing WHERE status = 'paid'"),
      pool.query("SELECT COUNT(*) AS total FROM appointments WHERE appointment_date = CURDATE()")
    ]);

    res.json({
      totalPatients: patientResult[0].total,
      totalDoctors: doctorResult[0].total,
      scheduledAppointments: appointmentResult[0].total,
      totalRevenue: parseFloat(billingResult[0].total),
      todayAppointments: todayAppointments[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const appointmentsByStatus = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT status, COUNT(*) AS count FROM appointments GROUP BY status
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const billingByStatus = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT status, COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total FROM billing GROUP BY status
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const recentAppointments = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.id, a.appointment_date, a.appointment_time, a.status,
             CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
             CONCAT(d.first_name, ' ', d.last_name) AS doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
      LIMIT 10
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { dashboardStats, appointmentsByStatus, billingByStatus, recentAppointments };
