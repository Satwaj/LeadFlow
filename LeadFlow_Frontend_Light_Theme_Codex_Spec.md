# LeadFlow Frontend --- Light Theme Implementation Specification

> **Purpose:** This document is the frontend source of truth for Codex.
> Build only what is needed for the LeadFlow qualification task and what
> the existing backend supports. Prioritize correctness, role-based UX,
> API integration, responsiveness, and a clean daily-use interface over
> extra features.

------------------------------------------------------------------------

# 1. What We Are Building

`LeadFlow` is a small lead-management application with two sides:

``` text
PUBLIC SIDE
Visitor
  ↓
Lead enquiry form
  ↓
POST /api/leads
  ↓
Lead enters the system


INTERNAL SIDE
Admin / Member
  ↓
Login
  ↓
Dashboard / Leads
  ↓
Lead details
  ↓
Status + Assignment + Notes + Activity
```

This is **not** a large CRM.

The frontend should prove that we can correctly consume the backend,
handle authentication and roles, present the lead lifecycle clearly, and
create a professional deployed product.

## Core frontend goals

The application must make these workflows excellent:

1.  A visitor can submit a lead without logging in.
2.  Admin and Member can log in.
3.  Authenticated users can see the leads they are permitted to see.
4.  Leads can be filtered and paginated.
5.  A lead can be opened and understood quickly.
6.  Lead status can be updated.
7.  Admin can assign leads.
8.  Members must not see Admin-only assignment controls.
9.  Users can add timestamped notes.
10. Users can review the activity trail.
11. Loading, error, empty, and permission states are handled properly.
12. The application works on desktop and mobile.

Everything else is secondary.

------------------------------------------------------------------------

# 2. Scope Discipline

## Must build

``` text
Public Lead Form
Login
Protected application shell
Dashboard
Lead list
Pagination
Status filtering
Lead details
Status update
Admin assignment
Notes
Activity trail
Logout
Role-based UI
Responsive layout
Loading / empty / error states
Required footer credit
```

## Build only if the backend actually supports it

``` text
User/team list
Admin create-member UI
Search
Assigned-user filtering
Extra dashboard counts
```

Do not fake these features if the backend does not expose the required
API.

## Do not build for this submission

``` text
AI
File uploads
Dark mode
Theme switcher
Chat
Notifications system
Email integration
Calendar
Kanban board
Drag and drop
Advanced analytics
Large chart dashboard
CRM automation
Payment features
Profile customization
Complex settings
3D graphics
Heavy animation
```

A smaller complete application is preferable to an unfinished large one.

------------------------------------------------------------------------

# 3. Backend Is the Source of Truth

Before implementing API integration, Codex must inspect the existing
backend.

The expected backend architecture is:

``` text
Route
  ↓
Controller
  ↓
Service
  ↓
Model
```

The frontend must not duplicate backend business rules.

Expected backend concepts:

``` text
User
Lead
Activity
```

Expected roles:

``` text
admin
member
```

Expected lead lifecycle from the backend specification:

``` text
New
Contacted
Qualified
Closed
Lost
```

**Important:** Do not invent frontend-only statuses such as `Proposal`
or `Won` unless the actual backend has been changed to support them.

The frontend must use the exact enum and API contract implemented by the
backend.

------------------------------------------------------------------------

# 4. Expected Backend API

Inspect the real implementation first, but the frontend is designed
around this contract:

  ---------------------------------------------------------------------------
  Method                  Endpoint                    Frontend use
  ----------------------- --------------------------- -----------------------
  POST                    `/api/auth/login`           Login

  POST                    `/api/auth/logout`          Logout

  POST                    `/api/auth/register`        Admin creates user,
                                                      only if UI is needed

  POST                    `/api/leads`                Public lead form

  GET                     `/api/leads`                Lead list +
                                                      pagination/filtering

  GET                     `/api/leads/:id`            Lead details

  PATCH                   `/api/leads/:id/status`     Update status

  PATCH                   `/api/leads/:id/assign`     Admin assignment

  POST                    `/api/leads/:id/notes`      Add note

  GET                     `/api/leads/:id/activity`   Activity timeline
  ---------------------------------------------------------------------------

The backend specification may also expose a current-user endpoint such
as:

``` text
GET /api/auth/me
```

If it exists, use it for session restoration.

If it does not exist, do **not** silently invent it. Report the mismatch
and add the smallest backend endpoint necessary if session restoration
requires it.

