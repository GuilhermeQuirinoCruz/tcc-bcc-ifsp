const { client, database, getNextId } = require('../../db-config');

const getClientes = async (req, res) => {
  try {
    const clientes = await database.collection('armazem')
      .aggregate([
        { $unwind: '$setor' },
        { $unwind: '$setor.cliente' },
        {
          $project: {
            _id: '$setor.cliente._id',
            nome: '$setor.cliente.nome',
            cnpj: '$setor.cliente.cnpj',
            telefone: '$setor.cliente.telefone',
            cep: '$setor.cliente.cep'
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
          { $match: { 'setor.cliente._id': idCliente } },
          { $unwind: '$setor' },
          { $unwind: '$setor.cliente' },
          { $match: { 'setor.cliente._id': idCliente } },
          {
            $project: {
              _id: '$setor.cliente._id',
              nome: '$setor.cliente.nome',
              cnpj: '$setor.cliente.cnpj',
              telefone: '$setor.cliente.telefone',
              cep: '$setor.cliente.cep'
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
          { 'setor._id': idSetor },
          { projection: { _id: 1 } }
        );

      await database.collection('armazem')
        .updateOne(
          {
            _id: armazem._id,
            'setor._id': idSetor
          },
          {
            $push: {
              'setor.$.cliente': {
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
          { $match: { 'setor.cliente._id': idCliente } },
          { $unwind: '$setor' },
          { $match: { 'setor.cliente._id': idCliente } },
          {
            $project: {
              idSetor: '$setor._id',
            }
          }
        ]
      )
      .next();

    await database.collection('armazem')
      .updateOne(
        {
          _id: armazem._id,
          'setor._id': armazem.idSetor,
          'setor.cliente._id': idCliente
        },
        {
          $set: {
            'setor.$.cliente.$.nome': nome,
            'setor.$.cliente.$.cnpj': cnpj,
            'setor.$.cliente.$.telefone': telefone,
            'setor.$.cliente.$.cep': cep,
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
          { $match: { 'setor.cliente._id': idCliente } },
          { $unwind: '$setor' },
          { $match: { 'setor.cliente._id': idCliente } },
          {
            $project: {
              idSetor: '$setor._id',
            }
          }
        ]
      )
      .next();

    await database.collection('armazem')
      .updateOne(
        {
          _id: armazem._id,
          'setor._id': armazem.idSetor
        },
        {
          $pull: { setor: { cliente: { $elemMatch: { _id: idCliente } } } }
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