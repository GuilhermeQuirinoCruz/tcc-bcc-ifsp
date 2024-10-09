const { client, database, getNextId } = require('../../db-config');

const getSetores = async (req, res) => {
  try {
    const setores = await database.collection('armazem')
      .aggregate(
        [
          { $unwind: '$setores' },
          {
            $project: {
              _id: '$setores._id',
              nome: '$setores.nome',
              cep: '$setores.cep',
              taxa: '$setores.taxa',
              saldo: '$setores.saldo'
            }
          }
        ]
      )
      .toArray();

    res.status(200).json(setores);
  } catch (error) {
    throw error;
  }
};

const getSetorById = async (req, res) => {
  const idSetor = parseInt(req.params.id);

  try {
    const setor = await database.collection('armazem')
      .aggregate(
        [
          { $match: { 'setores._id': idSetor } },
          { $unwind: '$setores' },
          { $match: { 'setores._id': idSetor } },
          {
            $project: {
              _id: '$setores._id',
              nome: '$setores.nome',
              cep: '$setores.cep',
              taxa: '$setores.taxa',
              saldo: '$setores.saldo'
            }
          }
        ]
      )
      .next();

    res.status(200).json(setor);
  } catch (error) {
    throw error;
  }
};

const insertSetor = async (req, res) => {
  const { idArmazem, nome, cep, taxa } = req.body;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const id = await getNextId('setor');

      await database.collection('armazem')
        .updateOne(
          { _id: idArmazem },
          {
            $push: {
              setores: {
                _id: id,
                nome: nome,
                cep: cep,
                taxa: taxa,
                saldo: 0.0,
                clientes: []
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

const updateSetor = async (req, res) => {
  const idSetor = parseInt(req.params.id);
  const { nome, cep, taxa } = req.body;

  try {
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
          $set: {
            'setores.$.nome': nome,
            'setores.$.cep': cep,
            'setores.$.taxa': taxa,
            'setores.$.saldo': saldo
          }
        }
      );

    res.status(200).json(req.body);
  } catch (error) {
    throw error;
  }
};

const deleteSetor = async (req, res) => {
  const idSetor = parseInt(req.params.id);

  try {
    const armazem = await database.collection('armazem')
      .findOne(
        { 'setores._id': idSetor },
        { projection: { _id: 1 } }
      );

    await database.collection('armazem')
      .updateOne(
        { _id: armazem._id },
        { $pull: { setores: { _id: idSetor } } }
      );

    res.status(200).json({ id: idSetor });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSetores,
  getSetorById,
  insertSetor,
  updateSetor,
  deleteSetor,
};