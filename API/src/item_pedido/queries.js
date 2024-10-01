const getItensPedido = 'SELECT * FROM item_pedido';
const getItemPedidoByItemId = 'SELECT * FROM item_pedido WHERE id_item = $1';
const getItemPedidoByPedidoId = 'SELECT * FROM item_pedido WHERE id_pedido = $1';
const insertItemPedido = 'INSERT INTO item_pedido(id_item, id_pedido, quantidade) VALUES ($1, $2, $3)';
const updateItemPedido = 'UPDATE item_pedido SET quantidade = $3 WHERE id_item = $1 AND id_pedido = $2';
const deleteItemPedido = 'DELETE FROM item_pedido WHERE id_item = $1 AND id_pedido = $2';

module.exports = {
  getItensPedido,
  getItemPedidoByItemId,
  getItemPedidoByPedidoId,
  insertItemPedido,
  updateItemPedido,
  deleteItemPedido,
};