const pool = require('../../db-config');
const queries = require('./queries');

const novoPedido = async (req, res) => {
  const client = await pool.connect();

  const { idCliente, itens } = req.body;

  try {
    await client.query('BEGIN');

    let results = await client.query(queries.getIdSetorByIdCliente,
      [idCliente]
    );

    const idSetor = results.rows[0].id;

    results = await client.query(queries.getIdArmazemByIdSetor,
      [idSetor]
    );

    const idArmazem = results.rows[0].id;

    results = await client.query(queries.insertPedido,
      [idCliente, new Date()]
    );

    const idPedido = results.rows[0].id;

    results = await client.query(queries.getTaxa,
      [idArmazem, idSetor]
    );

    const taxa = 1 + parseFloat(results.rows[0].taxa);
    let totalPedido = 0;

    for (const item of itens) {
      await client.query(queries.insertItemPedido,
        [item.id, idPedido, item.quantidade]
      );

      results = await client.query(queries.getPrecoItem,
        [item.id]
      );

      const precoUnitario = parseFloat(results.rows[0].precoUnitario);
      totalPedido += precoUnitario * item.quantidade;
    }

    totalPedido *= taxa;

    await client.query(queries.updateSaldoSetor,
      [idSetor, totalPedido]
    );

    await client.query(queries.updateSaldoCliente,
      [idCliente, -totalPedido]
    );

    await client.query('COMMIT');

    res.status(200).json('Pedido criado com sucesso');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const pagamento = async (req, res) => {
  const client = await pool.connect();

  const { cnpj, valor } = req.body;

  try {
    await client.query('BEGIN');

    const results = await client.query(queries.getClienteIdByCnpj,
      [cnpj]
    );

    const idCliente = parseInt(results.rows[0].id);

    await client.query(queries.insertPagamento,
      [idCliente, new Date(), valor]
    );

    await client.query(queries.updateSaldoCliente,
      [idCliente, valor]
    );

    await client.query('COMMIT');

    res.status(200).json('Pagamento realizado com sucesso');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const pedidoEntregue = async (req, res) => {
  const client = await pool.connect();

  const { cnpj } = req.body;

  try {
    await client.query('BEGIN');

    let results = await client.query(queries.getClienteIdByCnpj,
      [cnpj]
    );

    const idCliente = parseInt(results.rows[0].id);

    results = await client.query(queries.getPedidoEntregue,
      [idCliente]
    );

    await client.query('COMMIT');

    res.status(200).json(results.rows);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const entrega = async (req, res) => {
  const client = await pool.connect();

  const idPedido = parseInt(req.params.id);

  try {
    await client.query('BEGIN');

    let results = await client.query(queries.getIdArmazemByIdPedido,
      [idPedido]
    );

    const idArmazem = results.rows[0].id;

    results = await client.query(queries.getItensPedido,
      [idPedido]
    );

    const itens = results.rows;

    let estoqueSuficiente = true;

    for (const item of itens) {
      results = await client.query(queries.getNivelEstoque,
        [idArmazem, item.idItem]
      );

      const quantidadeEstoque = results.rows[0].quantidade;
      if (quantidadeEstoque < item.quantidade) {
        estoqueSuficiente = false;
        break;
      }

      await client.query(queries.updateEstoque,
        [idArmazem, item.idItem, -item.quantidade]
      );
    }

    if (!estoqueSuficiente) {
      await client.query('ROLLBACK');
      res.status(200).json('Quantidade insuficiente');
    } else {
      await client.query(queries.updatePedido,
        [idPedido]
      );

      await client.query('COMMIT');

      res.status(200).json('Pedido entregue');
    }

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const nivelEstoque = async (req, res) => {
  const client = await pool.connect();

  const { idSetor } = req.body;

  try {
    await client.query('BEGIN');

    let results = await client.query(queries.getIdArmazemByIdSetor,
      [idSetor]
    );

    const idArmazem = results.rows[0].id;

    results = await client.query(queries.getQtdItensPedidosNaoEntregues,
      [idArmazem, idSetor]
    );

    const itensPedidosNaoEntregues = results.rows;

    let itensEmFalta = [];
    for (item of itensPedidosNaoEntregues) {
      results = await client.query(queries.getQtdEstoque,
        [idArmazem, item.idItem]
      );

      const qtdEstoque = parseInt(results.rows[0].quantidade);

      if (qtdEstoque < item.quantidade) {
        itensEmFalta.push({
          idItem: item.idItem,
          quantidade: item.quantidade - qtdEstoque
        });
      }
    }

    await client.query('COMMIT');

    res.status(200).json(itensEmFalta);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  novoPedido,
  pagamento,
  pedidoEntregue,
  entrega,
  nivelEstoque,
};