------------------------------------------------------------------------

# 5. Authentication Rules

Backend authentication uses:

``` text
JWT
+
HTTP-only cookie
```

Axios must therefore use:

``` js
withCredentials: true
```

Never store the JWT in:

``` text
localStorage
sessionStorage
Redux
```

Redux may store safe session information:

``` text
user
role
isAuthenticated
loading status
error
```

The browser cookie is managed by the backend/browser.

Frontend authorization is only for UX.

Backend authorization remains mandatory.

------------------------------------------------------------------------

# 6. Admin vs Member UX

## Admin

Admin may:

``` text
See all leads
Filter leads according to backend support
Open lead details
Update lead status
Assign a lead
Add notes
View activity
Create users if that frontend workflow is included
```

## Member

Member should:

``` text
See only backend-authorized assigned leads
Open permitted lead details
Update permitted lead status
Add notes
View activity
```

Member must **not see**:

``` text
Assign lead control
Admin-only user creation
Admin-only navigation
Irrelevant admin filters
```

Do not simply disable the assignment button.

Hide it for Members.

------------------------------------------------------------------------

# 7. Frontend Tech Stack

Use:

``` text
React 19
Vite
React Router
Redux Toolkit
Axios
Tailwind CSS
React Hook Form
Lucide React
Inter
```

Do not add a large component library.

Build a small reusable component layer ourselves.

------------------------------------------------------------------------

# 8. Folder Structure

``` text
frontend/
├── public/
│
├── src/
│   ├── api/
│   │   ├── axiosInstance.js
│   │   ├── authApi.js
│   │   └── leadApi.js
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ErrorState.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── MobileNav.jsx
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── auth/
│   │   │   └── LoginForm.jsx
│   │   │
│   │   └── leads/
│   │       ├── LeadTable.jsx
│   │       ├── LeadMobileList.jsx
│   │       ├── LeadFilters.jsx
│   │       ├── LeadOverview.jsx
│   │       ├── StatusControl.jsx
│   │       ├── AssignmentControl.jsx
│   │       ├── NotesPanel.jsx
│   │       └── ActivityTimeline.jsx
│   │
│   ├── pages/
│   │   ├── PublicLeadFormPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── LeadsPage.jsx
│   │   └── LeadDetailPage.jsx
│   │
│   ├── redux/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       └── leadSlice.js
│   │
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   └── AppRoutes.jsx
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── formatDate.js
│   │   └── getApiError.js
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── package.json
└── vite.config.js
```

Do not over-engineer the folder structure.

Create another file only when it has a clear responsibility.

------------------------------------------------------------------------

# 9. Visual Direction

Use the supplied Digital Heroes design extraction as a **visual
reference**, not a layout to clone.

The LeadFlow frontend should feel like:

``` text
Digital Heroes visual DNA
        +
clean SaaS application
        +
simple daily-use CRM
```

Use:

-   warm cream background
-   deep green-black text
-   muted green accents
-   white/light panels
-   thin borders
-   Inter
-   rounded controls
-   restrained shadows
-   strong spacing hierarchy
-   concise text

Do not copy:

-   giant HEROES lettering
-   rotating slogans
-   3D spheres
-   browser showcase graphics
-   floating marketing badges
-   WhatsApp widget
-   chat widget
-   audio button
-   promotional navigation
-   client-logo strips

------------------------------------------------------------------------

# 10. Light Theme --- Source Design Foundations

The supplied light-theme reference contains:

## Typography

``` text
font.family.primary = Inter
font.family.stack = Inter, system-ui, sans-serif
font.size.base = 17px
font.weight.base = 400
font.lineHeight.base = 28.05px
```

Original reference scale:

``` text
font.size.xs   = 10px
font.size.sm   = 11px
font.size.md   = 12px
font.size.lg   = 13px
font.size.xl   = 13.5px
font.size.2xl  = 13.6px
font.size.3xl  = 14px
font.size.4xl  = 16px
```

## Colors

``` text
color.text.primary   = #0f1713
color.text.secondary = #ffffff
color.border.muted   = #3f6b54
color.text.inverse   = #f5f0e8
color.surface.base   = #000000
color.surface.muted  = #fffcf5
color.border.default = #e5e7eb
```

Additional green from the source system:

``` text
#6fa37a
```

## Spacing

``` text
2px
4px
6px
8px
9.6px
10px
12px
14px
```

