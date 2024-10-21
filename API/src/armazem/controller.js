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

  const multi = client.MULTI();
  try {
    const id = await getNextId('armazem');
    const key = 'armazem:' + id;

    await multi
      .HSET(key, {
        nome: nome,
        cep: cep,
        taxa: parseFloat(taxa)
      })
      .SADD('set:armazem', id.toString())
      .EXEC();

    res.status(201).json(req.body);
  } catch (error) {
    await client.DISCARD();
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
  
  const multi = client.MULTI();
  try {
    await multi
      .SREM('set:armazem', id)
      .DEL('armazem:' + id)
      .EXEC();

    res.status(200).json({ id: id });
  } catch (error) {
    multi.DISCARD();
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