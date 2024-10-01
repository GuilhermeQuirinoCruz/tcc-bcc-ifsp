const getItens = 'SELECT * FROM item';
const getItemById = 'SELECT * FROM item WHERE id = $1';
const insertItem = 'INSERT INTO item(nome, preco_unitario) VALUES ($1, $2)';
const updateItem = 'UPDATE item SET nome = $2, preco_unitario = $3 WHERE id = $1';
const deleteItem = 'DELETE FROM item WHERE id = $1';

module.exports = {
  getItens,
  getItemById,
  insertItem,
  updateItem,
  deleteItem,
};