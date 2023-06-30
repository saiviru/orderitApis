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
        error,
      });
    }
  },
  async MenuCreate(req, res) {
    //   console.log('the menu req', req.body);
    try {
      const { rId, menu } = req.body;
      console.log("the menu for the restaurant is0:", req.body);
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
  async MenuEdit(req, res, next) {
    try {
      const { rId, id, item } = req.body;
      const restaurant = await Restaurant.findOne({ restaurantId: rId });

      // console.log("the menu on put:",restaurant,{id}, {item})
      if (!restaurant) {
        return res.status(404).send({
          message: "Restaurant not found",
        });
      }
      else{
        const menu = await restaurant.menu.findOne({_id: id});
        console.log("the menu item to edit:", restaurant.menu);
      }

      // Update the menu item
      // Update the menu item
      // menu.itemName = item.itemName;
      // menu.description = item.description;
      // menu.price = item.price;
      // menu.image = item.image;
      // menu.category = item.category;
      // menu.type = item.type;
      // menu.date = item.date;

      // // Save the updated menu document
      // await menu.save();

      // res.status(200).send({
      //   message: "Menu Item updated successfully",
      //   result: menu,
      // });
    } catch (error) {
      res.status(500).send({
        message: "Error updating menu item",
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
        error,
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
      console.log("the unique ID data:", uniqueCodeData[0].qrcodes[0], req.params.id);
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
      console.log("the qr code data:", restaurant.qrcodes)
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
      console.log("the restaurant on qr generation api:", rid, id);

      if (!restaurant) {
        return res.status(404).send({
          message: "Restaurant not found",
        });
      }

      const uniqueId = crypto.randomBytes(8).toString("hex");

      // Create the masked URL
      const maskedUrl = `https://thedigitallicious.online/orderit/${uniqueId}`;

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
};
export { RestaurantController };
