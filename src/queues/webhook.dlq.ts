import { Queue } from 'bullmq';

import { redisConnection } from '../configs/redis';
import { DLQ_QUEUE_NAME } from '../configs/constants';

export const webhookDLQueue = new Queue<{ id: string }>(DLQ_QUEUE_NAME, {
  connection: redisConnection,
});
