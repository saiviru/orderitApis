import { MenuData } from "../models/menuData.js";
import mongoose from 'mongoose';


const MenuDataController = {
  async MenuEdit(req, res, next) {
    try {
        const { restaurantId, menuData, menuId } = req.body;
        const menu = await MenuData.findOne({ restaurantId: restaurantId });
        console.log("the menu on put0:",{menu});
        // const menuItem = await menu.menuData.findOne({_id:menuId})
         const menuItem = menu.menuData.map((each)=>{
        console.log("the menu on put1:",each._id,mongoose.Types.ObjectId(menuId));
            if(each._id.equals(mongoose.Types.ObjectId(menuId))){
                console.log("the menu on put2:",each);
                return each;
            }
         });

    //   if (!menu) {
    //     return res.status(404).send({
    //       message: "Menu Item not found",
    //     });
    //   }

    //   // Update the menu item
    //   // Update the menu item
    //   menu.itemName = item.itemName;
    //   menu.description = item.description;
    //   menu.price = item.price;
    //   menu.image = item.image;
    //   menu.category = item.category;
    //   menu.type = item.type;
    //   menu.date = item.date;

    //   // Save the updated menu document
    //   await menu.save();

    //   res.status(200).send({
    //     message: "Menu Item updated successfully",
    //     result: menu,
    //   });
    } catch (error) {
      res.status(500).send({
        message: "Error updating menu item",
        error,
      });
    }
  },
  async MenuCreate(req, res){
    //   console.log('the menu req', req.body);
    try{
        const { restaurantId, menuData } = req.body;
        const menu = await MenuData.findOne({ restaurantId: restaurantId });
        console.log("the menu for the restaurant is:",menu);
        if (menu) {
            try {
                menuData._id= new mongoose.Types.ObjectId();
                menuData.date = new Date();
                menu.menuData.push(menuData);
                await menu.save();
                res.status(200).json(menu);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        } else {
            res.json({
                error: 'The input field is empty dd',
            });
        }
    }
    catch(e){
        console.log("the error in creating menu:",e)
    }
  }
};
export { MenuDataController };
