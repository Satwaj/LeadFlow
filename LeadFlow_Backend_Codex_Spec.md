# LeadFlow Backend --- Codex Implementation Specification

## 1. Goal

Build the **backend only** for `LeadFlow`, a small production-style lead
management application for the Digital Heroes Full Stack Development
(Role 04) qualification task.

The backend must support:

-   Public lead capture
-   Admin and Member authentication
-   Server-side authorization
-   Lead assignment
-   Lead status lifecycle
-   Timestamped notes
-   Activity/audit trail
-   Pagination and filtering
-   Correct HTTP status codes
-   Request validation
-   Centralized error handling
-   Automated API/auth tests
-   Deployment readiness

Keep the project intentionally simple. Do **not** add Redis, queues,
microservices, WebSockets, GraphQL, Docker, Kubernetes, AI features,
notifications, or unnecessary abstractions.

------------------------------------------------------------------------

# 2. Tech Stack

Use:

-   Node.js
-   Express.js
-   MongoDB Atlas
-   Mongoose
-   JWT
-   HTTP-only cookies
-   bcrypt
-   Zod
-   cookie-parser
-   CORS
-   dotenv
-   Jest
-   Supertest
-   ES Modules

------------------------------------------------------------------------

# 3. Architecture

Use a strict four-layer architecture:

``` text
Route
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

Full request flow:

``` text
HTTP Request
    ↓
Validation Middleware
    ↓
Authentication Middleware
    ↓
Role/Access Authorization
    ↓
Controller
    ↓
Service
    ↓
Mongoose Model
    ↓
MongoDB
```

## Route responsibility

Routes only define:

-   HTTP method
-   endpoint
-   middleware chain
-   controller function

**No business logic and no Mongoose queries inside routes.**

## Controller responsibility

Controllers:

-   read `req.body`
-   read `req.params`
-   read `req.query`
-   call service functions
-   return HTTP response

Controllers must remain thin.

## Service responsibility

Services contain:

-   business logic
-   ownership rules
-   authorization decisions specific to leads
-   database operations
-   filtering/pagination logic
-   activity creation
-   assignment logic
-   status transition logic

## Model responsibility

Models contain:

-   Mongoose schemas
-   field validation
-   indexes
-   relationships
-   timestamps

------------------------------------------------------------------------

# 4. Folder Structure

``` text
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── lead.model.js
│   │   └── activity.model.js
│   │
│   ├── validators/
│   │   ├── auth.schema.js
│   │   └── lead.schema.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── lead.routes.js
│   │   └── index.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── lead.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   └── lead.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── auth.test.js
│   └── lead.test.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Do not create additional layers unless clearly necessary.

------------------------------------------------------------------------

# 5. Environment Variables

Create `.env.example`:

``` env
PORT=5000
MONGO_URI=mongodb_connection_string
JWT_SECRET=replace_with_long_random_secret
JWT_EXPIRY=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Never commit the real `.env`.

`env.js` should provide centralized access to environment configuration.

------------------------------------------------------------------------

# 6. Database Models

## User

File:

`src/models/user.model.js`

``` text
name
email
password
role
createdAt
updatedAt
```

Requirements:

``` text
name:
  String
  required
  trim

email:
  String
  required
  unique
  lowercase
  trim

password:
  String
  required
  select: false

role:
  enum ["admin", "member"]
  default "member"
```

Use Mongoose timestamps.

Hash passwords using bcrypt before storing them.

Never expose password hashes in API responses.

------------------------------------------------------------------------

## Lead

File:

`src/models/lead.model.js`

Fields:

``` text
name
email
phone
company
service
source
message
status
assignedTo
notes
createdAt
updatedAt
```

Schema rules:

``` text
name:
  String
  required
  trim

email:
  String
  required
  lowercase
  trim

phone:
  String
  optional

company:
  String
  optional

service:
  String
  required

source:
  String
  default "website"

message:
  String
  optional

status:
  enum [
    "New",
    "Contacted",
    "Qualified",
    "Proposal",
    "Won",
    "Lost"
  ]
  default "New"

assignedTo:
  ObjectId
  ref User
  nullable
