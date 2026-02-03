# Strategic Database Planning Document

## App Summary
**End Goal:** Help journalists investigate stories faster with AI-powered research
**Template Used:** ADK-Agent-SaaS
**Core Features:** Multi-agent investigation, source credibility, fact-checking, bias analysis, timeline

---

## 🗄️ Current Database State

### Existing Tables (ADK-Agent-SaaS Template)
- **`users`** - User accounts with Google OAuth (id, email, full_name, role)
- **`session_names`** - ADK session titles (maps session_id to user-friendly title)

### Template Assessment
**✅ 20% ready:** Auth and session naming is covered
**❌ Missing:** Investigation-specific tables for sources, claims, fact-checks, etc.
**🔧 Action:** Create 7 new tables for Vicaran's investigation features

---

## 🎯 Final Schema Design

### Enums

```sql
CREATE TYPE investigation_mode AS ENUM ('quick', 'detailed');
CREATE TYPE investigation_status AS ENUM ('active', 'completed', 'failed');
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
CREATE TYPE source_status AS ENUM ('pending', 'analyzed', 'failed');
CREATE TYPE claim_status AS ENUM ('verified', 'unverified', 'contradicted');
CREATE TYPE evidence_type AS ENUM ('supporting', 'contradicting');
```

---

### Table: investigations

