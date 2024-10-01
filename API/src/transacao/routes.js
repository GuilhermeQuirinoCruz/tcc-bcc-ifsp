const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.route('/novo_pedido')
  .post(controller.novoPedido);

router.route('/pagamento')
  .post(controller.pagamento);

router.route('/nivel_estoque')
  .get(controller.nivelEstoque);

router.route('/entrega')
  .post(controller.entrega);

router.route('/pedido_entregue')
  .get(controller.pedidoEntregue);

module.exports = router;