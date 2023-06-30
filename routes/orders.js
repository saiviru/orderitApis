import express from 'express';
import {OrderController} from '../controllers/OrderController.js';

const orderRouter = express.Router();

orderRouter.post('/orders', OrderController.postOrder);
orderRouter.get('/orders',OrderController.getOrder);
orderRouter.get('/userOrders/:id',OrderController.getUserOrder);
orderRouter.put('/orders/orderStatus',OrderController.UpdateOrderStatus);

export {orderRouter}
