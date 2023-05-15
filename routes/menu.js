import express from 'express';
import {MenuController} from '../controllers/MenuController.js';

const menuRouter = express.Router();

menuRouter.put('/menuEdit',MenuController.MenuEdit)


export {menuRouter}
