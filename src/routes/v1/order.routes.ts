import { Router } from 'express';
import { orderController } from '../../controllers';
import { validateRequest } from '../../middlewares';
import { createOrderValidator, getOrdersValidator } from '../../validators';

const router = Router();

router.post(
  '/',
  createOrderValidator,
  validateRequest,
  orderController.createOrder,
);

router.get(
  '/',
  getOrdersValidator,
  validateRequest,
  orderController.getOrders,
);

export default router;