```

Notes should remain embedded because this is a small application:

``` text
notes: [
  {
    text: String,
    author: ObjectId ref User,
    createdAt: Date
  }
]
```

Use Mongoose timestamps.

Useful indexes may include:

-   `status`
-   `assignedTo`
-   `createdAt`

Avoid premature/unused indexes.

------------------------------------------------------------------------

## Activity

File:

`src/models/activity.model.js`

Activity is the audit trail.

Fields:

``` text
lead
action
performedBy
meta
createdAt
```

Schema:

``` text
lead:
  ObjectId
  ref Lead
  required

action:
  enum [
    "lead_created",
    "status_changed",
    "lead_assigned",
    "note_added"
  ]

performedBy:
  ObjectId
  ref User
  nullable
```

`performedBy` may be null for a lead created through the public form.

`meta` stores context.

Examples:

``` json
{
  "from": "New",
  "to": "Contacted"
}
```

or:

``` json
{
  "assignedTo": "USER_ID"
}
```

Create activity records from the **service layer**, not controllers.

------------------------------------------------------------------------

# 7. Authentication

Use JWT stored in an HTTP-only cookie.

Login flow:

``` text
POST /api/auth/login
        ↓
Validate input
        ↓
Find user including password
        ↓
bcrypt.compare()
        ↓
Generate JWT
        ↓
Set HTTP-only cookie
        ↓
Return safe user object
```

Cookie should be:

-   `httpOnly: true`
-   `secure: true` in production
-   appropriate `sameSite` configuration for the deployment setup

Do not expose JWT through normal response JSON if using cookie
authentication.

------------------------------------------------------------------------

# 8. Authentication vs Authorization

Authentication answers:

> Who is this user?

Authorization answers:

> Is this user allowed to perform this action?

Both must be implemented server-side.

Frontend hiding buttons later is only UX and must never be considered
security.

------------------------------------------------------------------------

# 9. Roles

Two roles:

``` text
admin
member
```

## Admin permissions

Admin can:

-   view every lead
-   view individual leads
-   assign leads
-   change lead status
-   add notes
-   view activity
-   create Member/Admin accounts

## Member permissions

Member can:

-   view only leads assigned to them
-   view details only for leads assigned to them
-   change status only for leads assigned to them
-   add notes only to leads assigned to them
-   view activity only for leads assigned to them

Member cannot:

-   assign leads
-   create users
-   access another member's lead
-   manipulate query parameters to see another member's leads

This restriction must be enforced by the backend.

For example, if a member requests:

``` text
GET /api/leads?assignedTo=SOME_OTHER_USER_ID
```

ignore/reject that ownership filter and ensure the effective query only
returns:

``` text
assignedTo = req.user._id
```

------------------------------------------------------------------------

# 10. Authentication Middleware

`auth.middleware.js` should:

1.  Read JWT from cookie.
2.  Reject missing token with `401`.
3.  Verify token.
4.  Find corresponding user.
5.  Reject invalid/nonexistent user.
6.  Set safe user information on `req.user`.
7.  Continue.

------------------------------------------------------------------------

# 11. Role Middleware

Create reusable authorization middleware such as:

``` js
authorizeRoles("admin")
```

Use it for routes such as:

``` text
POST /api/auth/register
PATCH /api/leads/:id/assign
```

Ownership rules for individual leads should still be enforced in the
service layer.

------------------------------------------------------------------------

# 12. API Endpoints

Base:

``` text
/api
```

## Authentication

### POST `/api/auth/login`

Public.

Body:

``` json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Success:

`200`

Sets authentication cookie.

------------------------------------------------------------------------

### POST `/api/auth/logout`

Authenticated.

Clears authentication cookie.

Success:

`200`

------------------------------------------------------------------------

### GET `/api/auth/me`

Authenticated.

Returns current safe user information.

Success:

`200`

------------------------------------------------------------------------

### POST `/api/auth/register`

Admin only.

Body:

``` json
{
  "name": "Team Member",
  "email": "member@example.com",
  "password": "strong-password",
  "role": "member"
}
```

Success:

`201`

Duplicate email:

`409`

Do not provide public self-registration.

------------------------------------------------------------------------

# 13. Lead API

## POST `/api/leads`

**Public --- no authentication required.**

