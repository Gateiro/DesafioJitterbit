const express = require('express');
const orderRoutes = require('./routes/orderRoutes'); // Importa o arquivo de rotas

const app = express();

// Permite que a nossa API leia JSON no corpo (body) da requisição
app.use(express.json());

// Diz para o Express usar as rotas que criamos para qualquer URL que comece com /order
app.use('/order', orderRoutes);

// Liga o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});