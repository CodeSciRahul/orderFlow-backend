import { Router } from 'express';
import { orderStatusHistoryController } from '../../controllers';
import { validateRequest } from '../../middlewares';
import {
  createOrderStatusHistoryValidator,
  getOrderStatusHistoryValidator,
} from '../../validators';

const router = Router();

router.post(
  '/',
  createOrderStatusHistoryValidator,
  validateRequest,
  orderStatusHistoryController.createOrderStatusHistory,
);

router.get(
  '/:orderId',
  getOrderStatusHistoryValidator,
  validateRequest,
  orderStatusHistoryController.getOrderStatusHistory,
);

export default router;