This is the public capture endpoint.

Example:

``` json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "9999999999",
  "company": "ABC Technologies",
  "service": "Web Development",
  "source": "website",
  "message": "We need a new company website."
}
```

On success:

1.  Create lead with status `New`.
2.  `assignedTo` remains null.
3.  Create `lead_created` Activity.
4.  Return `201`.

Do not expose internal information unnecessarily in the public response.

------------------------------------------------------------------------

## GET `/api/leads`

Authenticated.

Supports:

``` text
?page=1
&limit=10
&status=New
&assignedTo=USER_ID
```

Admin:

-   may view all leads
-   may filter by status
-   may filter by assigned user

Member:

-   always sees only leads assigned to `req.user._id`
-   may filter their leads by status
-   cannot use `assignedTo` to access someone else's data

Example response:

``` json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": {
    "leads": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

Default limit:

`10`

Set a reasonable maximum, e.g. `100`.

Sort newest first unless there is a strong reason otherwise.

------------------------------------------------------------------------

## GET `/api/leads/:id`

Authenticated.

Admin:

-   can view any lead

Member:

-   can only view an assigned lead

If member attempts to access another member's lead, return a consistent
safe response such as `403`.

Invalid/not-found ID should be handled cleanly.

------------------------------------------------------------------------

## PATCH `/api/leads/:id/status`

Authenticated.

Body:

``` json
{
  "status": "Contacted"
}
```

Allowed statuses:

``` text
New
Contacted
Qualified
Proposal
Won
Lost
```

Admin can update any lead.

Member can update only assigned leads.

On successful change:

1.  capture previous status
2.  update status
3.  create Activity:

``` json
{
  "action": "status_changed",
  "meta": {
    "from": "New",
    "to": "Contacted"
  }
}
```

Return updated lead.

------------------------------------------------------------------------

## PATCH `/api/leads/:id/assign`

**Admin only.**

Body:

``` json
{
  "assignedTo": "USER_ID"
}
```

Validate:

-   user exists
-   target user is an appropriate application user

Update lead.

Create `lead_assigned` activity.

Include useful previous/new assignment information in `meta`.

------------------------------------------------------------------------

## POST `/api/leads/:id/notes`

Authenticated.

Body:

``` json
{
  "text": "Customer requested a proposal by Friday."
}
```

Rules:

-   note cannot be blank
-   admin can add note to any lead
-   member only to assigned lead

Append:

``` text
{
  text,
  author: req.user._id,
  createdAt
}
```

Create `note_added` activity.

Do not store the full note text in activity metadata unless there is a
clear reason.

------------------------------------------------------------------------

## GET `/api/leads/:id/activity`

Authenticated.

Admin:

-   any lead

Member:

-   assigned lead only

Return activities newest-first or oldest-first consistently and document
the choice.

Populate safe actor information such as:

``` text
name
email
```

Never populate passwords.

------------------------------------------------------------------------

# 14. Validation

Use Zod.

Create schemas for at least:

-   login
-   register
-   public lead creation
-   status update
-   lead assignment
-   note creation
-   pagination/filter query parameters where useful

Validation middleware should return `400` with useful structured
details.

Example:

``` json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

Never trust frontend validation alone.

------------------------------------------------------------------------

# 15. Error Handling

Create:

`ApiError.js`

Support:

``` js
throw new ApiError(404, "Lead not found");
```

Create centralized:

`error.middleware.js`

Controllers/services should not duplicate repetitive `try/catch` blocks.

Use `asyncHandler`.

Production errors should not leak:

-   stack traces
-   Mongo connection strings
-   secrets
-   internal implementation details

------------------------------------------------------------------------

# 16. Response Shape

Use consistent JSON.

Success:

``` json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {}
}
```

Error:

``` json
{
  "success": false,
  "message": "Forbidden"
}
```

Do not unnecessarily wrap responses multiple times.

------------------------------------------------------------------------

# 17. HTTP Status Codes

Use meaningfully:

``` text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Examples:

``` text
No JWT → 401

Member tries admin assignment endpoint → 403

Lead doesn't exist → 404

Duplicate email → 409

