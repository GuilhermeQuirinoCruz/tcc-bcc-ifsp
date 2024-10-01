const getClientes = 'SELECT * FROM cliente';
const getClienteById = 'SELECT * FROM cliente WHERE id = $1';
const insertCliente = 'INSERT INTO cliente(id_setor, nome, cnpj, telefone, cep, data_registro, saldo) VALUES ($1, $2, $3, $4, $5, $6, 0)';
const updateCliente = 'UPDATE cliente SET id_setor = $2, nome = $3, cnpj = $4, telefone = $5, cep = $6 WHERE id = $1';
const deleteCliente = 'DELETE FROM cliente WHERE id = $1';

module.exports = {
  getClientes,
  getClienteById,
  insertCliente,
  updateCliente,
  deleteCliente,
};