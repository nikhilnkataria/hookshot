import { Router } from 'express';
import healthRoutes from './health.route';
import webhookRoutes from './webhook.route';

const router = Router();

router.use('/health', healthRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
