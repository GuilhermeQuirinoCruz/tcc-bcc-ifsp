const getSetores = 'SELECT * FROM setor';
const getSetorById = 'SELECT * FROM setor WHERE id = $1';
const insertSetor = 'INSERT INTO setor(id_armazem, nome, cep, taxa, saldo) VALUES ($1, $2, $3, $4, 0)';
const updateSetor = 'UPDATE setor SET nome = $2, cep = $3, taxa = $4, saldo = $5 WHERE id = $1';
const deleteSetor = 'DELETE FROM setor WHERE id = $1';

module.exports = {
  getSetores,
  getSetorById,
  insertSetor,
  updateSetor,
  deleteSetor,
};