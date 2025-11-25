import express from 'express';
import { register, login, updateUser, getAllClients, getUserById } from '../controllers/authController.js';
import { createOrder, getAllOrders, updateStatus, getChartData, getOrdersByClient } from '../controllers/orderController.js';

const router = express.Router();

// --- AUTH ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.put('/auth/update/:id', updateUser);
router.get('/clientes', getAllClients); 

// --- ROTA CRUCIAL: O Header usa isso para pegar a foto do banco ---
router.get('/auth/user/:id', getUserById);

// --- PEDIDOS ---
router.post('/pedido/novo', createOrder);
router.get('/pedidos', getAllOrders);
router.put('/pedido/:status/:id', updateStatus);
router.get('/dashboard/chart', getChartData);
router.get('/pedido/meus-pedidos/:id', getOrdersByClient);

export default router;