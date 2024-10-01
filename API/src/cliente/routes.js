const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.route('/')
  .get(controller.getClientes)
  .post(controller.insertCliente);

router.route('/:id')
  .get(controller.getClienteById)
  .put(controller.updateCliente)
  .delete(controller.deleteCliente);

module.exports = router;