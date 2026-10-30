const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name
      FROM billing b
      JOIN patients p ON b.patient_id = p.id
      ORDER BY b.billing_date DESC
    `);
    res.json({ billing: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, p.first_name AS patient_first_name, p.last_name AS patient_last_name
      FROM billing b
      JOIN patients p ON b.patient_id = p.id
      WHERE b.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Billing record not found.' });
    }
    res.json({ billing: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const create = async (req, res) => {
  try {
    const { patient_id, appointment_id, amount, status, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO billing (patient_id, appointment_id, amount, status, description) VALUES (?, ?, ?, ?, ?)',
      [patient_id, appointment_id, amount, status || 'pending', description]
    );
    res.status(201).json({ message: 'Billing record created successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const update = async (req, res) => {
  try {
    const { amount, status, description } = req.body;
    const [result] = await pool.query(
      'UPDATE billing SET amount = ?, status = ?, description = ? WHERE id = ?',
      [amount, status, description, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Billing record not found.' });
    }
    res.json({ message: 'Billing record updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM billing WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Billing record not found.' });
    }
    res.json({ message: 'Billing record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
