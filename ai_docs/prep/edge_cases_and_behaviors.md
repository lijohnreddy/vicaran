# Edge Cases & Behavior Specifications

> Supplemental spec addressing gaps in the plan blueprint

---

## 1. Error & Edge Case Handling

### Agent Failure Mid-Investigation
**Behavior**: Show investigation as "Failed" status with partial data preserved
- User sees: "Investigation encountered an error. Partial results are available."
- All data collected before failure remains visible in dashboard tabs
- User can view what was gathered and optionally start a new investigation
- *No auto-retry for MVP* (simplicity for hackathon)

### API Rate Limits (Tavily, Gemini)
**Behavior**: Graceful degradation with user notification
- Agent catches rate limit errors and posts to chat: "⚠️ Temporarily paused due to API limits. Retrying in 30 seconds..."
- 3 automatic retries with exponential backoff (30s, 60s, 120s)
- After 3 failures → mark investigation as "Failed"

### Unreachable Source URLs
**Behavior**: Track as failed and continue
- Log in chat: "⚠️ Could not access [URL] - marked as failed"
- **Source IS added to database** with `status = 'failed'`
- Investigation continues with remaining sources
- Post-hackathon: Wayback fallback attempts before marking as failed

### Source Status in Dashboard (📰 Sources Tab)
**Visual Indicators**:
| Status | Color | Description |
|--------|-------|-------------|
| `analyzed` | Default (white/gray) | Successfully gathered and analyzed |
| `failed` | 🔴 Red background/border | Could not access URL |
| `pending` | 🟡 Yellow/muted | Queued for analysis (user-provided mid-investigation) |

**UI Behavior**:
- Failed sources show at bottom of list
- Tooltip on hover: "Could not access this URL"
- URL still clickable (user can verify themselves)
- Does not contribute to source count in investigation stats

---

## 2. Chat → Agent Message Flow

### User Messages During Active Investigation
**MVP Behavior**: Chat is **read-only during active investigation**
- User can view agent messages streaming in
- Message input is disabled with placeholder: "Agent is investigating..."
- User can add sources via the "+" button (queued for processing)

**Rationale**: Simplifies agent logic significantly for hackathon. The agent follows the pipeline without needing to handle interrupts.

**Post-Hackathon Enhancement**: Allow user guidance messages at natural breakpoints between pipeline stages.

---

## 3. Progress Indicator

### Implementation: Stage-Based Progress
**MVP Approach**: Status text in chat + stage indicator in header

**Stage Display** (shown in workspace header):
```
Step 2/6: Extracting claims from sources...
```

**Stages**:
1. Gathering sources
2. Extracting claims
3. Verifying facts
4. Analyzing bias
5. Building timeline
6. Writing summary

**Chat Messages**: Agent posts natural updates like:
- "🔍 Found 12 relevant sources. Analyzing credibility..."
- "📝 Extracted 8 claims. Beginning verification..."
- "✅ Investigation complete!"

**No progress bar for MVP** - stage text is sufficient and cleaner.

---

## 4. Mode Differences: Quick vs Detailed

| Aspect | Quick Search (~10 min) | Detailed Inquiry (~20 min) |
|--------|------------------------|---------------------------|
| **Source Count** | 10-15 sources | 20-30 sources |
| **Claim Verification** | Top 5 claims only | All extracted claims |
| **Bias Analysis** | Overall score only | Per-source scores |
| **Timeline** | Disabled (skipped) | Enabled |
| **Summary Depth** | Brief (2-3 paragraphs) | Comprehensive (5+ paragraphs) |

**Implementation**: Mode passed to agent as parameter; each sub-agent checks mode to adjust behavior.

**These are soft targets** - agent proceeds with what it can find within reason.

---

## 5. Audit Logs Alignment

### Decision: **Defer to Post-Hackathon (Phase 9)**

**Rationale**:
- Audit logs are "nice to have" for transparency but not core to demo value
- Dashboard already shows sources, claims, fact-checks (implicit audit)
- Saves ~1 day of development time for higher-priority features

