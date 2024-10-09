const { client, database, getNextId } = require('../../db-config');

const novoPedido = async (req, res) => {
  const { idCliente, itens } = req.body;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      let totalPedido = 0;
      for (const item of itens) {
        const precoUnitario = (await database.collection('item')
          .findOne(
            {
              _id: item.id
            },
            {
              projection: {
                _id: 0,
                precoUnitario: 1
              }
            }
          )).precoUnitario;

        totalPedido += precoUnitario * item.quantidade;
      }

      const taxa = (await database.collection('armazem')
        .aggregate(
          [
            { $match: { 'setores.clientes._id': idCliente } },
            { $unwind: '$setores' },
            { $unwind: '$setores.clientes' },
            { $match: { 'setores.clientes._id': idCliente } },
            {
              $project: {
                _id: 0,
                taxa: {
                  $add: ['$taxa', '$setores.taxa']
                }
              }
            }
          ]
        )
        .next()).taxa;

      totalPedido *= taxa;

      const idPedido = await getNextId('pedido');

      await database.collection('armazem')
        .findOneAndUpdate(
          { 'setores.clientes._id': idCliente },
          {
            $push: {
              'setores.$[i].clientes.$[j].pedidos': {
                _id: idPedido,
                data: new Date(),
                entregue: false,
                itens: itens
              }
            },
            $inc: {
              'setores.$[i].clientes.$[j].saldo': -totalPedido
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
                _id: idPagamento,
                data: new Date(),
                valor: valor
              }
            },
            $inc: {
              'setores.$[i].clientes.$[j].saldo': valor,
              'setores.$[i].saldo': valor
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
  const { idPedido } = req.body;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const pedido = await database.collection('armazem')
        .aggregate(
          [
            { $match: { 'setores.clientes.pedidos._id': idPedido } },
            { $unwind: '$setores' },
            { $unwind: '$setores.clientes' },
            { $unwind: '$setores.clientes.pedidos' },
            { $match: { 'setores.clientes.pedidos._id': idPedido } },
            {
              $project: {
                _id: 0,
                idArmazem: '$_id',
                idCliente: '$setores.clientes._id',
                itens: '$setores.clientes.pedidos.itens'
              }
            }
          ]
        )
        .next();

      let estoqueSuficiente = true;
      for (item of pedido.itens) {
        const qtdEstoque = (await database.collection('armazem')
          .aggregate(
            [
              { $match: { 'estoque.idItem': item.id } },
              { $unwind: '$estoque' },
              { $match: { 'estoque.idItem': item.id } },
              {
                $project: {
                  _id: 0,
                  quantidade: '$estoque.quantidade'
                }
              }
            ]
          )
          .next()).quantidade;

        if (qtdEstoque < item.quantidade) {
          estoqueSuficiente = false;
          break;
        }
      }

      if (!estoqueSuficiente) {
        res.status(200).json('Estoque insuficiente');
      } else {
        for (item of pedido.itens) {
          await database.collection('armazem')
            .updateOne(
              { '_id': pedido.idArmazem },
              {
                $inc: {
                  'estoque.$[i].quantidade': -item.quantidade
                }
              },
              {
                arrayFilters: [
                  { 'i.idItem': item.id }
                ]
              }
            );
        }

        await database.collection('armazem')
          .updateOne(
            { '_id': pedido.idArmazem },
            {
              $set: {
                'setores.$[i].clientes.$[j].pedidos.$[k].entregue': true
              }
            },
            {
              arrayFilters: [
                { 'i.clientes._id': pedido.idCliente },
                { 'j._id': pedido.idCliente },
                { 'k._id': idPedido }
              ]
            }
          );

        res.status(200).json(req.body);
      }
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
}

const pedidoEntregue = async (req, res) => {
  const { cnpj } = req.body;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {

      const pedido = await database.collection('armazem')
        .aggregate(
          [
            { $match: { 'setores.clientes.cnpj': cnpj } },
            { $unwind: '$setores' },
            { $unwind: '$setores.clientes' },
            { $match: { 'setores.clientes.cnpj': cnpj } },
            { $unwind: '$setores.clientes.pedidos' },
            { $sort: { 'setores.clientes.pedidos._id': -1 } },
            {
              $project: {
                _id: 0,
                entregue: '$setores.clientes.pedidos.entregue'
              }
            }
          ]
        )
        .next();

      res.status(200).json({ entregue: pedido.entregue });
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