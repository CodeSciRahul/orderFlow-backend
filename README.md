# OrderFlow Backend

A production-style backend built using **Node.js, Express.js, TypeScript, MongoDB, and Mongoose**. The project follows a layered architecture to keep the code organized and easy to maintain as the application grows.

## Setup + run locally

```bash
npm install

# copy environment variables
cp .env.example .env

# start development server
npm run dev
```

Base API URL:

```
http://localhost:5000/api/v1
```

## Environment variables

These are the env vars used by the backend:

- **`NODE_ENV`**: `development | production | test`
- **`PORT`**: HTTP port (default `5000`)
- **`API_VERSION`**: API version string (default `v1`)
- **`MONGODB_URI`**: MongoDB connection string (**required**)
- **`CORS_ORIGIN`**: allowed frontend origin(s)
- **`LOG_LEVEL`**: morgan log level (e.g. `dev`)
- **`SCHEDULER_API_KEY`**: API key required for `POST /scheduler/execute`
- **`SCHEDULER_CRON_ENABLED`**: enables internal cron runner (`true|false`)

---

# Project Structure

The backend is divided into different layers so that each part has a single responsibility.

* **app.ts** – Configures Express, middlewares, routes and global error handling.
* **server.ts** – Connects to MongoDB and starts the server.
* **routes/** – Defines all API routes.
* **controllers/** – Handles incoming requests and sends responses.
* **services/** – Contains business logic.
* **repositories/** – Responsible for database operations.
* **models/** – Mongoose schemas and models.
* **dto/** – Request and response DTOs.
* **interfaces/** – Shared TypeScript interfaces.
* **validators/** – Request validation using express-validator.
* **middlewares/** – Authentication, validation and error handling middleware.
* **cron/** – Scheduler related code.
* **utils/** – Utility functions and reusable helpers.
* **constants/** – Shared constants used across the project.

---

# Database Used

I used **MongoDB** with **Mongoose**.

The main reason was that the data structure is fairly document-based and MongoDB works really well for this type of application. It also makes it easy to store order history and scheduler logs in separate collections while still keeping development simple.

---

# Collections

The project uses three collections:

* **orders** – Stores all order details.
* **order_status_histories** – Stores every status change of an order.
* **scheduler_execution_logs** – Stores information about every scheduler execution.

---

# Order Status History

Instead of updating the status without any record, every status change creates a new document inside the `order_status_histories` collection.

For example, if an order moves from **PLACED** to **PROCESSING**, a new history record is created with the previous status, new status and timestamp.

This way it's easy to see the complete lifecycle of any order later.

---

# Scheduler Logs

Whenever the scheduler runs, it creates a log entry.

The log stores information like:

* Start time
* End time
* Number of orders checked
* Number of updated orders
* Failed updates (if any)
* Total execution time

This can also be used later for monitoring or showing scheduler history on the dashboard.

---

# Preventing Duplicate Orders

Duplicate orders are handled in two ways.

First, the `orderId` field has a unique index in MongoDB so duplicate IDs cannot be inserted.

Secondly, while creating a new order, a unique order ID is generated and checked before saving. If by chance the generated ID already exists, a new one is generated again.

---

# Handling Race Conditions

For this assignment I added some basic protection.

Inside the scheduler, only one execution is allowed at a time using an `isRunning` flag, so the same scheduler doesn't start multiple times in a single server instance.

For updating order status, I used MongoDB's atomic `findOneAndUpdate()` operation so individual document updates stay safe.

If this application grows and multiple backend instances are running, then I'd probably move to a distributed locking mechanism like Redis or simply use AWS EventBridge with a single scheduler to avoid duplicate executions.

---

# Scalability

A few things were added keeping scalability in mind.

* Database indexes are created on frequently queried fields like order status and payment status.
* Status history is stored separately instead of embedding everything inside the order document.
* Since the API is stateless, multiple backend instances can be added if needed.
* Pagination and searching can easily be added later without changing the overall architecture.

For a larger production system, I would also introduce caching and a distributed scheduler.

---

# Scheduler setup (runs every 5 minutes)

The project currently supports two ways of running the scheduler.

### 1. Internal Cron

Uses **node-cron** to execute the scheduler every five minutes.

This works well for local development and small deployments where only one backend instance is running.

To enable/disable it:

```bash
# .env
SCHEDULER_CRON_ENABLED=true
```

### 2. External Scheduler

A protected API endpoint is also available:

```
POST /api/v1/scheduler/execute
```

This endpoint requires a scheduler API key and can be triggered using services like:

* AWS EventBridge Scheduler
* GitHub Actions
* Render Cron Jobs
* Railway Cron Jobs

Example:

```bash
curl -X POST "http://localhost:5000/api/v1/scheduler/execute" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_SCHEDULER_API_KEY" \
  -d "{}"
```

For a real production environment, I would personally prefer **AWS EventBridge Scheduler** because it is more reliable than running cron jobs inside the application. It also avoids problems when the backend is scaled to multiple instances.

---

## API documentation (quick)

All responses follow this shape:

```json
{ "success": true, "message": "Success", "data": {} }
```

### Health
- **GET** `/api/v1/health`

### Orders
- **POST** `/api/v1/orders`

Request body:

```json
{
  "customerName": "Jane Doe",
  "phoneNumber": "+919876543210",
  "productName": "Smart Watch Series 5",
  "amount": 15999
}
```

- **GET** `/api/v1/orders?status=placed`
  - `status` is optional and must be one of the allowed order statuses.

### Order status history
- **GET** `/api/v1/order-status-history/:orderId`
  - Returns a list of status transitions for an order.

### Scheduler logs
- **GET** `/api/v1/scheduler-execution-logs`
  - Optional query params: `executionStatus`, `fromDate`, `toDate`
- **GET** `/api/v1/scheduler-execution-logs/last`
- **GET** `/api/v1/scheduler-execution-logs/:id`

---

## Postman collection

A ready-to-import Postman collection is included:
- `postman/OrderFlow.postman_collection.json`
