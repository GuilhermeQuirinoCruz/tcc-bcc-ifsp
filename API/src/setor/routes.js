const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.route('/')
  .get(controller.getSetores)
  .post(controller.insertSetor);

router.route('/:id')
  .get(controller.getSetorById)
  .put(controller.updateSetor)
  .delete(controller.deleteSetor);

module.exports = router;