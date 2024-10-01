const pool = require('../../db-config');
const queries = require('./queries');

const getArmazens = (req, res) => {
  pool.query(queries.getArmazens,
    (error, results) => {
      if (error) throw error;

      res.status(200).json(results.rows);
    });
};

const getArmazemById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getArmazemById,
    [id],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(results.rows);
    });
};

const insertArmazem = (req, res) => {
  const { nome, cep, taxa } = req.body;

  pool.query(queries.insertArmazem,
    [nome, cep, taxa],
    (error, results) => {
      if (error) throw error;

      res.status(201).json(req.body);
    });
};

const updateArmazem = (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, cep, taxa } = req.body;

  pool.query(queries.updateArmazem,
    [id, nome, cep, taxa],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(req.body);
    });
};

const deleteArmazem = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.deleteArmazem,
    [id],
    (error, results) => {
      if (error) throw error;

      res.status(200).json({ id: id });
    });
};

module.exports = {
  getArmazens,
  getArmazemById,
  insertArmazem,
  updateArmazem,
  deleteArmazem,
};