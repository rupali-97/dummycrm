const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pr.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             d.first_name AS doctor_first_name, d.last_name AS doctor_last_name
      FROM prescriptions pr
      JOIN patients p ON pr.patient_id = p.id
      JOIN doctors d ON pr.doctor_id = d.id
      ORDER BY pr.prescribed_date DESC
    `);
    res.json({ prescriptions: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pr.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             d.first_name AS doctor_first_name, d.last_name AS doctor_last_name
      FROM prescriptions pr
      JOIN patients p ON pr.patient_id = p.id
      JOIN doctors d ON pr.doctor_id = d.id
      WHERE pr.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }
    res.json({ prescription: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const create = async (req, res) => {
  try {
    const { appointment_id, patient_id, doctor_id, medication, dosage, instructions } = req.body;
    const [result] = await pool.query(
      'INSERT INTO prescriptions (appointment_id, patient_id, doctor_id, medication, dosage, instructions) VALUES (?, ?, ?, ?, ?, ?)',
      [appointment_id, patient_id, doctor_id, medication, dosage, instructions]
    );
    res.status(201).json({ message: 'Prescription created successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const update = async (req, res) => {
  try {
    const { medication, dosage, instructions } = req.body;
    const [result] = await pool.query(
      'UPDATE prescriptions SET medication = ?, dosage = ?, instructions = ? WHERE id = ?',
      [medication, dosage, instructions, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }
    res.json({ message: 'Prescription updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM prescriptions WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }
    res.json({ message: 'Prescription deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
