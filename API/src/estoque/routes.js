const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.route('/')
  .get(controller.getEstoques)
  .post(controller.insertEstoque)
  .put(controller.updateEstoque)
  .delete(controller.deleteEstoque);

module.exports = router;