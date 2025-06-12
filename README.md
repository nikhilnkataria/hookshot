# 🔁 HookSpot - Webhook Retry Manager

A production-ready, plug-and-play backend queue-based delivery service for **reliable webhook delivery with retry logic**, dead letter queue (DLQ) handling, and visibility APIs.

---

## 🚀 Why This Exists

Webhooks often fail due to downtime, rate limits, or flaky receivers. This service ensures:

- Automatic retries with exponential backoff
- Dead-letter queue for persistent failures
- Full delivery visibility via APIs

---

## ⚙️ Features

- ✅ Retry on timeout, 5xx, and connection errors
- ✅ Exponential backoff with optional jitter
- ✅ Max retry attempts with DLQ fallback
- ✅ Delivery status tracking: `pending`, `retrying`, `delivered`, `failed`, `dead`
- ✅ Pluggable via REST API
- ✅ Admin endpoints to inspect delivery attempts
- ✅ Swagger-powered API docs for easy onboarding and testing

---

## 📦 Tech Stack

- **Node.js**, **TypeScript**, **Express**
- **PostgreSQL** (Knex.js)
- **BullMQ** (Redis-backed queue)
- **Redis** for job management

---

## 🔐 API Security

All endpoints (except `/api/health` and `/docs`) require a valid API key to be passed in the `x-api-key` header.

- To test via Swagger, click the **Authorize** button and enter your API key (`X_API_KEY` from `.env`)
- For manual testing (e.g., Postman or curl), include the header:

```http
x-api-key: super_secret_value
```

---

## 🧪 Sample Webhook Registration Payload

```json
{
  "target_url": "https://jsonplaceholder.typicode.com/posts",
  "payload": {
    "event": "order.placed",
    "data": {
      "order_id": "ORD-1234",
      "amount": 499,
      "currency": "INR"
    }
  },
  "headers": {
    "Authorization": "Bearer abc123",
    "Content-Type": "application/json"
  },
  "meta": {
    "source": "checkout-service",
    "project_id": "project-xyz789"
  },
  "retry_config": {
    "max_attempts": 3,
    "initial_delay_ms": 5000,
    "backoff_strategy": "exponential"
  }
}
```

## 🔌 Available Endpoints

| Method | Endpoint                     | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| POST   | `/api/webhooks`              | Register and trigger a webhook |
| GET    | `/api/webhooks/:id/attempts` | List all delivery attempts     |
| GET    | `/api/webhooks/:id/status`   | Get current delivery status    |
| GET    | `/api/health`                | Health check endpoint          |
| GET    | `/docs`                      | Swagger API Documentation      |

## 📖 API Documentation

Interactive API docs are available at `/docs`. This includes schemas, request/response formats, and testable endpoints via Swagger UI.

```
http://localhost:3000/docs
```

> 🔐 **Note**: All API endpoints (except `/health` and `/docs`) are protected via an `x-api-key` header. Use the `Authorize` button in Swagger to test authenticated endpoints.

# 🛠 Setup

### 1. Clone and Install

```bash
git clone https://github.com/nikhilnkataria/hookspot.git
cd hookspot
npm install
```

### 2. Configure Environment Variables

Create a `.env` file using the template below:

```env
PORT=3000
X_API_KEY=super_secret_value
REDIS_URL=redis://localhost:6379
RETRY_QUEUE_NAME=hookspot-delivery
DLQ_QUEUE_NAME=hookspot-delivery-dlq
POSTGRES_URL=postgres://user:password@localhost:5432/hookshot
```

### 3. Create Database tables using Knex Migrations

```bash
npx knex --knexfile knexfile.ts migrate:latest
```

### 4. Start Services

Start the main API:

```bash
npm run dev
```

After starting the server, visit `http://localhost:3000/docs` to explore the API using Swagger UI.

## ☠️ Dead Letter Queue (DLQ)

Jobs that fail after all retry attempts go into the DLQ. You can:

- Log/alert for manual investigation
- Replay later (future feature)
- Monitor via RedisInsight or BullMQ Dashboard

## 📊 Coming Soon (Optional Enhancements)

- Dashboard UI (React/Next.js)
- DLQ Replay API
- Custom Retry Strategies
- Role-based Auth for Admin APIs

## 👨‍💻 Author

Built by [Nikhil Kataria](https://www.linkedin.com/in/nikhilnkataria) —
Engineering Manager | Node.js | AWS | Scalable Systems

- 🔗 Portfolio: [nikhilkataria.com](https://nikhilkataria.com)
- 💼 LinkedIn: [linkedin.com/in/nikhilnkataria](https://www.linkedin.com/in/nikhilnkataria)
- 💻 GitHub: [github.com/nikhilnkataria](https://github.com/nikhilnkataria)

## 🛡 License

MIT
