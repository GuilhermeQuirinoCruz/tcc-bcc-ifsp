const { client, getNextId } = require('../../db-config');

const getSetor = async (id) => {
  try {
    const setor = await client.HGETALL('setor:' + id);

    return setor;
  } catch (error) {
    console.log(error);
  }
};

const getSetores = async (req, res) => {
  try {
    const ids = await client.SMEMBERS('set:setor');
    let setores = [];
    for (id of ids) {
      setores.push(await getSetor(id));
    }

    res.status(200).json(setores);
  } catch (error) {
    console.log(error);
  }
};

const getSetorById = async (req, res) => {
  const id = req.params.id;

  try {
    res.status(200).json(await getSetor(id));
  } catch (error) {
    console.log(error);
  }
};

const insertSetor = async (req, res) => {
  const { idArmazem, nome, cep, taxa } = req.body;

  try {
    const id = await getNextId('setor');
    const key = 'setor:' + id;

    await client.HSET(key, {
      id_armazem: idArmazem,
      nome: nome,
      cep: cep,
      taxa: parseFloat(taxa)
    });

    await client.SADD('set:setor', id.toString());

    res.status(201).json(req.body);
  } catch (error) {
    console.log(error);
  }
};

const updateSetor = async (req, res) => {
  const id = req.params.id;
  const { nome, cep, taxa } = req.body;

  try {
    const key = 'setor:' + id;

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

const deleteSetor = async (req, res) => {
  const id = req.params.id;

  try {
    await client.SREM('set:setor', id);
    await client.DEL('setor:' + id);

    res.status(200).json({ id: id });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getSetores,
  getSetorById,
  insertSetor,
  updateSetor,
  deleteSetor,
};