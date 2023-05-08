import express from 'express';
import {RestaurantController} from '../controllers/RestaurantController.js';

const orderRouter = express.Router();

orderRouter.post('/', RestaurantController);
orderRouter.get('/',RestaurantController)

export {orderRouter}