## Radius

``` text
6px
8px
12px
16px
24px
9999px
```

## Shadow

``` text
rgba(10, 10, 26, 0.08) 0px 6px 20px
```

## Motion

``` text
150ms
180ms
200ms
250ms
400ms
450ms
900ms
```

For LeadFlow, normal UI interaction should generally stay within:

``` text
150–250ms
```

------------------------------------------------------------------------

# 11. LeadFlow Semantic Design Tokens

Create semantic CSS variables in `globals.css`.

``` css
:root {
  --background: #fffcf5;

  --surface: #ffffff;
  --surface-muted: #f6f3eb;
  --surface-dark: #0f1713;

  --text-primary: #0f1713;
  --text-secondary: #56615b;
  --text-muted: #7b847f;
  --text-inverse: #f5f0e8;

  --brand: #3f6b54;
  --brand-hover: #345b47;
  --brand-secondary: #6fa37a;
  --brand-soft: #e4ede5;

  --border-default: #e5e7eb;
  --border-brand: #b8cdbd;

  --success: #327a4b;
  --success-soft: #dcf2e3;

  --warning: #9a6700;
  --warning-soft: #fef0c7;

  --danger: #b42318;
  --danger-soft: #fee4e2;

  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --shadow-soft: 0 6px 20px rgba(10, 10, 26, 0.08);

  --motion-fast: 180ms;
  --motion-normal: 200ms;
  --motion-slow: 250ms;
}
```

Components should consume semantic tokens rather than introducing random
colors.

------------------------------------------------------------------------

# 12. Practical Typography for LeadFlow

The source typography scale is compact.

For an actual application, adapt it while retaining Inter.

Use approximately:

``` text
Public hero heading      42–52px desktop
Public hero mobile       32–38px

Page title               26–30px
Section heading          16–18px
Card metric              24–28px

Body                     14–16px
Table                    14px
Input                    14–16px
Label                    12–14px
Metadata                 12px
```

Weights:

``` text
400 regular
500 medium
600 semibold
700 major heading only
```

Do not make authenticated pages look like marketing pages.

------------------------------------------------------------------------

# 13. Application Layout

Use a simple authenticated shell.

``` text
┌────────────────┬──────────────────────────────────────┐
│ LeadFlow       │ Header                               │
│                ├──────────────────────────────────────┤
│ Dashboard      │                                      │
│ Leads          │ Page content                         │
│                │                                      │
│                │                                      │
│                │                                      │
│ User / Role    │                                      │
│ Logout         │                                      │
└────────────────┴──────────────────────────────────────┘
```

Recommended:

``` text
Sidebar width: 220–240px
Content background: warm cream
Panels: white
Primary action: deep green
```

A dark green sidebar is allowed if it remains clean and accessible.

That gives us some Digital Heroes character without building a dark
theme.

------------------------------------------------------------------------

# 14. Sidebar

Keep navigation minimal:

``` text
LeadFlow

Dashboard
Leads

────────────

User Name
Admin / Member
Logout
```

If an Admin user-management screen becomes necessary later:

``` text
Users
```

may be added for Admin only.

Selected navigation item:

``` text
soft green background
deep green text
```

or, on a dark sidebar:

``` text
subtle green background
light text
```

Use Lucide icons.

Do not use icons without labels on desktop.

------------------------------------------------------------------------

# 15. Header

Keep it compact.

Example:

``` text
Dashboard                             Admin User
```

or:

``` text
Leads                                 John Doe · Admin
```

Do not duplicate the sidebar.

Do not add a global search field unless it is actually functional and
useful.

No theme toggle is required.

------------------------------------------------------------------------

# 16. Public Lead Form

This is the public lead-capture route and must work without
authentication.

It can borrow more strongly from the supplied Digital Heroes light
aesthetic.

Desktop concept:

``` text
┌─────────────────────────────────────────────────────────┐
│ LeadFlow                                                │
│                                                         │
│ Turn conversations       Tell us about your project     │
│ into opportunities.                                     │
│                          Name                           │
│ One short supporting     Email                          │
│ sentence.                Phone                          │
│                          Company                        │
│                          Source / service if supported  │
│                          Message if backend supports it │
│                          [ Submit enquiry ]             │
│                                                         │
│ Built for Digital Heroes Training Task                 │
└─────────────────────────────────────────────────────────┘
```

