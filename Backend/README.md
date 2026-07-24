# LeadFlow Backend

LeadFlow is a backend API for public lead capture and authenticated lead management by Admin and Member users.

## Architecture

The backend follows `Route → Controller → Service → Model`.

- Routes only define endpoints and middleware chains.
- Controllers read request data, call services, and send responses.
- Services own business logic, database operations, authorization decisions, pagination, assignment, status transitions, notes, and activity logging.
- Models define Mongoose schemas, relationships, indexes, and timestamps.

## Tech Stack

Node.js, Express.js, MongoDB, Mongoose, JWT, HTTP-only cookies, bcryptjs, Zod, cookie-parser, CORS, dotenv, Jest, and Supertest.

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Run tests:

```bash
npm test
```

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb_connection_string
JWT_SECRET=replace_with_long_random_secret
JWT_EXPIRY=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For tests, set `TEST_MONGO_URI` if you want tests to use a different MongoDB database than `MONGO_URI`.

For one-time admin seeding, set `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD`, and optionally `INITIAL_ADMIN_NAME`, then run:

```bash
npm run seed:admin
```

## API Contract

| Method | Endpoint | Authentication | Role | Description |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | Public | Any | Login and set HTTP-only auth cookie |
| POST | `/api/auth/logout` | Required | Admin/Member | Clear auth cookie |
| GET | `/api/auth/me` | Required | Admin/Member | Return current user |
| GET | `/api/auth/users` | Required | Admin | List safe users for assignment |
| POST | `/api/auth/register` | Required | Admin | Create Admin or Member user |
| POST | `/api/leads` | Public | Any | Public lead capture |
| GET | `/api/leads` | Required | Admin/Member | List leads with pagination and filters |
| GET | `/api/leads/:id` | Required | Admin/Member | Get one lead |
| PATCH | `/api/leads/:id/status` | Required | Admin/Member | Update lead status |
| PATCH | `/api/leads/:id/assign` | Required | Admin | Assign a lead |
| POST | `/api/leads/:id/notes` | Required | Admin/Member | Add lead note |
| GET | `/api/leads/:id/activity` | Required | Admin/Member | Get lead activity newest-first |

## Authorization Rules

Admin users can view all leads, assign leads, change status, add notes, view activity, and create users. Member users can only view and modify leads assigned to them. Member ownership is enforced in backend services and cannot be bypassed with query parameters.

## Testing

Automated tests cover successful login, failed login, unauthenticated lead listing, public lead creation, Admin assignment, Member assignment rejection, Member cross-lead access rejection, assigned Member status updates, notes, and activity logging.

## Deployment

Set production `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRY`, `CLIENT_URL`, and `NODE_ENV=production`. In production, cookies use `secure: true` and `sameSite: "none"`, so deploy behind HTTPS and configure `CLIENT_URL` to the exact frontend origin. Do not use wildcard CORS with credentialed cookies.
