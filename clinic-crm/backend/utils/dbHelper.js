const pool = require('../config/db');

const query = (sql, params = []) => pool.query(sql, params);

module.exports = { query };
