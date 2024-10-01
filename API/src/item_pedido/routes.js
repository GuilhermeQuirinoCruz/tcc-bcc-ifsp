const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.route('/')
  .get(controller.getItensPedido)
  .post(controller.insertItemPedido)
  .put(controller.updateItemPedido)
  .delete(controller.deleteItemPedido);

module.exports = router;