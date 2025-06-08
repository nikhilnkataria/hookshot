import { startWebHookWorker } from './webhook.worker';
import { startWebHookDlqWorker } from './webhook.dlq.worker';

export function initQueues() {
  startWebHookWorker();
  startWebHookDlqWorker();
}
