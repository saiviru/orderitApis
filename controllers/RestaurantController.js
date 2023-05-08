import {Restaurant} from '../models/restaurant.js';
import mongoose from 'mongoose';

const RestaurantController = async (req, res, next) => {
    try {
      const { userId, items, restaurantId, totalAmount  } = req.body;
      console.log("the items on post:",userId,items,restaurantId, totalAmount )
      // Create a new Order document
      const order = new Restaurant({ userId, items, restaurantId, totalAmount });
  
      // Save the new order document to the database
      await order.save();
  
      // Return the newly created order as the response
      res.status(201).send({
				message: 'Order Created Successfully',
				order,
			});
    } catch (error) {
      next(error);
    }
  };

  export {RestaurantController}