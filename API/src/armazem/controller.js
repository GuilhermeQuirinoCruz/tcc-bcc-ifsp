const { client, database, getNextId } = require('../../db-config');

const getArmazens = async (req, res) => {
  try {
    const armazens = await database.collection('armazem')
      .find({})
      .project({ setor: 0 })
      .toArray();

    res.status(200).json(armazens);
  } catch (error) {
    throw error;
  }
};

const getArmazemById = async (req, res) => {
  try {
    const armazem = await database.collection('armazem')
      .findOne({
        _id: { $eq: parseInt(req.params.id) }
      },
        {
          projection: {
            setor: 0
          }
        });

    res.status(200).json(armazem);
  } catch (error) {
    throw error;
  }
};

const insertArmazem = async (req, res) => {
  const { nome, cep, taxa } = req.body;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const id = await getNextId('armazem');

      await database.collection('armazem')
        .insertOne({
          _id: id,
          nome: nome,
          cep: cep,
          taxa: taxa,
          setor: []
        });

      res.status(201).json(req.body);
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
};

const updateArmazem = async (req, res) => {
  const { nome, cep, taxa } = req.body;

  try {
    await database.collection('armazem')
      .updateOne(
        { _id: parseInt(req.params.id) },
        {
          $set: {
            nome: nome,
            cep: cep,
            taxa: taxa
          }
        }
      );

    res.status(200).json(req.body);
  } catch (error) {
    throw error;
  }
};

const deleteArmazem = async (req, res) => {
  try {
    await database.collection('armazem')
      .deleteOne({
        _id: parseInt(req.params.id)
      });

    res.status(200).json({ _id: id });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getArmazens,
  getArmazemById,
  insertArmazem,
  updateArmazem,
  deleteArmazem,
};