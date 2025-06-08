import { Worker, Job } from 'bullmq';
import { redisConnection } from '../configs/redis';

export function startWebHookDlqWorker() {
  const worker = new Worker(
    'webhook-delivery-dlq',
    async (job: Job<{ id: string }>) => {
      console.warn(`🪦 DLQ Job received for webhook id: ${job.data.id}`);
      // Optionally: notify admin, log to external system, trigger email, etc.
    },
    { connection: redisConnection }
  );
}
