import { Router } from 'express';
import { healthController } from '../../controllers';
import orderRoutes from './order.routes';
import orderStatusHistoryRoutes from './orderStatusHistory.route';
import schedulerExecutionLogRoutes from './schedulerExecutionLog.routes';

const router = Router();

router.get('/health', healthController.getHealth);
router.use('/orders', orderRoutes);
router.use('/order-status-history', orderStatusHistoryRoutes);
router.use('/scheduler-execution-logs', schedulerExecutionLogRoutes);

export default router;
