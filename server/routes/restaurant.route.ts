import express from 'express';
import { getRestaurants } from '../controllers/restaurant.controller';

const restaurantRouter = express.Router();

restaurantRouter.post('/execute', getRestaurants);

export default restaurantRouter;