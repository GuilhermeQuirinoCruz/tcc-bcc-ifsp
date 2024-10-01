const getArmazens = 'SELECT * FROM armazem';
const getArmazemById = 'SELECT * FROM armazem WHERE id = $1';
const insertArmazem = 'INSERT INTO armazem(nome, cep, taxa) VALUES ($1, $2, $3)';
const updateArmazem = 'UPDATE armazem SET nome = $2, cep = $3, taxa = $7 WHERE id = $1';
const deleteArmazem = 'DELETE FROM armazem WHERE id = $1';

module.exports = {
  getArmazens,
  getArmazemById,
  insertArmazem,
  updateArmazem,
  deleteArmazem,
};