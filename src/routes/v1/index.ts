import { Router } from 'express';
import { healthController } from '../../controllers';
import orderRoutes from './order.routes';
import orderStatusHistoryRoutes from './orderStatusHistory.route';
import schedulerExecutionLogRoutes from './schedulerExecutionLog.routes';
import schedulerRoutes from './scheduler.routes';

const router = Router();

router.get('/health', healthController.getHealth);
router.use('/orders', orderRoutes);
router.use('/order-status-history', orderStatusHistoryRoutes);
router.use('/scheduler', schedulerRoutes);
router.use('/scheduler-execution-logs', schedulerExecutionLogRoutes);

export default router;