**Update Required**: Remove "Audit trail with timestamps" from MVP Functionalities in `master_idea.md` (line 69) and move to Phase 2 features.

**Simplified Alternative** (if time permits): Just log `started` and `completed` events with timestamps in the `investigations` table itself (no separate audit_logs table).

---

## Summary of Decisions (Edge Cases)

| Gap | Decision |
|-----|----------|
| Error handling | Show "Failed" status, preserve partial data, 3 retries for rate limits |
| Chat messages | Read-only during investigation for MVP |
| Progress indicator | Stage-based text (Step X/6) in header + chat updates |
| Mode differences | Source count, claim depth, bias detail, timeline toggle |
| Audit logs | Defer to Phase 9 (post-hackathon) |

---

# Agent Workflow Specification

> Complete flow from investigation start to completion

---

## 6. Investigation Start & Plan Approval

### Step 1: User Submits Investigation
User provides:
- Title (required)
- Brief/description (required)
- Initial sources (optional URLs)
- Mode selection (Quick Search / Detailed Inquiry)

### Step 2: Analyze User-Provided Sources (if any)
**Before showing plan**, agent:
- Fetches content from user-provided URLs
- Analyzes basic credibility
- Extracts initial context about the topic

### Step 3: Present Investigation Plan
Agent generates a plan based on mode and shows it to user:

```
📋 **Investigation Plan**

Based on your brief about "Company XYZ environmental practices":

**Mode:** Detailed Inquiry (~20 min)

**I will:**
1. 🔍 Search 3-5 query variations to find 20-30 sources
2. 📝 Extract all verifiable claims from sources
3. ✓ Verify each claim against multiple sources
4. ⚖️ Analyze bias (per-source scores)
5. 📅 Build timeline of events
6. 📄 Write comprehensive summary

**Your sources analyzed:**
• reuters.com/... (Credibility: ⭐⭐⭐⭐⭐)
• nytimes.com/... (Credibility: ⭐⭐⭐⭐☆)

[✅ Approve & Start] [✏️ Edit Brief]
```

### Step 4: Wait for User Approval
- **Approve & Start**: Agent proceeds with investigation
- **Edit Brief**: User modifies, agent regenerates plan

---

## 7. Source Discovery Flow

### Step 1: Generate Search Queries
Agent creates **3-5 search queries** from user's brief:
```
🔍 Generating search queries...

1. "Company XYZ environmental violations 2024"
2. "Company XYZ sustainability report"
3. "Company XYZ pollution lawsuit"
4. "Company XYZ environmental criticism news"
```

### Step 2: Execute Web Searches
**Show queries to user** (builds trust):
```
🔍 Searching: "Company XYZ environmental violations 2024"...
🔍 Searching: "Company XYZ sustainability report"...
```

### Step 3: Process Results
- Each query returns ~5-10 URLs with snippets
- Deduplicate across all queries
- Filter low-quality domains

### Step 4: Extract Content & Score Credibility
- Fetch full content (Tavily extract or Jina Reader)
- Score credibility based on domain reputation
- Failed URLs → status = 'failed', continue with others

### Step 5: Save All Sources (Batch)
**Sources appear all at once** in dashboard after search completes:
```
✅ Found 18 sources (2 failed to load)

📊 Avg credibility: 4.1★
🔴 2 sources marked as failed

View all sources in the Dashboard →
```

---

## 8. Claim Extraction

### Behavior: Batch Display
- Claims extracted in **single LLM call**
- All claims appear **at once** in dashboard

### Chat Message:
```
📝 Extracted 8 claims from your sources

Top claims to verify:
• "Company reported $2B revenue in Q3 2024"
• "CEO announced expansion plans in March"
• "Environmental fine issued in June"

Beginning verification...
```

### Mode Differences:
| Mode | Claims Extracted |
|------|-----------------|
| Quick | Top 5-10 claims |
| Detailed | All claims (15-20) |

---

## 9. Fact Checking

### Behavior: Summary in Chat, Details in Dashboard

