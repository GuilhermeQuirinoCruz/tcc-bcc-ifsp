const { client, getNextId } = require('../../db-config');

const getArmazem = async (id) => {
  try {
    const armazem = await client.HGETALL('armazem:' + id);

    return armazem;
  } catch (error) {
    console.log(error);
  }
};

const getArmazens = async (req, res) => {
  try {
    const ids = await client.SMEMBERS('set:armazem');
    let armazens = [];
    for (id of ids) {
      armazens.push(await getArmazem(id));
    }

    res.status(200).json(armazens);
  } catch (error) {
    console.log(error);
  }
};

const getArmazemById = async (req, res) => {
  const id = req.params.id;

  try {
    res.status(200).json(await getArmazem(id));
  } catch (error) {
    console.log(error);
  }
};

const insertArmazem = async (req, res) => {
  const { nome, cep, taxa } = req.body;

  try {
    const id = await getNextId('armazem');
    const key = 'armazem:' + id;

    await client.HSET(key, {
      nome: nome,
      cep: cep,
      taxa: parseFloat(taxa)
    });

    await client.SADD('set:armazem', id.toString());

    res.status(201).json(req.body);
  } catch (error) {
    console.log(error);
  }
};

const updateArmazem = async (req, res) => {
  const id = req.params.id;
  const { nome, cep, taxa } = req.body;

  try {
    const key = 'armazem:' + id;

    await client.HSET(key, {
      nome: nome,
      cep: cep,
      taxa: parseFloat(taxa)
    });

    res.status(200).json(req.body);
  } catch (error) {
    console.log(error);
  }
};

const deleteArmazem = async (req, res) => {
  const id = req.params.id;

  try {
    await client.SREM('set:armazem', id);
    await client.DEL('armazem:' + id);

    res.status(200).json({ id: id });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getArmazens,
  getArmazemById,
  insertArmazem,
  updateArmazem,
  deleteArmazem,
};