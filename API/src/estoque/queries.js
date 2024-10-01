const getEstoques = 'SELECT * FROM estoque';
const getEstoqueByArmazemId = 'SELECT * FROM estoque WHERE id_armazem = $1';
const getEstoqueByItemId = 'SELECT * FROM estoque WHERE id_item = $1';
const insertEstoque = 'INSERT INTO estoque(id_armazem, id_item, quantidade) VALUES ($1, $2, $3)';
const updateEstoque = 'UPDATE estoque SET quantidade = $3 WHERE id_armazem = $1 AND id_item = $2';
const deleteEstoque = 'DELETE FROM estoque WHERE id_armazem = $1 AND id_item = $2';

module.exports = {
  getEstoques,
  getEstoqueByArmazemId,
  getEstoqueByItemId,
  insertEstoque,
  updateEstoque,
  deleteEstoque,
};