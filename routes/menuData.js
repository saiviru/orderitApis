import express from 'express';
import {MenuDataController} from '../controllers/MenuDataController.js';

const menuDataRouter = express.Router();

menuDataRouter.post('/menuCreate',MenuDataController.MenuCreate);
menuDataRouter.put('/menuDataEdit',MenuDataController.MenuEdit);


export {menuDataRouter}
