// Novo pedido
const getIdSetorByIdCliente = `SELECT setor.id FROM setor
JOIN cliente ON cliente.id_setor = setor.id
WHERE cliente.id = $1`;

const getIdArmazemByIdSetor = `SELECT armazem.id FROM armazem
JOIN setor ON setor.id_armazem = armazem.id
WHERE setor.id = $1`;

const getTaxa = `SELECT (armazem.taxa + setor.taxa) AS taxa FROM armazem
JOIN setor ON setor.id_armazem = armazem.id
WHERE armazem.id = $1 AND setor.id = $2`;

const insertPedido = `INSERT INTO pedido(id_cliente, data, entregue)
VALUES ($1, $2, false)
RETURNING id`;

const insertItemPedido = `INSERT INTO item_pedido(id_item, id_pedido, quantidade)
VALUES ($1, $2, $3)`;

const getPrecoItem = `SELECT preco_unitario AS "precoUnitario" FROM item
WHERE id = $1`;

const updateSaldoSetor = `UPDATE setor SET saldo = saldo + $2
WHERE id = $1`;

const updateSaldoCliente = `UPDATE cliente SET saldo = saldo + $2
WHERE id = $1`;

// Nível estoque
const getQtdItensPedidosNaoEntregues = `SELECT item_pedido.id_item AS "idItem", SUM(item_pedido.quantidade) AS quantidade FROM item_pedido
JOIN pedido ON pedido.id = item_pedido.id_pedido
JOIN cliente ON cliente.id = pedido.id_cliente
JOIN setor ON setor.id = cliente.id_setor
JOIN armazem ON armazem.id = setor.id_armazem
WHERE armazem.id = $1 AND setor.id = $2 AND pedido.entregue = false
GROUP BY item_pedido.id_item`;

const getQtdEstoque = `SELECT quantidade FROM estoque
WHERE id_armazem = $1 AND id_item = $2`;

// Nível estoque
const getIdArmazemByIdPedido = `SELECT armazem.id FROM pedido
JOIN cliente ON cliente.id = pedido.id_cliente
JOIN setor ON setor.id = cliente.id_setor
JOIN armazem ON armazem.id = setor.id_armazem
WHERE pedido.id = $1`;

const getItensPedido = `SELECT item_pedido.id_item AS "idItem", item_pedido.quantidade FROM item_pedido
JOIN pedido ON pedido.id = item_pedido.id_pedido
WHERE pedido.id = $1`;

const getNivelEstoque = `SELECT estoque.quantidade FROM item
JOIN estoque ON item.id = estoque.id_item
JOIN armazem ON armazem.id = estoque.id_armazem
WHERE armazem.id = $1 AND item.id = $2;`;

const updateEstoque = `UPDATE estoque SET quantidade = quantidade + $3
WHERE id_armazem = $1 AND id_item = $2`;

const updatePedido = `UPDATE pedido SET entregue = true
WHERE id = $1`;

// Pagamento
const getClienteIdByCnpj = `SELECT id FROM cliente
WHERE cnpj = $1`;

const insertPagamento = `INSERT INTO pagamento(id_cliente, data, valor)
VALUES ($1, $2, $3)`;

// Pedido Entregue
const getPedidoEntregue = `SELECT entregue FROM pedido
WHERE id_cliente = $1
ORDER BY data DESC
LIMIT 1`;

module.exports = {
  getIdSetorByIdCliente,
  getIdArmazemByIdSetor,
  getTaxa,
  insertPedido,
  insertItemPedido,
  getPrecoItem,
  updateSaldoSetor,
  updateSaldoCliente,
  getQtdItensPedidosNaoEntregues,
  getQtdEstoque,
  getIdArmazemByIdPedido,
  getItensPedido,
  getNivelEstoque,
  updateEstoque,
  updatePedido,
  getClienteIdByCnpj,
  insertPagamento,
  getPedidoEntregue,
};