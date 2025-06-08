type WebhookPayloadInterface = {
  event?: string;
  data: object | any[];
};

type WebhookMetaInterface = {
  source: string;
  project_id: string;
};

type WebhookRetryConfig = {
  max_attempts: number;
  initial_delay_ms: number;
  backoff_strategy: 'exponential' | 'fixed' | 'linear';
};

export type WebhookInterface = {
  target_url: string;
  payload: WebhookPayloadInterface;
  retry_config: WebhookRetryConfig;
  headers?: Record<string, string>;
  meta?: WebhookMetaInterface;
};
