const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM doctors ORDER BY last_name, first_name');
    res.json({ doctors: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }
    res.json({ doctor: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const create = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, specialty, license_number } = req.body;
    const [result] = await pool.query(
      'INSERT INTO doctors (first_name, last_name, email, phone, specialty, license_number) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, specialty, license_number]
    );
    res.status(201).json({ message: 'Doctor created successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const update = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, specialty, license_number } = req.body;
    const [result] = await pool.query(
      'UPDATE doctors SET first_name = ?, last_name = ?, email = ?, phone = ?, specialty = ?, license_number = ? WHERE id = ?',
      [first_name, last_name, email, phone, specialty, license_number, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }
    res.json({ message: 'Doctor updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM doctors WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
