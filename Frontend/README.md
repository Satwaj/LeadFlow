# LeadFlow Frontend

React/Vite frontend for the LeadFlow lead management platform.

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set:

```env
VITE_API_URL=http://localhost:5000/api
```

## Implemented

- Public lead capture form using the real backend `POST /api/leads`.
- HTTP-only cookie auth through Axios `withCredentials`.
- Protected dashboard shell with session restoration via `GET /api/auth/me`.
- Admin/Member role-based UI.
- Server-side lead filtering and pagination.
- Lead detail workflows: status update, Admin-only assignment, notes, and activity.
- Light theme based on Digital Heroes visual foundations.

JWTs are never stored in frontend storage.
