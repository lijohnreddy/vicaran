# Master Idea Document

## End Goal

Help journalists investigate stories faster with AI-powered research.

---

## Specific Problem

Journalists and researchers are stuck because manual research is time-consuming, sources are scattered across the web, and fact-checking requires verifying hundreds of claims individually, leading to:

- **2-4x longer investigation cycles** (weeks instead of days)
- **Missing important stories** because they can't check every source
- **Publishing mistakes** when facts slip through unverified
- **Exhaustion** from doing the same checking work over and over

---

## User Types

### Primary Users: Journalists & Researchers
- **Who:** Investigative journalists, freelance reporters, independent researchers, journalism students
- **Frustrations:**
  - Too many sources to check manually
  - Hard to know which sources are trustworthy
  - Facts slip through without verification
- **Urgent Goals:**
  - Complete investigations faster (days, not weeks)
  - Produce credible, defensible reports
  - Never miss an important source

---

## Business Model

**Free Tool** (Hackathon Demo)
- No billing or subscription for hackathon phase
- Focus on demonstrating value

---

## MVP Functionalities

### Investigation Setup
- Start investigation with topic, claim, or question
- Choose mode: Quick Search (10 min) or Detailed Inquiry (20 min)

### Workspace Layout (Two Columns)

**Left: Chat Interface**
- Real-time agent conversation with streaming updates
- Progress bar with estimated time
- Send instructions to agent
- Quick actions: Add Source, Export

**Right: Canvas (3 Tabs)**

**Brief Tab:**
- Auto-updating summary of findings

**Dashboard Tab:**
- Sources with 5-star credibility ratings
- Claims with status (✅ Verified / ❓ Unverified)
- Fact checks with evidence links
- Bias analysis (simplified: overall score for MVP)
- Timeline visualization (Detailed mode only)

**Graph Tab:**
- Interactive claim-evidence network using React Flow
- Source nodes connected to claim nodes
- Drag to reposition, click for details
- Visual verification status (green/yellow/red)

### Export
- Markdown, PDF export
- Citation chain
- Methodology document

### History
- View past investigations
- Filter by status, mode, date
- Delete investigations

---

## Key User Stories

### Journalist/Researcher
1. *As a* journalist, *I want* to enter a topic and start an investigation, *so that* the AI begins gathering sources.
2. *As a* researcher, *I want* to select Quick Search or Detailed Inquiry mode, *so that* I get results matching my time.
3. *As a* journalist, *I want* to see sources appear in chat and dashboard live, *so that* I can track progress.
4. *As a* researcher, *I want* to see which claims are verified vs unverified, *so that* I know what needs attention.
5. *As a* journalist, *I want* to see evidence for each claim, *so that* I can assess credibility.
6. *As a* journalist, *I want* to export my investigation as Markdown or PDF, *so that* I can publish findings.

### System/Background
1. When investigation starts → search web and gather sources with credibility scores
2. When sources gathered → extract verifiable claims
3. When claims extracted → verify each claim against multiple sources
4. When agent processes → stream updates to chat and dashboard via SSE

---

## Value-Adding Features

### MVP Core (Hackathon)
1. **Source Credibility Scoring** - 5-star ratings based on domain reputation
2. **Atomic Fact Checking** - Every claim verified with evidence links
3. **Bias Analysis (Simplified)** - Overall bias score per source
4. **Timeline Visualization** - Auto-extract dates (Detailed mode only)

### Post-Hackathon Enhancements
1. **Recursive Gap-Driven Search** - AI identifies missing info and auto-searches to fill gaps
2. **Wayback Machine Fallback** - Recover content from unavailable URLs
3. **Advanced Bias & Framing Analysis** - Compare how sources present same facts
4. **Audit Trail** - Logged verification steps with timestamps
5. **Mid-Investigation Source Addition** - User adds URLs during active investigation

---

## Hackathon Info

- **Event:** Gemini 3 Global Hackathon
- **Track:** Deep Research
- **Deadline:** February 10, 2026
- **Demo:** Deep dive on a company/person
