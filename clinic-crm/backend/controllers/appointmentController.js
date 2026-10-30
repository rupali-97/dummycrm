const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             d.first_name AS doctor_first_name, d.last_name AS doctor_last_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC, a.appointment_time
    `);
    res.json({ appointments: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             d.first_name AS doctor_first_name, d.last_name AS doctor_last_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    res.json({ appointment: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const create = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, status, reason } = req.body;
    const [result] = await pool.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status, reason) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time, status || 'scheduled', reason]
    );
    res.status(201).json({ message: 'Appointment created successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const update = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, status, reason } = req.body;
    const [result] = await pool.query(
      'UPDATE appointments SET patient_id = ?, doctor_id = ?, appointment_date = ?, appointment_time = ?, status = ?, reason = ? WHERE id = ?',
      [patient_id, doctor_id, appointment_date, appointment_time, status, reason, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    res.json({ message: 'Appointment updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
