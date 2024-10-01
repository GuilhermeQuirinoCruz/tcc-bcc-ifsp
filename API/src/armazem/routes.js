const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.route('/')
  .get(controller.getArmazens)
  .post(controller.insertArmazem);

router.route('/:id')
  .get(controller.getArmazemById)
  .put(controller.updateArmazem)
  .delete(controller.deleteArmazem);

module.exports = router;