Invalid status → 400
```

------------------------------------------------------------------------

# 18. CORS

Local development:

Frontend:

``` text
http://localhost:5173
```

Backend should:

-   allow only configured `CLIENT_URL`
-   enable `credentials: true`

Do not use wildcard origin with credentialed cookies.

Production should read the Vercel frontend origin from environment
configuration.

------------------------------------------------------------------------

# 19. Security Requirements

At minimum:

-   passwords hashed with bcrypt
-   passwords excluded from normal queries/responses
-   JWT secret only in environment variables
-   HTTP-only auth cookie
-   production secure cookie
-   strict CORS origin
-   request validation
-   server-side role checks
-   server-side ownership checks
-   `.env` ignored by Git

Avoid adding large security libraries unless needed for this assignment.

------------------------------------------------------------------------

# 20. Tests

Use Jest + Supertest.

Tests should verify behaviour, not implementation details.

At minimum implement these.

## Authentication tests

### Test 1

Correct credentials:

``` text
POST /api/auth/login
→ 200
→ authentication cookie exists
```

### Test 2

Wrong password:

``` text
POST /api/auth/login
→ 401
```

### Test 3

Unauthenticated request:

``` text
GET /api/leads
→ 401
```

------------------------------------------------------------------------

## Authorization tests

### Test 4

Member attempts assignment:

``` text
PATCH /api/leads/:id/assign
→ 403
```

### Test 5

Member attempts to access another member's lead:

``` text
GET /api/leads/:otherLeadId
→ 403
```

### Test 6

Member attempts status update on another member's lead:

``` text
PATCH /api/leads/:otherLeadId/status
→ 403
```

------------------------------------------------------------------------

## Core flow tests

### Test 7

Public lead creation works without authentication:

``` text
POST /api/leads
→ 201
```

Verify corresponding `lead_created` Activity exists.

### Test 8

Admin assigns lead:

``` text
PATCH /api/leads/:id/assign
→ 200
```

Verify:

-   `assignedTo` changed
-   activity created

### Test 9

Assigned member changes status:

``` text
New → Contacted
```

Verify:

-   status changed
-   activity has correct `from` and `to`

### Test 10

Assigned member adds note:

Verify:

-   note saved
-   author correct
-   timestamp exists
-   activity created

More tests are welcome if useful, but do not chase meaningless coverage
percentages.

------------------------------------------------------------------------

# 21. Test Database

Tests must not operate on the production database.

Use a clearly separate test database/configuration.

Ensure tests can run repeatedly without depending on existing production
data.

Clean test state appropriately between tests.

------------------------------------------------------------------------

# 22. App and Server Separation

`app.js`:

-   creates Express app
-   configures JSON parser
-   cookie parser
-   CORS
-   routes
-   404 handling
-   error middleware

Do not call `listen()` here.

`server.js`:

-   connects database
-   starts server
-   handles startup failure

This separation makes API testing easier because Supertest can import
the Express app without starting a real network listener.

------------------------------------------------------------------------

# 23. README Requirements

Backend README must explain:

## Project

What LeadFlow does.

## Architecture

Explain:

``` text
Route → Controller → Service → Model
```

and why business logic is kept in services.

## Tech Stack

List backend technologies.

## Local Setup

Commands to:

1.  install dependencies
2.  configure `.env`
3.  start development server
4.  run tests

## Environment Variables

Document every required variable without exposing real values.

## API Contract

Create a table:

  Method   Endpoint   Authentication   Role   Description
  -------- ---------- ---------------- ------ -------------

Document all endpoints.

## Authorization Rules

Clearly explain Admin vs Member.

## Testing

Explain what the automated tests cover.

## Deployment

Explain required production environment variables and CORS/cookie
considerations.

------------------------------------------------------------------------

# 24. Seed / Initial Admin

Because `/register` is admin-only, provide a simple safe way to create
the first admin for development/deployment.

Preferred simple approaches:

-   one-time seed script, or
-   documented manual seed process

Do **not** leave an unprotected production endpoint for creating the
first admin.

Example eventual demo accounts:

``` text
Admin:
admin@leadflow.demo

