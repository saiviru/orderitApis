import { Menu } from "../models/menu.js";

const MenuController = {
  async MenuEdit(req, res, next) {
    try {
      const { id, item } = req.body;
      const menu = await Menu.findOne({ _id: id });

      console.log("the menu on put:",menu,{id}, {item})
      if (!menu) {
        return res.status(404).send({
          message: "Menu Item not found",
        });
      }

      // Update the menu item
      // Update the menu item
      menu.itemName = item.itemName;
      menu.description = item.description;
      menu.price = item.price;
      menu.image = item.image;
      menu.category = item.category;
      menu.type = item.type;
      menu.date = item.date;

      // Save the updated menu document
      await menu.save();

      res.status(200).send({
        message: "Menu Item updated successfully",
        result: menu,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error updating menu item",
        error,
      });
    }
  }
};
export { MenuController };
