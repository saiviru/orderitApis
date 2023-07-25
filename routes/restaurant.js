import express from 'express';
import {RestaurantController} from '../controllers/RestaurantController.js';

const restaurantRouter = express.Router();

restaurantRouter.post('/restaurant', RestaurantController.RestaurantDetails);
restaurantRouter.post('/menuTotal', RestaurantController.MenuTotal);
restaurantRouter.post('/createMenu',RestaurantController.MenuCreate);
restaurantRouter.put('/editMenu', RestaurantController.MenuEdit);
restaurantRouter.get('/getMenu/:id', RestaurantController.GetMenu);
restaurantRouter.post('/postOrder',RestaurantController.PostOrder);
restaurantRouter.put('/updateOrderStatus',RestaurantController.UpdateOrderStatus);
restaurantRouter.get('/getOrder/:id',RestaurantController.GetOrder);
restaurantRouter.get('/getUserOrder/:id',RestaurantController.GetUserOrder);
restaurantRouter.post('/qrcodes', RestaurantController.GenerateQR);
restaurantRouter.get('/getQrData/:id', RestaurantController.GetQRData);
restaurantRouter.get('/getAllQrData/:id', RestaurantController.GetAllQrData);
restaurantRouter.put('/categoryUpdate',RestaurantController.UpdateRestaurantCategories)
restaurantRouter.get('/resCategories/:id',RestaurantController.getCategories);
restaurantRouter.delete('/deleteMenu/:id',RestaurantController.DeleteMenu);


export {restaurantRouter}
