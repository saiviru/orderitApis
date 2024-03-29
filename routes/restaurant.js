import express from 'express';
import {RestaurantController} from '../controllers/RestaurantController.js';

const restaurantRouter = express.Router();

restaurantRouter.post('/restaurant', RestaurantController.RestaurantDetails);
restaurantRouter.put('/categoryUpdate',RestaurantController.UpdateRestaurantCategories)
restaurantRouter.get('/resCategories/:id',RestaurantController.getCategories)


export {restaurantRouter}
