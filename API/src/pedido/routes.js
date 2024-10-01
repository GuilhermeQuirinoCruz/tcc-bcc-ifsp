const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.route('/')
  .get(controller.getPedidos)
  .post(controller.insertPedido);

router.route('/:id')
  .get(controller.getPedidoById)
  .put(controller.updatePedido)
  .delete(controller.deletePedido);

module.exports = router;