### Chat Message (after completion):
```
✓ Fact checking complete

**Results:**
• ✅ 5 claims verified
• ❓ 2 claims unverified (insufficient evidence)
• ❌ 1 claim contradicted

View detailed evidence in Dashboard → Fact Checks tab
```

### Dashboard (Fact Checks Tab):
- Full evidence for each claim
- Supporting/contradicting source quotes
- Links to original sources

---

## 10. Post-Investigation Interaction

### Completion Message:
```
✅ Investigation Complete!

**Key Findings:**
• 18 sources analyzed (avg credibility: 4.1★)
• 8 claims extracted → 5 verified, 2 unverified, 1 contradicted
• Overall bias score: 3.2/10 (low bias)

📊 View full details in the Dashboard →
📄 Export your report using the PDF button

---
💬 You can now ask questions about specific sources or findings.
```

### Post-Completion Chat:
- Chat input **re-enabled** after investigation completes
- User can ask questions like:
  - "Tell me more about the Reuters source"
  - "Why was the CEO resignation claim contradicted?"
  - "Which sources mentioned the lawsuit?"
- Agent responds using investigation data as context

---

## 11. Agent Personality

### Communication Style:
- **Friendly and professional**
- **Use emojis** to indicate stages: 🔍 📝 ✓ ⚖️ 📅 ✅
- Keep messages **scannable** (bullet points, short paragraphs)

### Example Messages:
```
🔍 Starting investigation on "Company XYZ"...

📋 Here's my plan based on your brief...

🔍 Searching: "Company XYZ environmental violations 2024"...

✅ Found 18 sources! Analyzing credibility...

📝 Extracted 8 claims. Verifying now...

✓ Fact checking complete! 5/8 claims verified.

✅ Investigation complete! Check the Dashboard for full details.
```

---

## 12. Complete Investigation Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER STARTS INVESTIGATION                     │
│         (Title + Brief + Optional Sources + Mode)               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              ANALYZE USER-PROVIDED SOURCES (if any)              │
│                  Fetch content, basic credibility                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENT PLAN TO USER                          │
│              Based on mode + initial sources                     │
│                                                                  │
│              [✅ Approve]     [✏️ Edit]                          │
└─────────────────────────────────────────────────────────────────┘
                              │ (User approves)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SOURCE DISCOVERY                            │
│                                                                  │
│  1. Generate 3-5 search queries                                 │
│  2. Show queries to user                                        │
│  3. Execute searches (Tavily)                                   │
│  4. Deduplicate & filter                                        │
│  5. Extract content & score credibility                         │
│  6. Save all sources (batch) → Dashboard                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CLAIM EXTRACTION                            │
│                                                                  │
│  Extract claims from source content                             │
│  Show all claims at once → Dashboard                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       FACT CHECKING                              │
│                                                                  │
│  Verify each claim against sources                              │
│  Summary in chat, details in Dashboard                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BIAS ANALYSIS                               │
│                                                                  │
│  Quick: Overall score only                                      │
│  Detailed: Per-source breakdown                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TIMELINE (Detailed only)                    │
│                                                                  │
│  Extract dates from sources                                     │
│  Build chronological view                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUMMARY WRITING                             │
│                                                                  │
│  Quick: 2-3 paragraphs                                          │
│  Detailed: 5+ paragraphs                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   INVESTIGATION COMPLETE                         │
│                                                                  │
│  Show key findings in chat                                      │
│  Enable chat for questions                                       │
│  User can export PDF                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

> **This document covers edge cases (sections 1-5), agent workflow (sections 6-12), and technical specifications (sections 13-19).**

---

# Technical Specifications

> Detailed implementation guidance for agent system

---

## 13. Failure Recovery

### Claim Extraction Failure
**Behavior**: Mark as partial and continue

| Scenario | Action |
|----------|--------|
| Source content extraction fails | Mark source as `failed`, skip it |
| LLM call fails for one source | Log error, continue with other sources |
| Entire claim extraction step fails | Mark as partial, proceed to fact-checking with available claims |

