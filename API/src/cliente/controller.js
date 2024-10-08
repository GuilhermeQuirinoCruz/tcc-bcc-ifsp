const { client, database, getNextId } = require('../../db-config');

const getClientes = async (req, res) => {
  try {
    const clientes = await database.collection('armazem')
      .aggregate([
        { $unwind: '$setores' },
        { $unwind: '$setores.clientes' },
        {
          $project: {
            _id: '$setores.clientes._id',
            nome: '$setores.clientes.nome',
            cnpj: '$setores.clientes.cnpj',
            telefone: '$setores.clientes.telefone',
            cep: '$setores.clientes.cep',

            pedidos: '$setores.clientes.pedidos',
            pagamentos: '$setores.clientes.pagamentos'
          }
        }
      ])
      .toArray();

    res.status(200).json(clientes);
  } catch (error) {
    throw error;
  }
};

const getClienteById = async (req, res) => {
  const idCliente = parseInt(req.params.id);

  try {
    const cliente = await database.collection('armazem')
      .aggregate(
        [
          { $match: { 'setores.clientes._id': idCliente } },
          { $unwind: '$setores' },
          { $unwind: '$setores.clientes' },
          { $match: { 'setores.clientes._id': idCliente } },
          {
            $project: {
              _id: '$setores.clientes._id',
              nome: '$setores.clientes.nome',
              cnpj: '$setores.clientes.cnpj',
              telefone: '$setores.clientes.telefone',
              cep: '$setores.clientes.cep'
            }
          }
        ]
      )
      .next();

    res.status(200).json(cliente);
  } catch (error) {
    throw error;
  }
};

const insertCliente = async (req, res) => {
  const { idSetor, nome, cnpj, telefone, cep } = req.body;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const idCliente = await getNextId('cliente');

      const armazem = await database.collection('armazem')
        .findOne(
          { 'setores._id': idSetor },
          { projection: { _id: 1 } }
        );

      await database.collection('armazem')
        .updateOne(
          {
            _id: armazem._id,
            'setores._id': idSetor
          },
          {
            $push: {
              'setores.$.clientes': {
                _id: idCliente,
                nome: nome,
                cnpj: cnpj,
                telefone: telefone,
                cep: cep,
                pedidos: [],
                pagamentos: []
              }
            }
          });

      res.status(201).json(req.body);
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
};

const updateCliente = async (req, res) => {
  const idCliente = parseInt(req.params.id);
  const { nome, cnpj, telefone, cep } = req.body;

  try {
    const armazem = await database.collection('armazem')
      .aggregate(
        [
          { $match: { 'setores.clientes._id': idCliente } },
          { $unwind: '$setores' },
          { $match: { 'setores.clientes._id': idCliente } },
          {
            $project: {
              idSetor: '$setores._id',
            }
          }
        ]
      )
      .next();

    await database.collection('armazem')
      .updateOne(
        {
          _id: armazem._id,
          'setores._id': armazem.idSetor,
          'setores.clientes._id': idCliente
        },
        {
          $set: {
            'setores.$.clientes.$.nome': nome,
            'setores.$.clientes.$.cnpj': cnpj,
            'setores.$.clientes.$.telefone': telefone,
            'setores.$.clientes.$.cep': cep,
          }
        }
      );

    res.status(200).json(req.body);
  } catch (error) {
    throw error;
  }
};

const deleteCliente = async (req, res) => {
  const idCliente = parseInt(req.params.id);

  try {
    const armazem = await database.collection('armazem')
      .aggregate(
        [
          { $match: { 'setores.clientes._id': idCliente } },
          { $unwind: '$setores' },
          { $match: { 'setores.clientes._id': idCliente } },
          {
            $project: {
              idSetor: '$setores._id',
            }
          }
        ]
      )
      .next();

    await database.collection('armazem')
      .updateOne(
        {
          _id: armazem._id,
          'setores._id': armazem.idSetor
        },
        {
          $pull: { setores: { clientes: { $elemMatch: { _id: idCliente } } } }
        });

    res.status(200).json({ id: idCliente });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getClientes,
  getClienteById,
  insertCliente,
  updateCliente,
  deleteCliente,
};