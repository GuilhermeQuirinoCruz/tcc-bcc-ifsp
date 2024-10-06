const { client, database, getNextId } = require('../../db-config');

const getItens = async (req, res) => {
  try {
    const itens = await database.collection('item')
      .find({})
      .toArray();

    res.status(200).json(itens);
  } catch (error) {
    throw error;
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await database.collection('item')
      .findOne({
        _id: parseInt(req.params.id)
      });

    res.status(200).json(item);
  } catch (error) {
    throw error;
  }
};

const insertItem = async (req, res) => {
  const { nome, precoUnitario } = req.body;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      const id = await getNextId('item');

      await database.collection('item')
        .insertOne({
          _id: id,
          nome: nome,
          precoUnitario: precoUnitario
        });

      res.status(201).json(req.body);
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
};

const updateItem = async (req, res) => {
  const idItem = parseInt(req.params.id);
  const { nome, precoUnitario } = req.body;

  try {
    await database.collection('item')
      .updateOne(
        { _id: idItem },
        {
          $set: {
            nome: nome,
            precoUnitario: precoUnitario
          }
        }
      );

    res.status(200).json(req.body);
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (req, res) => {
  const idItem = parseInt(req.params.id);

  try {
    await database.collection('item')
      .deleteOne({
        _id: idItem
      });

    res.status(200).json({ _id: idItem });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getItens,
  getItemById,
  insertItem,
  updateItem,
  deleteItem,
};