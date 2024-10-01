const pool = require('../../db-config');
const queries = require('./queries');

const getClientes = (req, res) => {
  pool.query(queries.getClientes,
    (error, results) => {
      if (error) throw error;

      res.status(200).json(results.rows);
    });
};

const getClienteById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getClienteById,
    [id],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(results.rows);
    });
};

const insertCliente = (req, res) => {
  const { idSetor, nome, cnpj, telefone, cep } = req.body;

  pool.query(queries.insertCliente,
    [idSetor, nome, cnpj, telefone, cep, new Date()],
    (error, results) => {
      if (error) throw error;

      res.status(201).json(req.body);
    });
};

const updateCliente = (req, res) => {
  const id = parseInt(req.params.id);
  const { idSetor, nome, cnpj, telefone, cep } = req.body;

  pool.query(queries.updateCliente,
    [id, idSetor, nome, cnpj, telefone, cep],
    (error, results) => {
      if (error) throw error;

      res.status(200).json(req.body);
    });
};

const deleteCliente = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.deleteCliente,
    [id],
    (error, results) => {
      if (error) throw error;

      res.status(200).json({ id: id });
    });
};

module.exports = {
  getClientes,
  getClienteById,
  insertCliente,
  updateCliente,
  deleteCliente,
};