**Important:** The form fields must match the actual Lead model/backend
validation.

The original backend specification contains:

``` text
name
email
phone
company
source
status
assignedTo
notes
```

Therefore, do not invent a `message` or `service` field unless the
backend has been intentionally extended to support it.

A safe initial public form is:

``` text
Name *
Email *
Phone
Company
Source
```

If we want `message` or `service`, update the backend model/validation
deliberately first.

Submit CTA:

``` text
Submit enquiry
```

Success:

``` text
Thanks — your enquiry has been received.

Our team can now review your request.
```

------------------------------------------------------------------------

# 17. Login Page

Minimal:

``` text
LeadFlow

Welcome back
Sign in to manage your leads.

Email
Password

[ Sign in ]
```

Requirements:

-   visible labels
-   password input
-   keyboard submission
-   pending state
-   invalid credential error
-   no public registration link

------------------------------------------------------------------------

# 18. Dashboard

Keep Dashboard intentionally small.

Its purpose is orientation, not advanced analytics.

If counts can be derived cleanly from existing API data:

``` text
Dashboard
Overview of your lead pipeline.

┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Total       │ │ New         │ │ Qualified   │
│ 42          │ │ 12          │ │ 8           │
└─────────────┘ └─────────────┘ └─────────────┘

Recent Leads                                View all →

Name              Company             Status
Rahul Sharma      ABC Tech            New
Alex Morgan       XYZ Ltd             Qualified
```

Do not add fake numbers.

If backend pagination prevents reliable global counts, either:

-   use only information the API truly provides, or
-   keep Dashboard focused on recent leads.

No chart is required.

------------------------------------------------------------------------

# 19. Leads Page

This is the primary work page.

``` text
Leads

[ Status ▼ ]                  [ Assigned ▼ Admin, if supported ]

──────────────────────────────────────────────────────────
Name          Company        Status        Assigned
Rahul         ABC Tech       New           —
Alex          XYZ Ltd        Qualified     John
──────────────────────────────────────────────────────────

Showing 1–10 of 42             Previous    1 / 5    Next
```

Backend requirements already include:

``` text
?page=
?limit=
?status=
?assignedTo=
```

Use those exact query parameters where supported.

Do not implement frontend-only filtering over one page of data when the
backend already supports server-side filtering.

------------------------------------------------------------------------

# 20. Lead Table

Recommended desktop columns:

``` text
Name
Company
Status
Assigned To
Created
```

Optional:

``` text
Email
```

only if space remains readable.

Do not put every Lead field in the table.

Users can open details for the rest.

Row behavior:

-   subtle hover
-   click to open lead
-   keyboard-accessible navigation
-   no cluttered action buttons

------------------------------------------------------------------------

# 21. Mobile Lead List

Do not squeeze the desktop table onto mobile.

Use compact records:

``` text
Rahul Sharma                         New
ABC Technologies

rahul@example.com
Assigned: John

24 Jul 2026
```

The whole record may open the detail page.

------------------------------------------------------------------------

# 22. Lead Detail Page

This is the most important authenticated screen.

``` text
← Leads

Rahul Sharma                              [ Qualified ]
ABC Technologies

rahul@example.com
+91 99999 99999


┌─────────────────────────────┐  ┌─────────────────────────────┐
│ Lead Information            │  │ Management                  │
│                             │  │                             │
│ Email                       │  │ Status                      │
│ Phone                       │  │ [ Qualified ▼ ]            │
│ Company                     │  │                             │
│ Source                      │  │ Assigned To                │
│ Created                     │  │ [ John ▼ ]  ADMIN ONLY     │
└─────────────────────────────┘  └─────────────────────────────┘


┌─────────────────────────────┐  ┌─────────────────────────────┐
│ Notes                       │  │ Activity                    │
│                             │  │                             │
│ [ Write a note... ]         │  │ ● Status changed           │
│ [ Add note ]                │  │   New → Contacted           │
│                             │  │                             │
│ John · 2 hours ago          │  │ ● Lead assigned            │
│ Called customer...          │  │   to John                  │
└─────────────────────────────┘  └─────────────────────────────┘
```

On mobile:

``` text
Lead header
↓
Lead information
↓
Management
↓
Notes
↓
Activity
```

Do not hide these core features behind unnecessary tabs.

------------------------------------------------------------------------

# 23. Status Control

Use the exact backend enum:

