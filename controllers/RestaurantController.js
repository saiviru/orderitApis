import {Restaurant} from '../models/restaurant.js';
import mongoose from 'mongoose';

const RestaurantController = async (req, res, next) => {
    try {
      const { userId, items, restaurantId, totalAmount  } = req.body;
      console.log("the items on post:",userId,items,restaurantId, totalAmount )
      // Create a new Order document
      const order = new Restaurant({ userId, items, restaurantId, totalAmount });
  
      // Save the new order document to the database
      await order.save().then((result) => {
        res.status(201).send({
          message: 'Order Created Successfully',
          result,
        });
      })
      .catch((error) => {
        res.status(500).send({
          message: 'Error creating the order',
          error,
        });
      });
  }

  catch(e){
    next(e)
  }
}
  export {RestaurantController}