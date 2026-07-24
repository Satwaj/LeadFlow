# LeadFlow — Lead & Project Management Platform

> Built for Digital Heroes Training Task · Created by Satwaj

LeadFlow is a full-stack Lead Management & Opportunity Tracking Platform built with Node.js, Express, MongoDB, React, Redux Toolkit, and Tailwind CSS. It features public lead enquiry capture, role-based access control (RBAC), an Admin approval workflow for lead requests, assigned lead feed isolation, and activity timeline tracking.

---

## 🚀 Key Features

### 1. 📩 Public Conversion & Enquiry Capture
- **Landing & Conversion Page (`/`)**: High-converting project enquiry form with interactive capability cards and workflow timeline.
- **Mandatory Field Validation**: Frontend (React Hook Form) and Backend (Zod schema) validation requiring `Name`, `Email`, `Phone`, `Company`, `Service`, `Source`, and `Project Message`.

### 2. 👥 Role-Based Access Control (RBAC)
- **Admin Role**:
  - View all leads across the entire pipeline.
  - Manually assign leads directly to any team member.
  - Access Admin Lead Request Approval Dashboard (`/app/lead-requests`).
  - Create and manage member and admin user accounts (`/app/create-user`).
- **Member Role**:
  - View active unassigned leads and request them (`[Request Lead]`).
  - View assigned leads in their personal workspace.
  - Track request status (`Pending`, `Approved`, `Rejected`).
  - Update status (`Contacted`, `Qualified`, `Proposal`, `Won`, `Lost`) and add internal notes **only** for assigned leads.
  - **Feed Isolation**: Assigned leads appear **only** in the assigned Member's feed and are automatically hidden from other Members.

### 3. 🔄 Lead Request & Approval Workflow
```
[Member requests unassigned lead] ➡️ [Status: Pending] ➡️ [Admin reviews request]
                                                               ├── [Approve] ➡️ Lead assigned to Member
                                                               └── [Reject]  ➡️ Lead remains available ([Request Again] enabled)
```
- Real-time request status indicators on lead details and leads table.
- Automatic rejection of conflicting requests when a lead is approved for a member.
- Descriptive activity timeline logging (e.g. `Assigned to satwaj by ankur`).

### 4. 🔒 Authentication & Cross-Domain Security
- JWT authentication with dual cookie support (`httpOnly`, `sameSite: "none"`, `secure`) and `Authorization: Bearer <token>` header fallback.
- Global session restoration on app startup (`App.jsx`), preserving session across page refreshes on `/`, `/login`, or `/app/dashboard`.
- Vercel SPA routing fallback (`Frontend/vercel.json`) to prevent 404 errors on page refresh.

---

## 🛠️ Tech Stack

### Frontend (`/Frontend`)
- **Core**: React 19, Vite, JavaScript (ES6+)
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`)
- **Routing**: React Router 7 (`react-router-dom`)
- **Form & Validation**: React Hook Form
- **Styling & UI**: Tailwind CSS v4, Framer Motion, Lucide React Icons

### Backend (`/Backend`)
- **Runtime**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod schema validation
- **Authentication**: JSON Web Token (`jsonwebtoken`), `cookie-parser`, `bcryptjs`
- **Testing**: Jest & Supertest (24/24 tests passing)

---

## 📁 Project Structure

```text
LeadFlow/
├── Backend/
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── controllers/     # Auth, Lead, and LeadRequest controllers
│   │   ├── middlewares/     # Auth, RBAC, error handling, Zod validation
│   │   ├── models/          # User, Lead, LeadRequest, Activity Mongoose models
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Service layer logic
│   │   └── validators/      # Zod validation schemas
│   └── tests/               # Jest integration test suite
│
└── Frontend/
    ├── src/
    │   ├── api/             # Axios instance & API client modules
    │   ├── components/      # Layout, Auth, Lead, and Common UI components
    │   ├── pages/           # Landing, Auth, Dashboard, Lead, Profile pages
    │   ├── redux/           # Redux store & slices (auth, lead, leadRequest)
    │   ├── routes/          # AppRoutes & ProtectedRoute
    │   └── styles/          # Global CSS tokens & custom utilities
    └── vercel.json          # Vercel SPA rewrite configuration
```

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or MongoDB Atlas connection string)

### 1. Clone & Setup Backend
```bash
cd Backend
npm install
```

Create `.env` file in `Backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leadflow
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Run backend dev server:
```bash
npm run dev
```

Run backend tests:
```bash
npm test
```

### 2. Setup Frontend
```bash
cd ../Frontend
npm install
```

Create `.env` file in `Frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend dev server:
```bash
npm run dev
```

---

## 🌐 Production Deployment

- **Backend (Render / Railway)**:
  - Environment variable: `CLIENT_URL=https://lead-flow-snowy-two.vercel.app`
- **Frontend (Vercel)**:
  - Environment variable: `VITE_API_URL=https://leadflow-7wvj.onrender.com/api`
  - Includes `vercel.json` SPA rewrite configuration.

---

## 📄 License
This project is created for **Digital Heroes Training Task**. Built by **Satwaj**.
