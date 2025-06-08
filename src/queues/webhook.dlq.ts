import { Queue } from 'bullmq';

import { redisConnection } from '../configs/redis';

export const webhookDLQueue = new Queue<{ id: string }>(
  'webhook-delivery-dlq',
  {
    connection: redisConnection,
  }
);