```sql
investigations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,                    -- ADK session reference
  title TEXT NOT NULL,
  brief TEXT NOT NULL,                         -- Investigation description
  mode investigation_mode NOT NULL,            -- 'quick' or 'detailed'
  status investigation_status DEFAULT 'active',
  current_phase investigation_phase DEFAULT 'plan_pending',  -- Current pipeline stage
  summary TEXT,                                -- Brief tab auto-updating content
  overall_bias_score DECIMAL(3,2),             -- 0.00 to 5.00
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Purpose:** Core investigation record linking user, ADK session, and all investigation data.

---

### Table: sources

```sql
sources (
  id UUID PRIMARY KEY,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  content_snippet TEXT,
  status source_status DEFAULT 'pending',       -- 'analyzed', 'failed', 'pending'
  credibility_score DECIMAL(2,1),              -- 1.0 to 5.0 stars (NULL if failed)
  bias_score DECIMAL(3,2),                     -- 0.00 to 10.00 (NULL if failed)
  is_user_provided BOOLEAN DEFAULT FALSE,      -- User added vs agent found
  error_message TEXT,                          -- Reason for failure (if status = 'failed')
  analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Purpose:** All sources discovered or provided for an investigation.

---

### Table: source_bias_indicators

```sql
source_bias_indicators (
  id UUID PRIMARY KEY,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  indicator_type TEXT NOT NULL,                -- 'emotional_language', 'selective_citation', etc.
  confidence_score DECIMAL(3,2),               -- 0.00 to 1.00
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Purpose:** Structured bias analysis for each source, queryable by indicator type.

---

### Table: claims

```sql
claims (
  id UUID PRIMARY KEY,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
  claim_text TEXT NOT NULL,
  status claim_status DEFAULT 'unverified',
  evidence_count INTEGER DEFAULT 0,            -- Denormalized for quick display
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Purpose:** Unique claims extracted from investigation, with verification status.

---

### Table: claim_sources (Junction Table)

```sql
claim_sources (
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  PRIMARY KEY (claim_id, source_id)
)
```

**Purpose:** Many-to-many relationship between claims and sources that mention them.

---

### Table: fact_checks

```sql
fact_checks (
  id UUID PRIMARY KEY,
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  evidence_type evidence_type NOT NULL,        -- 'supporting' or 'contradicting'
  evidence_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Purpose:** Evidence for/against each claim, linked to the source providing the evidence.

---

### Table: timeline_events

```sql
timeline_events (
  id UUID PRIMARY KEY,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_text TEXT NOT NULL,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Purpose:** Chronological events extracted from investigation, with proper date sorting.

---

### Table: audit_logs

```sql
audit_logs (
  id UUID PRIMARY KEY,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
  action TEXT NOT NULL,                        -- 'started', 'source_found', 'claim_extracted', etc.
  details JSONB,                               -- Flexible metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Purpose:** Audit trail of all agent actions for transparency.

---

## 📊 Entity Relationship Diagram

```
users
  │
  ▼
investigations ──────────────────┬─────────────────┬─────────────────┐
  │                              │                 │                 │
  ▼                              ▼                 ▼                 ▼
sources ──────────────┐    timeline_events    audit_logs        claims
  │                   │                                            │
  ▼                   │                                            ▼
source_bias_indicators│                                      claim_sources
                      │                                            │
                      ▼                                            ▼
                fact_checks ◄──────────────────────────────────────┘
```

---

## ⚡ Feature-to-Schema Mapping

| Feature | Tables Used |
|---------|-------------|
| Investigation Setup | `investigations` |
| Add Source | `sources`, `claim_sources` |
| Sources Tab (📰) | `sources`, `source_bias_indicators` |
| Claims Tab (💬) | `claims`, `claim_sources` |
| Fact Checks Tab (✓) | `fact_checks`, `claims`, `sources` |
| Bias Tab (⚖️) | `sources.bias_score`, `source_bias_indicators` |
| Timeline Tab (📅) | `timeline_events` |
| Audit Tab (📋) | `audit_logs` |
| Brief Tab | `investigations.summary` |
| History Page | `investigations` (filter by user_id) |
| Export PDF | All tables joined |

---

## 📋 Table Summary

| Table | Purpose | Rows per Investigation |
|-------|---------|----------------------|
| `investigations` | Core record | 1 |
| `sources` | Web sources + user sources | 10-50 |
| `source_bias_indicators` | Per-source bias details | 20-100 |
| `claims` | Extracted claims | 5-20 |
| `claim_sources` | Claim ↔ Source links | 10-60 |
| `fact_checks` | Evidence for claims | 10-50 |
| `timeline_events` | Chronological events | 5-30 |
| `audit_logs` | Agent action log | 50-200 |

---

## 🎯 Implementation Priority

**Phase 1 (MVP - Hackathon):**
1. `investigations` - Core functionality
2. `sources` - Source discovery
3. `claims` - Claim extraction
4. `claim_sources` - Junction table
5. `fact_checks` - Verification
6. `timeline_events` - Chronological view (important for journalists)
7. `audit_logs` - Transparency

**Phase 2 (Post-Hackathon):**
1. `source_bias_indicators` - Detailed bias analysis
2. Additional optimizations (see below)

---

## 🔧 Indexes & Constraints (Phase 1)

```sql
-- Performance indexes
CREATE INDEX idx_investigations_user_id ON investigations(user_id);
CREATE INDEX idx_sources_investigation_id ON sources(investigation_id);
CREATE INDEX idx_claims_investigation_id ON claims(investigation_id);

-- Prevent duplicate URLs within same investigation
ALTER TABLE sources ADD CONSTRAINT unique_investigation_url 
UNIQUE (investigation_id, url);
```

---

## 🚀 Phase 2 Optimizations

**Performance:**
- Add `idx_sources_credibility_score` for filtering
- Add `idx_claims_status` for status filtering
- Add `idx_timeline_events_date` for date sorting

**Scalability:**
- Partition `audit_logs` by date
- Archive old investigations to cold storage
- Add read replicas for dashboard queries

**Features:**
- `investigation_collaborators` table for team features
- Full-text search on claims via `tsvector`
- `version` field for conflict resolution
- `progress_percentage` for UI progress bars

**Constraints:**
- Unique constraint on claim_text per investigation
- Credibility score validation (1.0 - 5.0)
- Bias score validation (0.00 - 10.00)

---

> **Next Step:** Proceed to system architecture design with this schema as the data foundation.
