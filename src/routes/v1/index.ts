import { Router } from 'express';
import { healthController } from '../../controllers';
import orderRoutes from './order.routes';

const router = Router();

router.get('/health', healthController.getHealth);
router.use('/orders', orderRoutes);

export default router;
