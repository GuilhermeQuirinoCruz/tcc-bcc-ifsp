const pool = require('../../db-config');
const queries = require('./queries');

const getEstoques = (req, res) => {
  const data = req.body;

  if (data.idArmazem) {
    pool.query(queries.getEstoqueByArmazemId,
      [data.idArmazem],
      (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
      });
  } else if (data.idItem) {
    pool.query(queries.getEstoqueByItemId,
      [data.idItem],
      (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
      });
  } else {
    pool.query(queries.getEstoques,
      (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
      });
  }
};

const insertEstoque = (req, res) => {
  const { idArmazem, idItem, quantidade } = req.body;

  pool.query(queries.insertEstoque,
    [idArmazem, idItem, quantidade],
    (error, results) => {
      if (error) throw error;

      res.status(201).json(req.body);
    });
};

const updateEstoque = (req, res) => {
  const { idArmazem, idItem, quantidade } = req.body;

  pool.query(queries.updateEstoque,
    [idArmazem, idItem, quantidade],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(req.body);
    });
};

const deleteEstoque = (req, res) => {
  const { idArmazem, idItem } = req.body;

  pool.query(queries.deleteEstoque,
    [idArmazem, idItem],
    (error, results) => {
      if (error) throw error;

      res.status(200).json({ idArmazem: idArmazem, idItem: idItem });
    });
};

module.exports = {
  getEstoques,
  insertEstoque,
  updateEstoque,
  deleteEstoque,
};