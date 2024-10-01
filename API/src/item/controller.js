const pool = require('../../db-config');
const queries = require('./queries');

const getItens = (req, res) => {
  pool.query(queries.getItens,
    (error, results) => {
      if (error) throw error;

      res.status(200).json(results.rows);
    });
};

const getItemById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getItemById,
    [id],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(results.rows);
    });
};

const insertItem = (req, res) => {
  const { nome, precoUnitario } = req.body;

  pool.query(queries.insertItem,
    [nome, precoUnitario],
    (error, results) => {
      if (error) throw error;

      res.status(201).json(req.body);
    });
};

const updateItem = (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, precoUnitario } = req.body;

  pool.query(queries.updateItem,
    [id, nome, precoUnitario],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(req.body);
    });
};

const deleteItem = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.deleteItem,
    [id],
    (error, results) => {
      if (error) throw error;

      res.status(200).json({ id: id });
    });
};

module.exports = {
  getItens,
  getItemById,
  insertItem,
  updateItem,
  deleteItem,
};