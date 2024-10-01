const pool = require('../../db-config');
const queries = require('./queries');

const getItensPedido = (req, res) => {
  const data = req.body;

  if (data.idItem) {
    pool.query(queries.getItemPedidoByItemId,
      [data.idItem],
      (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
      });
  } else if (data.idPedido) {
    pool.query(queries.getItemPedidoByPedidoId,
      [data.idPedido],
      (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
      });
  } else {
    pool.query(queries.getItensPedido,
      (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
      });
  }
};

const insertItemPedido = (req, res) => {
  const { idItem, idPedido, quantidade } = req.body;

  pool.query(queries.insertItemPedido,
    [idItem, idPedido, quantidade],
    (error, results) => {
      if (error) throw error;

      res.status(201).json(req.body);
    });
};

const updateItemPedido = (req, res) => {
  const { idItem, idPedido, quantidade } = req.body;

  pool.query(queries.updateItemPedido,
    [idItem, idPedido, quantidade],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(req.body);
    });
};

const deleteItemPedido = (req, res) => {
  const { idItem, idPedido } = req.body;

  pool.query(queries.deleteItemPedido,
    [idItem, idPedido],
    (error, results) => {
      if (error) throw error;

      res.status(200).json({ idItem: idItem, idPedido: idPedido });
    });
};

module.exports = {
  getItensPedido,
  insertItemPedido,
  updateItemPedido,
  deleteItemPedido,
};