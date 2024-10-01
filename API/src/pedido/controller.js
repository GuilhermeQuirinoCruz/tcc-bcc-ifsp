const pool = require('../../db-config');
const queries = require('./queries');

const getPedidos = (req, res) => {
  pool.query(queries.getPedidos,
    (error, results) => {
      if (error) throw error;

      res.status(200).json(results.rows);
    });
};

const getPedidoById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getPedidoById,
    [id],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(results.rows);
    });
};

const insertPedido = (req, res) => {
  const { idCliente } = req.body;

  pool.query(queries.insertPedido,
    [idCliente, new Date()],
    (error, results) => {
      if (error) throw error;

      res.status(201).json(req.body);
    });
};

const updatePedido = (req, res) => {
  const id = parseInt(req.params.id);
  const { entregue } = req.body;

  pool.query(queries.updatePedido,
    [id, entregue],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(req.body);
    });
};

const deletePedido = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.deletePedido,
    [id],
    (error, results) => {
      if (error) throw error;

      res.status(200).json({ id: id });
    });
};

module.exports = {
  getPedidos,
  getPedidoById,
  insertPedido,
  updatePedido,
  deletePedido,
};