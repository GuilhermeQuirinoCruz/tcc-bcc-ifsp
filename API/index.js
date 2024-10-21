const express = require('express');
const { client, connect, getNextId } = require('./db-config');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', async (req, res) => {
  res.send('Teste do Redis');
});

// Routes
const itemRoutes = require('./src/item/routes');
app.use('/api/item', itemRoutes);

const armazemRoutes = require('./src/armazem/routes');
app.use('/api/armazem', armazemRoutes);

const setorRoutes = require('./src/setor/routes');
app.use('/api/setor', setorRoutes);

const clienteRoutes = require('./src/cliente/routes');
app.use('/api/cliente', clienteRoutes);

// const pedidoRoutes = require('./src/pedido/routes');
// app.use('/api/pedido', pedidoRoutes);

const estoqueRoutes = require('./src/estoque/routes');
app.use('/api/estoque', estoqueRoutes);

// const itemPedidoRoutes = require('./src/item_pedido/routes');
// app.use('/api/item_pedido', itemPedidoRoutes);

// Transactions
const transacaoRouter = require('./src/transacao/routes');
app.use('/api/transacao', transacaoRouter);

app.listen(PORT, async () => {
  await connect();
  console.log(`APP inicializado na porta ${PORT}`);
});