``` text
New
Contacted
Qualified
Closed
Lost
```

Changing status calls:

``` text
PATCH /api/leads/:id/status
```

While saving:

-   disable the control
-   show pending feedback
-   prevent repeated updates

After success:

-   update displayed status
-   refresh/reconcile activity

After error:

-   preserve/revert to the last confirmed backend state
-   show a concise message

------------------------------------------------------------------------

# 24. Status Badge

Every status needs readable text.

Use restrained semantic treatment.

Example intent:

``` text
New         neutral
Contacted   subtle cool/neutral
Qualified   brand soft green
Closed      success green
Lost        soft danger
```

Never use color alone to communicate status.

------------------------------------------------------------------------

# 25. Assignment Control

Admin only.

Calls:

``` text
PATCH /api/leads/:id/assign
```

Member must not see this control.

Do not render:

``` text
disabled Assign dropdown
```

for Members.

Hide the component entirely.

The user list required for assignment must come from a real
backend-supported source.

If the backend currently has no endpoint for fetching assignable
Members, identify that integration gap rather than hardcoding users.

Add the smallest backend endpoint needed, if necessary.

------------------------------------------------------------------------

# 26. Notes

Lead notes already belong to the backend Lead model.

UI:

``` text
Notes

[ Add an internal note... ]

[ Add note ]


John Doe · 2 hours ago
Customer asked us to call again tomorrow.
```

Call:

``` text
POST /api/leads/:id/notes
```

Requirements:

-   note text required
-   loading state
-   prevent duplicate submission
-   show API error
-   clear input only after success
-   show author
-   show timestamp

Do not style notes like a chat application.

------------------------------------------------------------------------

# 27. Activity Timeline

Call:

``` text
GET /api/leads/:id/activity
```

Expected activities include:

``` text
status_changed
assigned
note_added
```

Example UI:

``` text
● Status changed
  New → Contacted
  John Doe · 2 hours ago

● Note added
  John Doe · Yesterday

● Lead assigned
  Assigned to John Doe
  Admin · 23 Jul
```

Use:

-   thin vertical line
-   small marker
-   strong action title
-   muted metadata

Keep it compact.

------------------------------------------------------------------------

# 28. Pagination

Pagination is a required backend capability and must be visible in the
frontend.

Use server-side pagination.

Example:

``` text
Showing 1–10 of 42

Previous      1 / 5      Next
```

Keep it simple.

Do not build a complex numbered pagination component unless needed.

When filters change, return to page 1.

------------------------------------------------------------------------

# 29. Filters

Required backend filters:

``` text
status
assignedTo
```

Frontend:

``` text
Status ▼
Assigned ▼    Admin only / where useful
```

Filter changes should request fresh backend data.

Do not fetch every lead and filter everything in React.

------------------------------------------------------------------------

# 30. Redux State

## authSlice

``` js
{
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null
}
```

Responsibilities:

``` text
login
logout
restore current session
```

## leadSlice

``` js
{
  items: [],
  selectedLead: null,
  activity: [],
  pagination: null,

  filters: {
    status: "",
    assignedTo: ""
  },

  status: "idle",
  error: null
}
```

Do not store form input in Redux.

Use React Hook Form/local state.

------------------------------------------------------------------------

# 31. API Layer

## axiosInstance.js

Use:

``` env
VITE_API_URL=http://localhost:5000/api
```

Configuration:

``` js
withCredentials: true
```

Do not hardcode API URLs inside pages/components.

## authApi.js

Expected functions:

``` text
login()
logout()
getCurrentUser() — only if backend supports /me
registerUser() — only if frontend needs it
```

## leadApi.js

Expected:

``` text
createLead()
getLeads()
getLeadById()
updateLeadStatus()
assignLead()
addLeadNote()
getLeadActivity()
```

Keep request details here rather than scattering Axios calls across UI
files.

------------------------------------------------------------------------

# 32. Routing

Recommended:

``` text
/                    PublicLeadFormPage
/login               LoginPage

/app/dashboard        DashboardPage
/app/leads            LeadsPage
/app/leads/:id        LeadDetailPage
```

If an Admin user page becomes necessary:

``` text
/app/users
```

ProtectedRoute must:

1.  determine whether session is authenticated
2.  show a loader during initial auth resolution
3.  render protected content only when authorized
4.  redirect unauthenticated users to `/login`

Do not briefly flash protected content.

------------------------------------------------------------------------

