import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Create schema for todo
const MenuDataSchema = new Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    menuData: { type: Array, default: [] },
    date: { type: Date, default: Date.now() },
});

// Create model for MenuData
const MenuData = mongoose.model('menuData', MenuDataSchema);

export{
  MenuData
}