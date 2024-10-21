const { client, getNextId } = require('../../db-config');

const getEstoques = async (req, res) => {
  const { idArmazem, idItem } = req.body;

  try {
    if (idArmazem && idItem) {
      const key = 'estoque:' + idArmazem + ':' + idItem;
      const quantidade = await client.GET(key);

      res.status(200).json({ quantidade: quantidade });
    } else {
      const estoqueKeys = await client.SMEMBERS('set:estoque');
      let estoques = [];
      for (key of estoqueKeys) {
        estoques.push(await client.GET(key));
      }

      res.status(200).json(estoques);
    }
  } catch (error) {
    console.log(error);
  }
};

const insertEstoque = async (req, res) => {
  const { idArmazem, idItem, quantidade } = req.body;

  try {
    const key = 'estoque:' + idArmazem + ':' + idItem;

    await client.MULTI()
      .SET(key, parseInt(quantidade))
      .SADD('set:estoque', key)
      .EXEC();

    res.status(201).json(req.body);
  } catch (error) {
    await client.DISCARD();
    console.log(error);
  }
};

const updateEstoque = async (req, res) => {
  const { idArmazem, idItem, quantidade } = req.body;

  try {
    const key = 'estoque:' + idArmazem + ':' + idItem;

    await client.SET(key, parseInt(quantidade));

    res.status(200).json(req.body);
  } catch (error) {
    console.log(error);
  }
};

const deleteEstoque = async (req, res) => {
  const { idArmazem, idItem } = req.body;

  try {
    await client.MULTI()
      .SREM('set:estoque', key)
      .DEL('estoque:' + idArmazem + ':' + idItem)
      .EXEC();

    res.status(200).json({ idArmazem: idArmazem, idItem: idItem });
  } catch (error) {
    await client.DISCARD();
    console.log(error);
  }
};

module.exports = {
  getEstoques,
  insertEstoque,
  updateEstoque,
  deleteEstoque,
};