# 33. Common Components

Build a small shared component set:

``` text
Button
Input
Select
Textarea
StatusBadge
Pagination
Loader
EmptyState
ErrorState
```

Every interactive component must account for:

``` text
default
hover
focus-visible
active
disabled
loading
error where applicable
```

Do not build a giant design-system library.

Only build components LeadFlow actually needs.

------------------------------------------------------------------------

# 34. Button Design

## Primary

Use for:

``` text
Sign in
Submit enquiry
Add note
```

Visual:

``` text
deep green background
cream/white text
10–12px radius
```

## Secondary

Use for less important actions.

Visual:

``` text
white/light background
thin border
dark text
```

## Ghost

Use sparingly for:

``` text
Back
Clear filters
```

All buttons need visible focus.

Loading must not change the button width dramatically.

------------------------------------------------------------------------

# 35. Form Controls

Inputs should use:

``` text
white/light surface
#e5e7eb-style border
dark green-black text
muted placeholder
10–12px radius
brand green focus
```

Always use visible labels.

Bad:

``` text
[ Email address ]
```

with no label.

Good:

``` text
Email
[ you@example.com ]
```

------------------------------------------------------------------------

# 36. Loading States

Do not block the whole application for small mutations.

Use:

``` text
Initial authentication → app loader

Lead list loading → table/list loader

Status update → status control loading

Assignment → assignment control loading

Add note → button loading

Activity → local timeline loader
```

------------------------------------------------------------------------

# 37. Empty States

No leads:

``` text
No leads yet

New enquiries will appear here when someone submits the public form.
```

No filtered results:

``` text
No leads match these filters.

Clear filters
```

No notes:

``` text
No notes yet.
Add the first internal note for this lead.
```

------------------------------------------------------------------------

# 38. Error Handling

Never display raw stack traces.

Examples:

``` text
We couldn't load the leads.
Try again.
```

``` text
You don't have permission to access this lead.
```

``` text
Your session has expired. Please sign in again.
```

HTTP behavior:

``` text
400 → useful validation message
401 → session/login handling
403 → permission state; do not automatically log out
404 → lead not found
500 → generic retry message
```

------------------------------------------------------------------------

# 39. Responsive Design

Support:

``` text
320px+
768px+
1024px+
1440px+
```

Desktop:

``` text
sidebar
table
two-column detail sections
```

Mobile:

``` text
compact header/navigation
lead cards/list instead of wide table
stacked lead detail
wrapped filters
reachable pagination
full-width form controls where appropriate
```

Do not preserve desktop density at the cost of mobile usability.

------------------------------------------------------------------------

# 40. Accessibility

Target:

``` text
WCAG 2.2 AA
```

Must:

-   use semantic HTML
-   provide visible labels
-   provide visible focus states
-   support keyboard navigation
-   provide accessible names for icon buttons
-   avoid color-only meaning
-   meet text contrast requirements
-   associate errors with form controls
-   use `<button>` for actions
-   use `<nav>` for navigation
-   use `<th>` for table headers
-   remain usable at 200% zoom
-   provide reasonable touch target sizes

Do not remove focus outlines without an accessible replacement.

------------------------------------------------------------------------

# 41. Motion

Use motion only for interaction feedback.

Recommended:

``` text
180ms hover
200ms dropdown/control
250ms mobile navigation
```

Do not add:

``` text
page entrance animation
parallax
continuous floating
animated dashboard cards
3D
large marketing motion
```

------------------------------------------------------------------------

# 42. Footer Requirement

The public live build must visibly include:

``` text
Built for Digital Heroes Training Task
```

linked to the official Digital Heroes website.

Keep the footer subtle but readable.

------------------------------------------------------------------------

# 43. Implementation Order

Codex must implement in this order.

## Phase 1 --- Foundation

Create:

``` text
Vite project
Tailwind
Inter
globals.css
semantic light-theme tokens
router
Redux store
Axios instance
common UI components
```

Verify the visual foundation first.

## Phase 2 --- Authentication

Implement:

``` text
authApi
authSlice
LoginPage
ProtectedRoute
session restoration if backend supports it
logout
```

Test:

``` text
Admin login
Member login
wrong password
refresh
logout
```

## Phase 3 --- Application Shell

Implement:

``` text
DashboardLayout
Sidebar
Header
MobileNav
```

Verify desktop/mobile navigation.

## Phase 4 --- Lead List

