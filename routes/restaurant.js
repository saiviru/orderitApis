import express from 'express';
import {RestaurantController} from '../controllers/RestaurantController.js';

const orderRouter = express.Router();

orderRouter.post('/orders', RestaurantController.postOrder);
orderRouter.get('/orders',RestaurantController.getOrder)

export {orderRouter}
