const { client, database, getNextId } = require('../../db-config');

const novoPedido = async (req, res) => {
  const { idCliente, itens } = req.body;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const idPedido = await getNextId('pedido');

      await database.collection('armazem')
        .findOneAndUpdate(
          { 'setores.clientes._id': idCliente },
          {
            $push: {
              'setores.$[i].clientes.$[j].pedidos': {
                _id: idPedido,
                itens: itens
              }
            }
          },
          {
            arrayFilters: [
              { 'i.clientes._id': idCliente },
              { 'j._id': idCliente }
            ]
          }
        );

      res.status(201).json(req.body);
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
};

const pagamento = async (req, res) => {
  const { cnpj, valor } = req.body;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const idPagamento = await getNextId('pagamento');

      await database.collection('armazem')
        .findOneAndUpdate(
          { 'setores.clientes.cnpj': cnpj },
          {
            $push: {
              'setores.$[i].clientes.$[j].pagamentos': {
                idPagamento: idPagamento,
                valor: valor
              }
            }
          },
          {
            arrayFilters: [
              { 'i.clientes.cnpj': cnpj },
              { 'j.cnpj': cnpj }
            ]
          }
        );

      res.status(201).json(req.body);
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
}

const nivelEstoque = async (req, res) => {
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {

      res.status(200).json(req.body);
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
}

const entrega = async (req, res) => {
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {

      res.status(200).json(req.body);
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
}

const pedidoEntregue = async (req, res) => {
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {

      res.status(200).json(req.body);
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = {
  novoPedido,
  pagamento,
  nivelEstoque,
  entrega,
  pedidoEntregue
};