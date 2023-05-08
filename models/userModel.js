import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserOrderSchema = new Schema({
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
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['new', 'preparing', 'ready', 'delivered', 'cancelled'],
      default: 'new'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  });

export const UserModel = mongoose.model('userModel', UserOrderSchema);

  
