
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RestaurantOrderSchema = new Schema({
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        name: {
          type: String,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['New', 'In-Progress', 'ready', 'Completed', 'Invalid'],
      default: 'New'
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  });

export const Order = mongoose.model('order', RestaurantOrderSchema);

  