Implement:

``` text
leadApi
leadSlice
LeadsPage
LeadFilters
LeadTable
LeadMobileList
Pagination
```

Test:

``` text
Admin list
Member list
pagination
status filter
assigned filter if supported
empty results
API error
```

## Phase 5 --- Lead Details

Implement:

``` text
LeadDetailPage
LeadOverview
StatusBadge
StatusControl
AssignmentControl
NotesPanel
ActivityTimeline
```

Test role differences carefully.

## Phase 6 --- Public Form

Implement:

``` text
PublicLeadFormPage
validation
submission
success state
error state
footer credit
```

Ensure it works with **no login**.

## Phase 7 --- Dashboard

Use real API information only.

Add:

``` text
small useful overview
recent leads
View all leads
```

Do not delay core functionality to build analytics.

## Phase 8 --- Final QA

Verify:

``` text
Admin
Member
public visitor
desktop
mobile
keyboard
loading
errors
empty states
401
403
404
long content
pagination
filters
refresh
```

------------------------------------------------------------------------

# 44. Backend Integration Checks Before Coding

Before Codex writes integration code, it must verify:

``` text
1. Exact API base path
2. Exact JSON response shape
3. Whether /api/auth/me exists
4. Exact Lead status enum
5. Exact public Lead validation fields
6. Pagination response format
7. Whether assignable users can be fetched
8. Cookie/CORS configuration
9. Whether notes come with lead detail or require another request
10. Activity response shape
```

If a mismatch exists between this frontend specification and the real
backend:

> the real backend implementation wins unless it fails the qualification
> requirements.

Report mismatches instead of silently inventing behavior.

------------------------------------------------------------------------

# 45. What Matters Most for This Task

Development priority:

``` text
1. Correct API integration
2. Authentication
3. Admin/Member role correctness
4. Lead lifecycle
5. Assignment
6. Notes
7. Activity
8. Pagination/filtering
9. Loading/error states
10. Responsive usability
11. Visual polish
12. Optional extras
```

Do not reverse this order.

A beautiful dashboard with broken authorization is a failed
implementation.

A simple dashboard with correct authorization, clean API usage, tests on
the backend, and reliable deployment is much stronger.

------------------------------------------------------------------------

# 46. Definition of Done

The frontend is complete when:

-   [ ] light theme uses the supplied Digital Heroes visual foundations
-   [ ] Inter is used consistently
-   [ ] no dark-mode system is required
-   [ ] public lead form works without authentication
-   [ ] public fields match backend model/validation
-   [ ] login works
-   [ ] HTTP-only cookie auth works
-   [ ] JWT is not stored in localStorage/sessionStorage
-   [ ] protected routes work
-   [ ] session refresh behavior works appropriately
-   [ ] Admin can see permitted leads
-   [ ] Member sees only backend-permitted leads
-   [ ] pagination works
-   [ ] status filter works
-   [ ] assignment filtering works if supported
-   [ ] lead detail works
-   [ ] status updates work
-   [ ] Admin assignment works
-   [ ] Member cannot see assignment control
-   [ ] notes work
-   [ ] activity trail works
-   [ ] dashboard uses real information
-   [ ] loading states exist
-   [ ] empty states exist
-   [ ] error states exist
-   [ ] 401 behavior is correct
-   [ ] 403 behavior is correct
-   [ ] desktop layout works
-   [ ] mobile layout works
-   [ ] keyboard navigation works
-   [ ] visible focus states exist
-   [ ] required Digital Heroes footer credit exists
-   [ ] no fake data remains
-   [ ] no unnecessary AI/file upload/analytics features were added

------------------------------------------------------------------------

# 47. Final Instruction to Codex

Treat this document as the frontend implementation guide.

Before coding, inspect the backend.

Do not generate the entire application blindly in one response.

Work phase by phase:

``` text
Foundation
→ Auth
→ App Shell
→ Lead List
→ Lead Detail
→ Public Form
→ Dashboard
→ QA
```

After every phase:

1.  list files created/changed
2.  explain the important implementation decisions
3.  explain exactly how to test it
4.  identify any backend/API mismatch
5.  stop before moving to unrelated work

The target is not:

> "the most feature-rich CRM possible."

The target is:

> **a small, correct, professional Lead Management Platform that clearly
> demonstrates full-stack architecture, authentication, permissions, API
> integration, and production-ready engineering judgment.**
