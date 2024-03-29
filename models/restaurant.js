
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    
    categories:{
        type:Array,
        default:[]
    },
    status: {
      type: String,
      default: 'active'
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      default: mongoose.Types.ObjectId
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  });

export const Restaurant = mongoose.model('restaurant', RestaurantSchema);

  