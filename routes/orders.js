import express from 'express';
import {OrderController} from '../controllers/OrderController.js';

const orderRouter = express.Router();

orderRouter.post('/orders', OrderController.postOrder);
orderRouter.get('/orders',OrderController.getOrder)

export {orderRouter}
