const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.route('/')
  .get(controller.getItens)
  .post(controller.insertItem);

router.route('/:id')
  .get(controller.getItemById)
  .put(controller.updateItem)
  .delete(controller.deleteItem);

module.exports = router;