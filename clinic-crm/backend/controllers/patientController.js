const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients ORDER BY last_name, first_name');
    res.json({ patients: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM patients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    res.json({ patient: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const create = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, date_of_birth, gender, address } = req.body;
    const [result] = await pool.query(
      'INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, phone, date_of_birth, gender, address]
    );
    res.status(201).json({ message: 'Patient created successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const update = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, date_of_birth, gender, address } = req.body;
    const [result] = await pool.query(
      'UPDATE patients SET first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?',
      [first_name, last_name, email, phone, date_of_birth, gender, address, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM patients WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found.' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = { getAll, getById, create, update, remove };
