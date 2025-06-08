import { Queue } from 'bullmq';

import { redisConnection } from '../configs/redis';
import { RETRY_QUEUE_NAME } from '../configs/constants';

export const webhookQueue = new Queue<{ id: string }>(RETRY_QUEUE_NAME, {
  connection: redisConnection,
});
