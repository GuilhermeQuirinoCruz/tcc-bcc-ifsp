const { client, database, getNextId } = require('../../db-config');

const getEstoques = async (req, res) => {
  const data = req.body;

  try {
    var estoques;
    if (data.idArmazem) {
      if (data.idItem) {
        estoques = await database.collection('armazem')
          .aggregate(
            [
              { $match: { _id: data.idArmazem } },
              { $unwind: '$estoque' },
              { $match: { 'estoque.idItem': data.idItem } },
              {
                $project: {
                  _id: 0,
                  quantidade: '$estoque.quantidade',
                }
              }
            ]
          )
          .next();
      } else {
        estoques = await database.collection('armazem')
          .aggregate(
            [
              { $match: { _id: data.idArmazem } },
              { $unwind: '$estoque' },
              {
                $project: {
                  _id: 0,
                  idItem: '$estoque.idItem',
                  quantidade: '$estoque.quantidade',
                }
              }
            ]
          )
          .toArray();
      }
    } else {
      estoques = await database.collection('armazem')
        .aggregate(
          [
            { $unwind: '$estoque' },
            {
              $project: {
                _id: 0,
                idArmazem: '$_id',
                idItem: '$estoque.idItem',
                quantidade: '$estoque.quantidade',
              }
            }
          ]
        )
        .toArray();
    }

    res.status(200).json(estoques);
  } catch (error) {
    throw error;
  }
};

const getEstoqueById = async (req, res) => {
  const { idArmazem, idItem } = req.body;

  try {
    const estoque = await database.collection('armazem')
      .aggregate(
        [
          { $match: { '_id': idArmazem } },
          { $unwind: '$estoque' },
          { $match: { 'estoque.idItem': idItem } },
          {
            $project: {
              // _id: '$_id',
              idItem: idItem,
              quantidade: '$estoque.quantidade'
            }
          }
        ]
      )
      .next();

    res.status(200).json(estoque);
  } catch (error) {
    throw error;
  }
};

const insertEstoque = async (req, res) => {
  const { idArmazem, idItem, quantidade } = req.body;
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      await database.collection('armazem')
        .updateOne(
          { _id: idArmazem },
          {
            $push: {
              estoque: {
                idItem: idItem,
                quantidade: quantidade
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

const updateEstoque = async (req, res) => {
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
            'setores.$.taxa': taxa
          }
        }
      );

    res.status(200).json(req.body);
  } catch (error) {
    throw error;
  }
};

const deleteEstoque = async (req, res) => {
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
  getEstoques,
  getEstoqueById,
  insertEstoque,
  updateEstoque,
  deleteEstoque,
};