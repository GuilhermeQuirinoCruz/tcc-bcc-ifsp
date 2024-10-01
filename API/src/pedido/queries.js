const getPedidos = 'SELECT * FROM pedido';
const getPedidoById = 'SELECT * FROM pedido WHERE id = $1';
const insertPedido = 'INSERT INTO pedido(id_cliente, data, entregue) VALUES ($1, $2, false)';
const updatePedido = 'UPDATE pedido entregue = $2 WHERE id = $1';
const deletePedido = 'DELETE FROM pedido WHERE id = $1';

module.exports = {
  getPedidos,
  getPedidoById,
  insertPedido,
  updatePedido,
  deletePedido,
};