**Chat Message**:
```
⚠️ Couldn't fully analyze 2 sources - continuing with 16 others
```

**Implementation**:
```python
try:
    claims = extract_claims(source)
    save_claims(claims)
except Exception as e:
    log_error(f"Claim extraction failed for {source.url}: {e}")
    # Continue with next source - don't break pipeline
    continue
```

### Recovery Data:
- All successful extractions saved immediately to DB
- Failed sources marked with `status = 'failed'` and `error_message`
- Investigation continues with available data

---

## 14. Source Prioritization

### When more sources found than mode allows (e.g., 50 found, need 15):

**Scoring Algorithm**:
```
composite_score = (relevance × 0.4) + (authority × 0.4) + (recency × 0.2)
```

| Factor | Weight | Source |
|--------|--------|--------|
| **Relevance** | 40% | Tavily search API relevance score |
| **Authority** | 40% | Domain reputation tier (see below) |
| **Recency** | 20% | Days since publication (fresher = higher) |

**Domain Authority Tiers**:
| Tier | Score | Examples |
|------|-------|----------|
| Tier 1 | 5.0 | reuters.com, apnews.com, bbc.com, nytimes.com |
| Tier 2 | 4.0 | cnn.com, theguardian.com, washingtonpost.com |
| Tier 3 | 3.0 | Major regional news, industry publications |
| Tier 4 | 2.0 | Medium, Substack, known blogs |
| Tier 5 | 1.0 | Unknown domains, social media |

**Implementation**:
```python
def prioritize_sources(sources, mode):
    max_sources = 15 if mode == 'quick' else 30
    
    for source in sources:
        source.composite_score = (
            source.relevance * 0.4 +
            get_authority_score(source.domain) * 0.4 +
            get_recency_score(source.published_date) * 0.2
        )
    
    sorted_sources = sorted(sources, key=lambda s: s.composite_score, reverse=True)
    return sorted_sources[:max_sources]
```

---

## 15. Error Escalation

### API Failure Fallback Chain:

```
┌─────────────────────────────────────────────────────────────────┐
│                    TAVILY SEARCH FAILS                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               Retry with exponential backoff (3x)               │
│                    30s → 60s → 120s                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                        Still fails?
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              USE USER-PROVIDED SOURCES ONLY                     │
│                                                                  │
│  Chat: "⚠️ Web search unavailable. Analyzing your              │
│         provided sources only."                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    No user sources?
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  INVESTIGATION FAILED                           │
│                                                                  │
│  Chat: "❌ Could not gather sources. Please try again later    │
│         or provide source URLs to analyze."                     │
│                                                                  │
│  Status: 'failed'                                               │
└─────────────────────────────────────────────────────────────────┘
```

**Gemini API Failure**:
- Same retry pattern (3x with backoff)
- After 3 failures → mark investigation as 'failed'
- Partial data preserved

---

## 16. State Management

### Investigation State Tracking

**Add `current_phase` enum to investigations table**:
```sql
CREATE TYPE investigation_phase AS ENUM (
    'plan_pending',      -- Waiting for user approval
    'sources',           -- Gathering sources
    'claims',            -- Extracting claims
    'fact_checking',     -- Verifying claims
    'bias_analysis',     -- Analyzing bias
    'timeline',          -- Building timeline
    'summary',           -- Writing summary
    'completed',         -- Investigation done
    'failed'             -- Investigation failed
);

ALTER TABLE investigations ADD COLUMN current_phase investigation_phase DEFAULT 'plan_pending';
```

**Phase Transitions**:
```python
# At start of each sub-agent:
update_investigation_phase(investigation_id, 'sources')

# On completion:
update_investigation_phase(investigation_id, 'completed')

# On failure:
update_investigation_phase(investigation_id, 'failed')
```

**Benefits**:
- Resume investigations if needed (post-hackathon)
- UI can show exact current stage
- Easy debugging of stuck investigations

---

## 17. Pause/Stop Mechanism

