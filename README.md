# LeadFlow

> Lead Management Platform built for the Digital Heroes Training Task.

LeadFlow is a full-stack application for capturing and managing leads. It allows visitors to submit project enquiries, Members to work with available and assigned leads, and Admins to manage the overall lead workflow.

## Live Project

- **Frontend:** https://lead-flow-snowy-two.vercel.app/
- **Backend:** https://leadflow-7wvj.onrender.com

## What the Application Does

A visitor can submit a project enquiry without creating an account.

After a lead is created:

```text
Project Enquiry
      ↓
Lead Created
      ↓
Member Requests Lead
      ↓
Admin Approves / Rejects
      ↓
Lead Assigned
      ↓
Follow-up, Status, Notes & Activity
```

### Admin

Admins can:

- View and manage leads
- Assign leads to Members
- Review Member lead requests
- Approve or reject requests
- Update lead information where permitted
- View notes and activity
- Create Member and Admin accounts
- View their profile

### Member

Members can:

- View available active leads
- Request a lead from an Admin
- See their request status
- Work with leads assigned to them
- Update the status of permitted leads
- Add notes
- View lead activity
- View their profile

Members cannot directly assign leads to themselves or use Admin-only functionality.

## Authentication & RBAC

LeadFlow uses JWT authentication and role-based access control.

There are two roles:

- `Admin`
- `Member`

The frontend shows functionality according to the logged-in user's role, while the backend middleware performs the actual authorization checks.

## Backend Architecture

The backend follows:

```text
Route → Controller → Service → Model
```

- **Routes** define API endpoints and middleware.
- **Controllers** handle requests and responses.
- **Services** contain business logic.
- **Models** handle MongoDB data.

Validation is handled with Zod, and authentication/RBAC is handled through middleware.

## Tech Stack

### Frontend

- React + Vite
- Redux Toolkit
- React Router
- Axios
- React Hook Form
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- Zod
- JWT
- bcryptjs
- Jest + Supertest

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB

## Project Structure

```text
LeadFlow/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── validators/
│   └── tests/
│
└── Frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── redux/
    │   ├── routes/
    │   └── styles/
    └── vercel.json
```

## Main API Functionality

The backend provides APIs for:

- Registration and login
- Logout and session authentication
- Public lead creation
- Lead listing and details
- Pagination and filtering
- Lead status updates
- Lead assignment
- Notes and activity
- Lead requests
- Admin approval/rejection
- User/account management

The route files inside `Backend/src/routes/` contain the exact API endpoints.

## Local Setup

### Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
JWT_EXPIRY=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run:

```bash
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

## Testing

Backend tests use Jest and Supertest.

```bash
cd Backend
npm test
```

Current result:

```text
24 / 24 tests passing
```

The application was also manually tested for registration, login, Admin/Member permissions, lead creation, lead requests, assignment, status updates, notes, activity, logout, protected routes, and production deployment.

## Design

The frontend uses a clean, modern light theme inspired by the Digital Heroes visual style.

The interface uses Inter typography, warm cream backgrounds, white surfaces, dark green text, muted green accents, responsive layouts, and lightweight micro-animations.

The goal was to keep the dashboard clean and practical for regular use rather than making it visually heavy.

## Deployment

**Frontend:**  
https://lead-flow-snowy-two.vercel.app/

**Backend:**  
https://leadflow-7wvj.onrender.com

Production secrets and database credentials are stored as environment variables and are not included in the repository.

---

Built by **Satwaj** for the **Digital Heroes Training Task**.
