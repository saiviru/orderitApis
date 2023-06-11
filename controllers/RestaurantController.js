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
      // Create a new Order document
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
  async GenerateQR(req, res, next) {
    try {
      // Generate server-side timestamp
      const timestamp = new Date();

      // Assign the timestamp to the appropriate field
      req.body.createdAt = timestamp;
      const { id, rid } = req.body;
      const restaurant = await Restaurant.findOne({ rid });

      if (!restaurant) {
        return res.status(404).send({
          message: "Restaurant not found",
        });
      }

      const uniqueId = crypto.randomBytes(8).toString("hex");

      // Create the masked URL
      const maskedUrl = `https://digitallicious.online/orderit/${uniqueId}`;

      // Generate the QR code image
      const qrCodeImage = await QRCode.toDataURL(maskedUrl);

      const qrData = {
        uniqueId,
        maskedUrl,
        qrCodeImage,
        tableNumber:id
      };
      restaurant.qrcodes.push(qrData);

      await restaurant.save();

      console.log("the restaurant qr codes:", restaurant);

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
