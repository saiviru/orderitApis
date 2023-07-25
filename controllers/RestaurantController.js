import { Restaurant } from "../models/restaurant.js";
import mongoose from "mongoose";
import crypto from "crypto";
import QRCode from "qrcode";

const RestaurantController = {
  async RestaurantDetails(req, res, next) {
    try {
      // Generate server-side timestamp
      const timestamp = new Date();

      // Assign the timestamp to the appropriate field
      req.body.createdAt = timestamp;
      const { categories, restaurantId, status, createdAt } = req.body;
      // Create a new Restaurant document
      const order = new Restaurant({
        status,
        categories,
        restaurantId,
        createdAt,
      });

      // Save the new order document to the database
      await order
        .save()
        .then((result) => {
          res.status(201).send({
            message: "Restaurant Created Successfully",
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
  async GetMenu(req,res) {
    try {
      const restaurantId = req.params.id;
      const restaurant = await Restaurant.findOne({ restaurantId });
      if (!restaurant) {
        return res.status(404).send({
          message: "Restaurant not found",
        });
      }
      res.status(200).send({
        data: restaurant.menu,
      });
    } catch (e) {
      res.status(500).send({
        message: "Error finding restaurant categories",
        e,
      });
    }
  },
  async MenuCreate(req, res) {
    //   console.log('the menu req', req.body);
    try {
      const { rId, menu } = req.body;
      const restaurant = await Restaurant.findOne({ restaurantId: rId });
      if (restaurant) {
        try {
          menu._id = new mongoose.Types.ObjectId();
          menu.date = new Date();
          restaurant.menu.push(menu);
          await restaurant.save();
          res.status(200).json(restaurant);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      } else {
        res.json({
          error: 'The input field is empty dd',
        });
      }
    }
    catch (e) {
      console.log("the error in creating menu:", e)
    }
  },
  async MenuTotal(req, res) {
    //   console.log('the menu req', req.body);
    try {
      const { rId, menu } = req.body;
      const restaurant = await Restaurant.findOne({ restaurantId: rId });
      if (restaurant) {
        try {
          restaurant.menu=menu;
          await restaurant.save();
          res.status(200).json(restaurant);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      } else {
        res.json({
          error: 'The input field is empty dd',
        });
      }
    }
    catch (e) {
      console.log("the error in creating menu:", e)
    }
  },
  async MenuEdit(req, res, next) {
    try {
      const { rId, id, item } = req.body;
      // let menu;
      Restaurant.findOne({ restaurantId: rId }, async (err, result) => {
        if (err) {
          console.error(err);
          // Handle the error
        } else {
          const menu = result.menu.find((menuItem) => menuItem._id.equals(id));
          if (menu) {
            menu.itemName = item.itemName;
            menu.description = item.description;
            menu.price = item.price;
            menu.image = item.image;
            menu.category = item.category;
            menu.type = item.type;
            menu.date = item.date;
            try {
              result.markModified('menu');
              await result.save();
              res.status(200).send({
                message: "Menu Item updated successfully",
                result: menu,
              });
            } catch (err) {
              console.error('Failed to update menu item:', err);
              // Handle the error
            }
          } else {
            console.log('Menu item not found.');
          }
        }
      });

      
    } catch (error) {
      res.status(500).send({
        message: "Error updating menu item",
        error,
      });
    }
  },
  async PostOrder(req, res, next) {
    try {
    const timestamp = new Date();

    req.body.createdAt = timestamp;
      const { userId, items, restaurantId, totalAmount, status, table, createdAt, rId } = req.body;
      const orderBody = {
        userId, items, restaurantId, status, totalAmount, table, createdAt
      }
      const restaurant = await Restaurant.findOne({ restaurantId: rId });
      
      if (restaurant) {
        try {
          orderBody._id = new mongoose.Types.ObjectId();
          restaurant.orders.push(orderBody);
          await restaurant.save();
          res.status(200).json(orderBody);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      } else {
        res.json({
          error: 'The order could not be created',
        });
      }
    } catch (e) {
      next(e);
    }
  },
  async GetOrder(req, res) {
    try {
      const restaurantId = req.params.id;
      const restaurant = await Restaurant.find({restaurantId});
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      res.status(200).send({
        data: restaurant[0].orders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  async GetUserOrder(req, res) {
    try {
      const userId = req.params.id;
      Restaurant.aggregate([
        {
          $match: {
            'orders.userId': userId
          }
        },
        {
          $project: {
            _id: 0,
            orders: {
              $filter: {
                input: '$orders',
                as: 'order',
                cond: { $eq: ['$$order.userId', userId] }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            orders: { $push: '$orders' }
          }
        }
      ])
        .then(result => {
          if (result.length > 0) {
            const orders = result[0].orders.flat();
            res.json(orders);
          } else {
            res.json([]);
          }
        })
        .catch(error => {
          res.status(500).json({ error: 'Internal Server Error' });
        });
      // const order = await Order.find({userId:id});
      // console.log("the user order items:",order)
      // if (!order) {
      //   return res.status(404).json({ message: 'User orders not found' });
      // }
      // res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  async UpdateOrderStatus(req, res, next) {
    try {
      const { rId, order, orderId } = req.body;
      Restaurant.findOne({ restaurantId: rId }, async (err, result) => {
        if (err) {
          console.error(err);
          // Handle the error
        } else {
          const orderFetched = result.orders.find((orderItem) => orderItem._id.equals(orderId));
          if (orderFetched) {
            try {
              orderFetched.status = order.status;
              result.markModified('orders');
              await result.save();
              res.status(200).send({
                message: "Order Status updated successfully",
                result: orderFetched,
              });
            } catch (err) {
              console.error('Failed to update order status:', err);
              // Handle the error
            }
          } else {
            console.log('Order not found.');
          }
        }
      });

      // Update the order
      // actualOrder.status = order.status;

      // // Save the updated restaurant document
      // await actualOrder.save();

      // res.status(200).send({
      //   message: "Order Status updated successfully",
      //   result: actualOrder,
      // });
    } catch (error) {
      res.status(500).send({
        message: "Error updating order status",
        error,
      });
    }
  },
  async UpdateRestaurantCategories(req, res, next) {
    try {
      const { restaurantId, categories } = req.body;

      // Find the restaurant by its ID
      //   const resId = new mongoose.Types.ObjectId(restaurantId);
      const restaurant = await Restaurant.findOne({ restaurantId });

      if (!restaurant) {
        return res.status(404).send({
          message: "Restaurant not found",
        });
      }

      // Update the categories
      restaurant.categories = categories;

      // Save the updated restaurant document
      await restaurant.save();

      res.status(200).send({
        message: "Restaurant categories updated successfully",
        result: restaurant,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error updating restaurant categories",
        error,
      });
    }
  },
  async getCategories(req, res) {
    try {
      const restaurantId = req.params.id;
      const restaurant = await Restaurant.findOne({ restaurantId });
      if (!restaurant) {
        return res.status(404).send({
          message: "Restaurant not found",
        });
      }
      res.status(200).send({
        data: restaurant.categories,
      });
    } catch (e) {
      res.status(500).send({
        message: "Error finding restaurant categories",
        e,
      });
    }
  },
  async GetQRData(req, res) {
    try {
      const uniqueId = req.params.id;
      const uniqueCodeData = await Restaurant.aggregate([
        {
          $match: { "qrcodes.uniqueId": uniqueId }
        },
        {
          $project: {
            qrcodes: {
              $filter: {
                input: "$qrcodes",
                cond: { $eq: ["$$this.uniqueId", uniqueId] }
              }
            }
          }
        }
      ]);
      const uniqueIdData = uniqueCodeData[0].qrcodes[0]
      if (!uniqueIdData) {
        return res.status(404).send({
          message: "Restaurant not found",
        });
      }
      res.status(200).send({
        data: uniqueIdData,
      });
    } catch (e) {
      res.status(500).send({
        message: "Error finding restaurant categories",
        e,
      });
    }
  },
  async GetAllQrData(req, res, next) {
    try {
      const restaurantId = req.params.id;
      const restaurant = await Restaurant.findOne({ restaurantId });
      if (!restaurant) {
        return res.status(404).send({
          message: "Data not found",
        });
      }
      res.status(200).send({
        data: restaurant.qrcodes,
      });
    }
    catch (e) {

    }
  },
  async GenerateQR(req, res, next) {
    try {
      // Generate server-side timestamp
      const timestamp = new Date();

      // Assign the timestamp to the appropriate field
      req.body.createdAt = timestamp;
      const { id, rid } = req.body;
      const restaurant = await Restaurant.findOne({ restaurantId: rid });

      if (!restaurant) {
        return res.status(404).send({
          message: "Restaurant not found",
        });
      }

      const uniqueId = crypto.randomBytes(8).toString("hex");

      // Create the masked URL
      const maskedUrl = `https://dorder.masla.in/orderit/${uniqueId}`;

      // Generate the QR code image
      const qrCodeImage = await QRCode.toDataURL(maskedUrl);

      const qrData = {
        uniqueId,
        maskedUrl,
        qrCodeImage,
        rid,
        tableNumber: id
      };
      restaurant.qrcodes.push(qrData);

      await restaurant.save();

      // console.log("the restaurant qr codes:", restaurant);

      res.status(201).send({
        message: "Restaurant Table QR Created Successfully",
        result: qrData,
      });

      // Save the new order document to the database
      // await order
      //   .save()
      //   .then((result) => {
      //     res.status(201).send({
      //       message: "Restaurant Table QR Created Successfully",
      //       result,
      //     });
      //   })
      //   .catch((error) => {
      //     res.status(500).send({
      //       message: "Error creating the QR code",
      //       error,
      //     });
      //   });
    } catch (e) {
      next(e);
    }
  },
  async DeleteMenu(req, res, next) {
    const data = req.params.id;
    const separatedStrings = data.split(",");
    let restaurantId = separatedStrings[1];
    console.log("the restaurant id:", restaurantId);
    try {
      const restaurant = await Restaurant.findOne({ restaurantId });
      if (!restaurant) {
        // Handle the case when the restaurant is not found
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      const menu = restaurant.menu.filter(
        (item) => item._id.toString() !== separatedStrings[0]
      );
      console.log("menu after delete:",menu)
      restaurant.menu = menu;
      await restaurant.save();
      res.json(menu);
    } catch (err) {
      console.error(err);
      // Handle other errors here
      res.status(500).json({ message: "Server error" });
    }
  }
};
export { RestaurantController };
