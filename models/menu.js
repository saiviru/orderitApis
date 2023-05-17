import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Create schema for todo
const MenuSchema = new Schema({
  itemName: String,
  description: String,
  price: String,
  image:String,
  category:String,
  type:String,
  date: { type: Date, default: Date.now() }
});

// MenuSchema.add({price: Number});
// Create model for todo
const Menu = mongoose.model('menu', MenuSchema);
// Menu.schema.add({price: Number});

export{
  Menu
}