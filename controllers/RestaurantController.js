import { getRounds } from "bcrypt";
import { Restaurant } from "../models/restaurant.js";
import mongoose from "mongoose";

const RestaurantController = {
  async postOrder(req, res, next) {
    try {
      const { userId, items, restaurantId, totalAmount } = req.body;
      console.log(
        "the items on post:",
        userId,
        items,
        restaurantId,
        totalAmount
      );
      // Create a new Order document
      const order = new Restaurant({
        userId,
        items,
        restaurantId,
        totalAmount,
      });

      // Save the new order document to the database
      await order
        .save()
        .then((result) => {
          res.status(201).send({
            message: "Order Created Successfully",
            result,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Error creating the order",
            error,
          });
        });
    } catch (e) {
      next(e);
    }
  },
  async getOrder(req, res) {
    try {
      const order = await Restaurant.find({});
      if (!order) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};
export { RestaurantController };
