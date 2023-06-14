import { Order } from "../models/order.js";

const OrderController = {
  async postOrder(req, res, next) {
    try {
      // Generate server-side timestamp
    const timestamp = new Date();

    // Assign the timestamp to the appropriate field
    req.body.createdAt = timestamp;
      const { userId, items, restaurantId, totalAmount, table, createdAt } = req.body;
      // Create a new Order document
      const order = new Order({
        userId,
        items,
        restaurantId,
        totalAmount,
        table,
        createdAt
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
      const order = await Order.find({});
      if (!order) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  async UpdateOrderStatus(req, res, next) {
    try {
      const { order, orderId } = req.body;

      // Find the order by its ID
      const actualOrder = await Order.findOne({ _id:orderId });

      if (!actualOrder) {
        return res.status(404).send({
          message: "Order not found",
        });
      }

      // Update the order
      actualOrder.status = order.status;

      // Save the updated restaurant document
      await actualOrder.save();

      res.status(200).send({
        message: "Order Status updated successfully",
        result: actualOrder,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error updating order status",
        error,
      });
    }
  },
};
export { OrderController };