### MVP Implementation

**Stop Button Behavior**:
- User clicks "Stop Investigation" button
- Investigation marked as `status = 'completed'` with `current_phase` showing where it stopped
- All partial data preserved and visible
- Chat message: "⏹️ Investigation stopped. Partial results saved."

**UI**:
```
┌──────────────────────────────────────────────────┐
│  Investigation Title              [⏹️ Stop]      │
│  Step 3/6: Verifying facts...                    │
└──────────────────────────────────────────────────┘
```

**No Pause for MVP** - only stop with save.

---

## 18. Breaking News Disclaimer

### Auto-Detection (Optional)
If topic contains recent dates or keywords like "today", "breaking", "developing":

**Summary Disclaimer**:
```
⚠️ Note: This investigation was completed on February 1, 2026.
For developing stories, information may have changed since this analysis.
```

**Implementation**:
```python
DEVELOPING_KEYWORDS = ['breaking', 'today', 'developing', 'just now', 'live']

def should_add_disclaimer(brief):
    return any(kw in brief.lower() for kw in DEVELOPING_KEYWORDS)
```

---

## 19. Graph Tab (Claim Evidence Network)

### Canvas Tab Structure Update

| Tab | Content |
|-----|---------|
| **Brief** | Auto-updating investigation summary |
| **Dashboard** | Sub-tabs: Sources, Claims, Fact Checks, Bias, Timeline |
| **Graph** | Interactive claim-source evidence network |

### Graph Tab Implementation

**Technology**: React Flow + Dagre (auto-layout)

### Node Types

**Source Node**:
```
┌──────────────────────────┐
│  ○ OFFICIAL              │  ← Source type badge
│    ID: #8821             │
│                          │
│  NHTSA Report 22-V       │  ← Source title
│  ⭐⭐⭐⭐⭐                  │  ← Credibility stars
└──────────────────────────┘
```

**Claim Node**:
```
┌──────────────────────────┐
│  VERIFIED ✓              │  ← Status badge (green/yellow/red)
│                          │
│  Phantom Braking         │  ← Claim title
│  Defect                  │
│                          │
│  System engages brakes   │  ← Claim snippet
│  without obstruction.    │
└──────────────────────────┘
```

### Node Colors

