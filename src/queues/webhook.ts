import { Queue } from 'bullmq';

import { redisConnection } from '../configs/redis';

export const webhookQueue = new Queue<{ id: string }>('webhook-delivery', {
  connection: redisConnection,
});
