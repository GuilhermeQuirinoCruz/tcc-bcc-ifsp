const { client, database, getNextId } = require('../../db-config');

const getSetores = async (req, res) => {
  try {
    const setores = await database.collection('armazem')
      .aggregate(
        [
          { $unwind: '$setor' },
          {
            $project: {
              _id: '$setor._id',
              nome: '$setor.nome',
              cep: '$setor.cep',
              taxa: '$setor.taxa',
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
          { $match: { 'setor._id': idSetor } },
          { $unwind: '$setor' },
          { $match: { 'setor._id': idSetor } },
          {
            $project: {
              _id: '$setor._id',
              nome: '$setor.nome',
              cep: '$setor.cep',
              taxa: '$setor.taxa'
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
              setor: {
                _id: id,
                nome: nome,
                cep: cep,
                taxa: taxa,
                cliente: []
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
          $set: {
            'setor.$.nome': nome,
            'setor.$.cep': cep,
            'setor.$.taxa': taxa
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
        { 'setor._id': idSetor },
        { projection: { _id: 1 } }
      );

    await database.collection('armazem')
      .updateOne(
        { _id: armazem._id },
        { $pull: { setor: { _id: idSetor } } }
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