| Claim Status | Badge Color | Border Color |
|--------------|-------------|--------------|
| Verified | 🟢 Green (#22c55e) | Green |
| Under Investigation | 🟡 Yellow (#eab308) | Yellow |
| Disputed/Contradicted | 🔴 Red (#ef4444) | Red |

| Source Type | Badge Color |
|-------------|-------------|
| OFFICIAL | Blue (#3b82f6) |
| HUMINT | Purple (#a855f7) |
| DATA | Cyan (#06b6d4) |
| NEWS | Gray (#6b7280) |

### Edge Types

| Edge Type | Style | Color |
|-----------|-------|-------|
| Supports | Solid line | Green (#22c55e) |
| Contradicts | Dashed line | Red (#ef4444) |
| Mentions | Dotted line | Gray (#9ca3af) |

### Interactions

**Drag Node**:
- Click and drag to reposition any node
- Node position saved for current session
- Other nodes stay in place (no auto-rearrange)
- Hold Shift + drag to select multiple nodes

**Hover on Node**:
- Show tooltip with full details
- Highlight connected edges
- Dim unrelated nodes

**Click on Source Node**:
- Open source panel on right
- Show full content snippet
- Link to original URL

**Click on Claim Node**:
- Show fact-check evidence panel
- List all supporting/contradicting sources
- Show verification reasoning

**Click on Edge**:
- Highlight the connection
- Show evidence text that links source to claim

**Double-click Canvas**:
- Fit all nodes to viewport
- Reset zoom to default

**Pan/Zoom**:
- Mouse drag to pan
- Scroll to zoom
- Zoom controls in corner (+/- buttons)

### Controls

```
┌──────────────────────────────────────────────────────────────┐
│  Vicaran Graph                    70%  [−][+]  📤 Export    │
│  INVESTIGATION: TESLA SAFETY                   [+ Add Node] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│        (React Flow Canvas)                                   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  STATUS LEGEND                          NODES: 6 | EDGES: 5 │
│  ● Verified Claim                                           │
│  ● Under Investigation                                      │
│  ● Disputed/False                                           │
│  □ Source Material                                          │
└──────────────────────────────────────────────────────────────┘
```

### Auto-Layout with Dagre

**Layout Direction**: Left to Right (LR)
- Sources on left
- Claims on right
- Edges flow left → right

```javascript
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: 'LR', nodesep: 50, ranksep: 200 });

// Add nodes and edges, then:
dagre.layout(dagreGraph);
```

### Data Model for Graph

```typescript
interface GraphNode {
  id: string;
  type: 'source' | 'claim';
  position: { x: number; y: number };
  data: SourceNodeData | ClaimNodeData;
}

interface SourceNodeData {
  sourceId: string;
  title: string;
  url: string;
  sourceType: 'OFFICIAL' | 'HUMINT' | 'DATA' | 'NEWS';
  credibilityScore: number;
}

interface ClaimNodeData {
  claimId: string;
  title: string;
  snippet: string;
  status: 'verified' | 'unverified' | 'contradicted';
}

interface GraphEdge {
  id: string;
  source: string;  // source node id
  target: string;  // claim node id
  type: 'supports' | 'contradicts' | 'mentions';
  label?: string;  // evidence snippet
}
```

---

# Phase 2 Features (Post-Hackathon)

> Features deferred to after February 10, 2026 deadline

---

## 20. Non-English Source Handling

### MVP Behavior
- Skip non-English sources
- Chat: "⚠️ Skipped 3 non-English sources"

### Phase 2 Implementation

**Detection**:
```python
from langdetect import detect

def is_english(text):
    try:
        return detect(text) == 'en'
    except:
        return True  # Assume English if detection fails
```

**Options**:
1. **Auto-Translate**: Google Translate API integration
2. **Mark for Review**: Save with `language` field, show "Needs Translation" badge
3. **User Choice**: Prompt user "Found 3 Spanish sources. Translate?"

**Schema Addition**:
```sql
ALTER TABLE sources ADD COLUMN detected_language TEXT DEFAULT 'en';
ALTER TABLE sources ADD COLUMN is_translated BOOLEAN DEFAULT FALSE;
```

---

## 21. Audit Trail (Phase 9)

### Implementation
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Action Types
- `investigation_started`
- `plan_approved`
- `source_found`
- `source_failed`
- `claim_extracted`
- `fact_checked`
- `bias_analyzed`
- `timeline_built`
- `summary_written`
- `investigation_completed`
- `investigation_failed`
- `user_stopped`

---

## 22. Mid-Investigation Source Addition (Phase 2)

### Current MVP: Sources added at setup only

### Phase 2 Flow:
1. User clicks "+" in chat during active investigation
2. Modal opens for URL input
3. Source added to queue with `status = 'pending'`
4. Agent picks up on next iteration
5. Chat: "📎 Added new source to analysis queue"

---

## 23. Wayback Machine Fallback (Phase 2)

### Trigger
When source URL returns 404/timeout:

```python
def fetch_with_wayback_fallback(url):
    try:
        content = fetch_url(url)
    except URLNotAvailable:
        wayback_url = f"https://web.archive.org/web/{url}"
        content = fetch_url(wayback_url)
        # Mark source as 'archived': True
    return content
```

---

## 24. Recursive Gap-Driven Search (Phase 2)

### Concept
After initial analysis, agent identifies gaps:
- "No information found about CEO's 2024 statements"
- Agent auto-searches to fill gap
- Adds new sources, re-analyzes

### Implementation
- Add `knowledge_gaps` table
- Agent tracks what it couldn't find
- Iterative search loop (max 2-3 iterations)

---

> **Document Complete**: Edge cases (1-5), Workflow (6-12), Technical specs (13-19), Phase 2 (20-24)
