const Pool = require('pg').Pool;

const pool = new Pool ({
  host: 'localhost',
  user: 'root',
  password: 'senha',
  database: 'tcc',
  port: 5432
});

module.exports = pool;