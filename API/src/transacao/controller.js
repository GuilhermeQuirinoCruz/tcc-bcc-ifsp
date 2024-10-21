const { client, getNextId } = require('../../db-config');

const getClienteIdByCnpj = async (cnpj) => {
  try {
    const ids = await client.SMEMBERS('set:cliente');
    for (id of ids) {
      const result = await client.HGET('cliente:' + id, 'cnpj');
      if (result == cnpj) {
        return id;
      }
    }

    return 0;
  } catch (error) {
    console.log(error);
  }
};

const getSetorIdByClienteId = async (idCliente) => {
  try {
    return (await client.HGET('cliente:' + idCliente, 'id_setor'));
  } catch (error) {
    console.log(error);
  }
};

const getArmazemIdBySetorId = async (idSetor) => {
  try {
    return (await client.HGET('setor:' + idSetor, 'id_armazem'));
  } catch (error) {
    console.log(error);
  }
};

const getTaxa = async (idArmazem, idSetor) => {
  try {
    let taxa = 0;
    taxa += parseFloat(await client.HGET('armazem:' + idArmazem, 'taxa'));
    taxa += parseFloat(await client.HGET('setor:' + idSetor, 'taxa'));

    return taxa;
  } catch (error) {
    console.log(error);
  }
};

const getPedidoIdByClienteId = async (idCliente) => {
  try {
    const ids = await client.SMEMBERS('set:pedido');
    let idMaisRecente = 0;
    for (id of ids) {
      const result = await client.HGET('pedido:' + id, 'id_cliente');
      if (result == idCliente) {
        idMaisRecente = id;
      }
    }

    return idMaisRecente;
  } catch (error) {
    console.log(error);
  }
};

const getArmazemIdByPedidoId = async (idPedido) => {
  try {
    const idCliente = await client.HGET('pedido:' + idPedido, 'id_cliente');
    const idSetor = await client.HGET('cliente:' + idCliente, 'id_setor');
    const idArmazem = await client.HGET('setor:' + idSetor, 'id_armazem');

    return idArmazem;
  } catch (error) {
    console.log(error);
  }
}

const getClientesBySetorId = async (idSetor) => {
  try {
    const idsClientes = new Set(await client.SMEMBERS('set:cliente'));
    for (idCliente of idsClientes) {
      const clienteIdSetor = (await client.HGET('cliente:' + idCliente, 'id_setor'));
      if (clienteIdSetor.toString() != idSetor) {
        idsClientes.delete(idCliente);
      }
    }

    return idsClientes;
  } catch (error) {
    console.log(error);
  }
}

const getItensPedidosNaoEntregues = async (idSetor) => {
  try {
    const idsClientes = await getClientesBySetorId(idSetor);
    const idsPedidos = await client.SMEMBERS('set:pedido');
    
    const itens = new Map();
    for (idPedido of idsPedidos) {
      const pedido = await client.HGETALL('pedido:' + idPedido);
      if (pedido.entregue == 'true' || !idsClientes.has(pedido.id_cliente)) {
        continue;
      }

      const itensPedido = JSON.parse(pedido.itens);
      for (item of itensPedido) {
        if (!itens.get(item.id)) {
          itens.set(item.id, item.quantidade);
        } else {
          itens.set(item.id, itens.get(item.id) + item.quantidade);
        }
      }
    }

    return itens;
  } catch (error) {
    console.log(error);
  }
}

const novoPedido = async (req, res) => {
  const { idCliente, itens } = req.body;

  const multi = client.MULTI();
  try {
    const idSetor = await getSetorIdByClienteId(idCliente);
    const idArmazem = await getArmazemIdBySetorId(idSetor);

    let totalPedido = 0;

    for (const item of itens) {
      const precoUnitario = await client.HGET('item:' + item.id, 'preco_unitario');
      totalPedido += precoUnitario * item.quantidade;
    }

    const taxa = 1 + await getTaxa(idArmazem, idSetor);
    totalPedido *= taxa;

    const id = await getNextId('pedido');
    const key = 'pedido:' + id;

    await multi
      .HSET(key, {
        id_cliente: idCliente,
        data: (new Date()).toString(),
        entregue: 'false',
        itens: JSON.stringify(itens)
      })
      .SADD('set:pedido', id.toString())
      .HINCRBYFLOAT('setor:' + idSetor, 'saldo', totalPedido)
      .HINCRBYFLOAT('cliente:' + idCliente, 'saldo', -totalPedido)
      .EXEC();

    res.status(200).json('Pedido criado com sucesso');
  } catch (error) {
    multi.DISCARD();
    console.log(error);
  }
};

const pagamento = async (req, res) => {
  const { cnpj, valor } = req.body;

  const multi = client.MULTI();
  try {
    const idCliente = await getClienteIdByCnpj(cnpj);

    const id = await getNextId('pagamento');
    const key = 'pagamento:' + idCliente + ':' + id;

    await multi
      .HSET(key, {
        data: (new Date()).toString(),
        valor: valor
      })
      .HINCRBYFLOAT('cliente:' + idCliente, 'saldo', valor)
      .EXEC();

    res.status(200).json('Pagamento realizado com sucesso');
  } catch (error) {
    multi.DISCARD();
    console.log(error);
  }
};

const pedidoEntregue = async (req, res) => {
  const { cnpj } = req.body;

  try {
    const idCliente = await getClienteIdByCnpj(cnpj);
    const idPedido = await getPedidoIdByClienteId(idCliente);

    const entregue = await client.HGET('pedido:' + idPedido, 'entregue');
    res.status(200).json(entregue == 'true');
  } catch (error) {
    console.log(error);
  }
};

const entrega = async (req, res) => {
  const { idPedido } = req.body;

  const multi = client.MULTI();
  try {
    const idArmazem = await getArmazemIdByPedidoId(idPedido);
    const pedido = await client.HGETALL('pedido:' + idPedido);

    let estoqueSuficiente = true;
    for (const item of JSON.parse(pedido.itens)) {
      const keyEstoque = 'estoque:' + idArmazem + ':' + item.id;
      const estoque = parseInt(await client.GET(keyEstoque));

      if (estoque < item.quantidade) {
        estoqueSuficiente = false;
        break;
      }

      multi.INCRBY(keyEstoque, -item.quantidade);
    }

    if (estoqueSuficiente) {
      multi.HSET('pedido:' + idPedido, {
        entregue: 'true'
      });

      multi.EXEC();
      res.status(200).json('Pedido entregue');
    } else {
      multi.DISCARD();
      res.status(200).json('Quantidade insuficiente');
    }
  } catch (error) {
    multi.DISCARD();
    console.log(error);
  }
};

const nivelEstoque = async (req, res) => {
  const { idSetor } = req.body;

  try {
    const idArmazem = await getArmazemIdBySetorId(idSetor);
    const itensPedidosNaoEntregues = await getItensPedidosNaoEntregues(idSetor);

    let itensEmFalta = [];
    for ([idItem, quantidade] of itensPedidosNaoEntregues) {
      const keyEstoque = 'estoque:' + idArmazem + ':' + idItem;
      const estoque = parseInt(await client.GET(keyEstoque));

      if (estoque < quantidade) {
        itensEmFalta.push({
          idItem: idItem,
          quantidade: quantidade - estoque
        });
      }
    }

    res.status(200).json(itensEmFalta);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  novoPedido,
  pagamento,
  pedidoEntregue,
  entrega,
  nivelEstoque,
};