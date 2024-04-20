import {Router} from 'express';
import { createOrder, getAllOrder, updateOrderStatus } from '../controllers/order.controllers.js';

const router = Router();

router.route('/')
    .post(createOrder)
    .get(getAllOrder);

router.route('/:id')
    .put(updateOrderStatus);

export default router;