Member:
member@leadflow.demo
```

Do not hardcode real passwords into the Git repository.

------------------------------------------------------------------------

# 25. Implementation Order

Codex should implement this backend incrementally.

## Phase 1 --- Foundation

Create:

-   package.json
-   folder structure
-   env config
-   DB connection
-   Express app
-   server
-   basic error utilities

Then verify the server starts.

## Phase 2 --- User/Auth

Implement:

-   User model
-   auth validation
-   auth service
-   auth controller
-   login
-   logout
-   `/me`
-   admin registration
-   JWT middleware
-   role middleware
-   initial admin seeding strategy

Verify authentication before continuing.

## Phase 3 --- Leads

Implement:

-   Lead model
-   public lead validation
-   public lead creation
-   lead listing
-   pagination
-   filtering
-   lead detail

Verify using API requests.

## Phase 4 --- Lifecycle

Implement:

-   Activity model
-   assignment
-   status update
-   notes
-   activity retrieval
-   ownership checks

Verify Admin/Member behaviour.

## Phase 5 --- Tests

Implement the required Jest/Supertest tests.

Fix actual bugs revealed by tests.

## Phase 6 --- Documentation/cleanup

Complete:

-   README
-   `.env.example`
-   scripts
-   API documentation
-   remove dead code
-   check secrets
-   ensure consistent responses

------------------------------------------------------------------------

# 26. Important Coding Rules for Codex

Follow these strictly:

1.  Do not put business logic in routes.
2.  Do not put Mongoose queries in controllers.
3.  Controllers must be thin.
4.  Services own business logic.
5.  Never rely on frontend permissions for security.
6.  Member ownership must be checked server-side.
7.  Never return password hashes.
8.  Never commit secrets.
9.  Validate all externally supplied data.
10. Use centralized error handling.
11. Use meaningful HTTP status codes.
12. Avoid unnecessary abstraction.
13. Prefer readable code over clever code.
14. Do not add features outside this specification without asking.
15. Keep the code understandable to a junior developer who needs to
    explain it in an interview.

------------------------------------------------------------------------

# 27. Explicit Non-Goals

Do NOT implement:

``` text
Docker
Kubernetes
Redis
BullMQ
Kafka
RabbitMQ
WebSockets
Microservices
GraphQL
AI assistant
Email notifications
SMS
Payment gateway
File uploads
Complex analytics
Charts
OAuth
Refresh-token architecture
Event sourcing
CQRS
```

These are outside the assignment scope.

------------------------------------------------------------------------

# 28. Definition of Done

Backend is complete only when:

-   [ ] Express server starts correctly
-   [ ] MongoDB connects
-   [ ] first admin can be safely seeded
-   [ ] admin can log in
-   [ ] member can log in
-   [ ] logout works
-   [ ] `/auth/me` works
-   [ ] public visitor can create a lead
-   [ ] lead-created activity is generated
-   [ ] admin sees all leads
-   [ ] member sees only assigned leads
-   [ ] pagination works
-   [ ] status filtering works
-   [ ] admin can assign leads
-   [ ] member cannot assign leads
-   [ ] assigned member can update status
-   [ ] unassigned/wrong member cannot update status
-   [ ] notes work
-   [ ] notes have author and timestamp
-   [ ] activity trail works
-   [ ] ownership restrictions work for detail/activity endpoints
-   [ ] validation returns useful errors
-   [ ] correct HTTP status codes are used
-   [ ] centralized error handling works
-   [ ] required automated tests pass
-   [ ] `.env` is not committed
-   [ ] `.env.example` exists
-   [ ] README documents API and architecture
-   [ ] backend is ready for frontend integration

------------------------------------------------------------------------

# 29. Instructions to Codex

Treat this file as the backend source of truth.

Do not attempt to generate the entire project in one uncontrolled step.

Work phase-by-phase in this order:

``` text
Foundation
→ Auth
→ Lead CRUD/read APIs
→ Lifecycle/Activity
→ Authorization verification
→ Tests
→ Documentation
```

At the end of each phase:

1.  summarize files created/changed
2.  explain the important architecture decisions
3.  state how to test that phase
4.  stop and wait for review before making large architectural changes

If this specification contains an ambiguity, choose the simplest
solution that preserves security, correctness, and the four-layer
architecture.

Do not silently expand project scope.
