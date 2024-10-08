const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Teste do MongoDB');
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

const estoqueRoutes = require('./src/estoque/routes');
app.use('/api/estoque', estoqueRoutes);

// // Transactions
const transacaoRouter = require('./src/transacao/routes');
app.use('/api/transacao', transacaoRouter);

app.listen(PORT, () => {
  console.log(`APP inicializado na porta ${PORT}`);
});