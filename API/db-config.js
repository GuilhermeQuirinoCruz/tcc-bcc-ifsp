const Pool = require('pg').Pool;

const pool = new Pool ({
  host: 'db-postgres',
  user: 'root',
  password: 'senha',
  database: 'tpc',
  port: 5432
});

module.exports = pool;