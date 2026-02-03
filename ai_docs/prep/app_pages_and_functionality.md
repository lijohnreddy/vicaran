# App Pages & Functionality Blueprint

## App Summary

**App Name:** Vicaran
**End Goal:** Help journalists investigate stories faster with AI-powered research
**Core Value Proposition:** Multi-agent AI pipeline with recursive gap-driven search, source credibility scoring, and atomic fact-checking
**Target Users:** Journalists, researchers
**Template Type:** ADK-Agent-SaaS
**Business Model:** Free (Hackathon Demo)

---

## 🌐 Public Pages

### Landing Page — `/`
- Display app name and tagline (Frontend)
- Display login/signup buttons (Frontend)
- Redirect authenticated users to Home (Frontend)

### Legal Pages
- **Privacy Policy** — `/privacy`
- **Terms of Service** — `/terms`

### Authentication — `/login`
- Google OAuth sign-in button (Frontend)
- Create/update user session on success (Backend)
- Redirect to Home on success (Frontend)

---

## ⚡ Core Application Pages

### Home Page — `/home`
- Display welcome message (Frontend)
- Display "New Investigation" CTA button (Frontend)
- Display recent investigations as quick links (Frontend)
- Fetch user's recent investigations (Backend)

### Investigation Setup Page — `/investigations/new`

**Purpose:** Configure investigation before starting

- Investigation title input (required) (Frontend)
- Investigation brief textarea (describe what to investigate) (Frontend)
- Add Source button → opens popup to add initial URLs (Frontend)
- Display list of added sources (Frontend)
- Mode selector: Quick Search (10 min) / Detailed Inquiry (20 min) (Frontend)
- Start Investigation button (Frontend)
- Create investigation record with sources (Backend)
- Redirect to Investigation Workspace (Frontend)
- Trigger AI agent pipeline with user sources as priority (Background Job)

### Investigation Workspace — `/investigations/[investigationId]`

**Layout:** Two columns (Chat + Canvas)

#### Left Column: Chat Interface
- Display agent conversation with real-time SSE updates (Frontend)
- Display progress indicator (Frontend)
- User message input with **+ button on left** (Frontend)
- Send messages to agent (Backend)
- **+ button** → opens Add Source popup (Frontend)
- Export PDF button in header (Frontend)

#### Add Source Popup (Shared Component)
- URL input field (Frontend)
- Add button to submit URL (Frontend)
- Display validation feedback (Frontend)
- Save source to investigation (Backend)
- Queue source for agent analysis (Background Job)

#### Source Priority Logic
- **Initial sources (from setup):** Analyzed first before web search
- **Mid-investigation sources:** Added to queue, processed after current step

#### Right Column: Canvas (3 Tabs)

**Brief Tab:**
- Auto-updating summary of findings (Frontend)
- Updates in real-time as agent processes (Frontend)

**Dashboard Tab:**
- **Sources Section:** List with 5-star credibility ratings (Frontend)
- **Claims Section:** Status icons (✅ Verified / ❓ Unverified) (Frontend)
- **Fact Checks Section:** Evidence supporting/contradicting each claim (Frontend)
- **Bias Analysis Section:** Detected bias indicators, framing comparison (Frontend)
- **Timeline Section:** Chronological visualization of events (Frontend)
- **Audit Trail Section:** Logged verification steps with timestamps (Frontend)

**Graph Tab (Claim Evidence Network):**
- Interactive network visualization using React Flow (Frontend)
- Source nodes (left) connected to claim nodes (right) (Frontend)
- Color-coded status: green/yellow/red for verified/investigating/disputed (Frontend)
- Drag nodes to reposition, click for details panel (Frontend)
- Zoom/pan controls With fit-to-viewport button (Frontend)

#### Background Processing (AI Agents)
- Source discovery with credibility scoring (Background Job)
- Recursive gap-driven search (Background Job)
- Claim extraction from sources (Background Job)
- Atomic fact checking against multiple sources (Background Job)
- Bias and framing analysis (Background Job)
- Timeline extraction (Background Job)
- Wayback Machine fallback for unavailable URLs (Background Job)
- Stream updates via SSE (Backend)

### Investigation History — `/investigations`
- Display searchable list of user's investigations (Frontend)
- Filter by status (Active, Completed) (Frontend)
- Filter by mode (Quick Search, Detailed Inquiry) (Frontend)
- Sort by date (Frontend)
- Click to open investigation (Frontend)
- Delete investigation with confirmation (Frontend + Backend)

### Profile — `/profile`
- Display user info (name, email from Google) (Frontend)
- Sign out button (Frontend + Backend)

---

## 📱 Navigation Structure

### Sidebar (Responsive)
```
┌──────────────────────┐
│  VICARAN             │  ← Logo
├──────────────────────┤
│  [+ New Investigation]│  ← Primary CTA
├──────────────────────┤
│  History             │  ← Recent investigations
│   ├─ Investigation 1 │
│   ├─ Investigation 2 │
│   └─ View All →      │
├──────────────────────┤
│  ┌────────────────┐  │
│  │ 👤 User Name   │  │  ← Profile
│  └────────────────┘  │
└──────────────────────┘
```

### Mobile Navigation
- Hamburger menu opens sidebar overlay
- Touch-optimized interface

---

## 🔧 Next.js App Router Structure

### Layout Groups
```
app/
├── (public)/          # Landing, legal pages
├── (auth)/            # Login flow
├── (app)/             # Authenticated application
└── api/               # Backend endpoints
```

### Complete Route Mapping

**🌐 Public Routes**
- `/` → Landing page
- `/privacy` → Privacy policy
- `/terms` → Terms of service

**🔐 Auth Routes**
- `/login` → Google OAuth sign-in

**🛡️ Protected Routes**
- `/home` → Home dashboard
- `/investigations` → Investigation history
- `/investigations/new` → Investigation setup page
- `/investigations/[investigationId]` → Investigation workspace
- `/profile` → User profile

**🔧 API Routes**
- `/api/auth/google` → Google OAuth callback
- `/api/auth/logout` → Logout endpoint
- `/api/investigations/[id]/stream` → SSE endpoint for agent updates
- `/api/agent/webhook` → Agent callback webhook

### Server Actions
- `app/actions/investigations.ts` → CRUD, status updates
- `app/actions/agents.ts` → Trigger pipelines, process messages
- `app/actions/sources.ts` → Add sources, validate URLs
- `app/actions/export.ts` → PDF generation

### Lib Queries
- `lib/queries/investigations.ts` → Investigation data access
- `lib/queries/sources.ts` → Sources data access
- `lib/queries/claims.ts` → Claims data access

### Architecture Flow
```
Internal Operations:
Frontend → Server Actions → Lib Queries → Database

External Services (ADK Agent):
Frontend → /api/investigations/[id]/stream → ADK Agent (Python)

Webhooks:
ADK Agent → /api/agent/webhook → Server Actions → Lib Queries → Database
```

---

## 🎯 MVP Functionality Summary

**Phase 1 (Hackathon):**
- Google OAuth authentication
- Investigation workflow (setup → research → verification → export)
- Two-column workspace (Chat + Canvas)
- Multi-agent AI pipeline with 6 features
- PDF export
- Investigation history
- Mobile responsive

**Phase 2 (Post-Hackathon):**
- Admin features
- Team collaboration
- Markdown export
- Advanced analytics

---

> **Next Step:** Ready for wireframe design
