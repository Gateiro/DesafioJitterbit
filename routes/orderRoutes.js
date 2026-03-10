const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Criar pedido 
router.post('/', orderController.createOrder); 

// 1. Listar todos os pedidos
router.get('/list/all', orderController.listOrders); 

// 2. Obter pedido por ID
router.get('/:id', orderController.getOrderById); 

// 3. Deletar pedido
router.delete('/:id', orderController.deleteOrder); 

// 4. Atualizar pedido.
router.put('/:id', orderController.updateOrder);

module.exports = router;