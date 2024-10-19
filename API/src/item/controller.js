const { client, getNextId } = require('../../db-config');

const getItem = async (id) => {
  try {
    const item = await client.HGETALL('item:' + id);

    return item;
  } catch (error) {
    console.log(error);
  }
};

const getItens = async (req, res) => {
  try {
    const ids = await client.SMEMBERS('set:item');
    let itens = [];
    for (id of ids) {
      itens.push(await getItem(id));
    }

    res.status(200).json(itens);
  } catch (error) {
    console.log(error);
  }
};

const getItemById = async (req, res) => {
  const id = req.params.id;

  try {
    res.status(200).json(await getItem(id));
  } catch (error) {
    console.log(error);
  }
};

const insertItem = async (req, res) => {
  const { nome, precoUnitario } = req.body;

  try {
    const id = await getNextId('item');
    const key = 'item:' + id;

    await client.HSET(key, {
      nome: nome,
      preco_unitario: parseFloat(precoUnitario)
    });

    await client.SADD('set:item', id.toString());

    res.status(201).json(req.body);
  } catch (error) {
    console.log(error);
  }
};

const updateItem = async (req, res) => {
  const id = req.params.id;
  const { nome, precoUnitario } = req.body;

  try {
    const key = 'item:' + id;

    await client.HSET(key, {
      nome: nome,
      preco_unitario: parseFloat(precoUnitario)
    });

    res.status(200).json(req.body);
  } catch (error) {
    console.log(error);
  }
};

const deleteItem = async (req, res) => {
  const id = req.params.id;

  try {
    await client.SREM('set:item', id);
    await client.DEL('item:' + id);

    res.status(200).json({ id: id });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getItens,
  getItemById,
  insertItem,
  updateItem,
  deleteItem,
};