const pool = require('../../db-config');
const queries = require('./queries');

const getSetores = (req, res) => {
  pool.query(queries.getSetores,
    (error, results) => {
      if (error) throw error;

      res.status(200).json(results.rows);
    });
};

const getSetorById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getSetorById,
    [id],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(results.rows);
    });
};

const insertSetor = (req, res) => {
  const { idArmazem, nome, cep, taxa } = req.body;

  pool.query(queries.insertSetor,
    [idArmazem, nome, cep, taxa],
    (error, results) => {
      if (error) throw error;

      res.status(201).json(req.body);
    });
};

const updateSetor = (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, cep, taxa } = req.body;

  pool.query(queries.updateSetor,
    [id, nome, cep, taxa],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(req.body);
    });
};

const deleteSetor = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.deleteSetor,
    [id],
    (error, results) => {
      if (error) throw error;

      res.status(200).json({ id: id });
    });
};

module.exports = {
  getSetores,
  getSetorById,
  insertSetor,
  updateSetor,
  deleteSetor,
};