const { client, getNextId } = require('../../db-config');

const getCliente = async (id) => {
  try {
    const cliente = await client.HGETALL('cliente:' + id);

    return cliente;
  } catch (error) {
    console.log(error);
  }
};

const getClientes = async (req, res) => {
  try {
    const ids = await client.SMEMBERS('set:cliente');
    let clientes = [];
    for (id of ids) {
      clientes.push(await getCliente(id));
    }

    res.status(200).json(clientes);
  } catch (error) {
    console.log(error);
  }
};

const getClienteById = async (req, res) => {
  const id = req.params.id;

  try {
    res.status(200).json(await getCliente(id));
  } catch (error) {
    console.log(error);
  }
};

const insertCliente = async (req, res) => {
  const { idSetor, nome, cnpj, telefone, cep } = req.body;

  try {
    const id = await getNextId('cliente');
    const key = 'cliente:' + id;

    const multi = client.MULTI();
    await multi
      .HSET(key, {
        id_setor: idSetor,
        nome: nome,
        cnpj: cnpj,
        telefone: telefone,
        cep: cep,
        data_registro: (new Date()).toString(),
        saldo: 0
      })
      .SADD('set:cliente', id.toString())
      .EXEC();

    res.status(201).json(req.body);
  } catch (error) {
    multi.DISCARD();
    console.log(error);
  }
};

const updateCliente = async (req, res) => {
  const id = req.params.id;
  const { idSetor, nome, cnpj, telefone, cep } = req.body;

  try {
    const key = 'cliente:' + id;

    await client.HSET(key, {
      id_setor: idSetor,
      nome: nome,
      cnpj: cnpj,
      telefone: telefone,
      cep: cep
    });

    res.status(200).json(req.body);
  } catch (error) {
    console.log(error);
  }
};

const deleteCliente = async (req, res) => {
  const id = req.params.id;

  const multi = client.MULTI();
  try {
    await multi
      .SREM('set:cliente', id)
      .DEL('cliente:' + id)
      .EXEC();

    res.status(200).json({ id: id });
  } catch (error) {
    multi.DISCARD();
    console.log(error);
  }
};

module.exports = {
  getClientes,
  getClienteById,
  insertCliente,
  updateCliente,
  deleteCliente,
};