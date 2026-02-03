# ADK Agent System Task Template

> **Instructions:** This template helps you create comprehensive task documents for Google Agent Development Kit (ADK) agent systems. Fill out each section thoroughly to ensure proper multi-agent workflow design, tool integration, and deployment to Google Cloud Agent Engine.

---

## 1. Task Overview

### Agent System Title
<!-- Provide a clear, specific title for the agent system you're building -->
**Title:** [Brief, descriptive title of the agent system/workflow]

### Goal Statement
<!-- One paragraph describing the high-level objective of the agent system -->
**Goal:** [Clear statement of what the agent system will achieve and why it matters]

### State Integrity Principle
> Every task author is **personally responsible** for tracing **all** session-state keys end-to-end across the workflow.  
> • If an agent tries to read a key that no upstream agent writes, **stop immediately**, alert the user, and present your proposed remedy (e.g., rename `output_key`, add callback/tool call). Never proceed without user approval.

---

## 2. ADK Project Analysis & Current State

### ADK Architecture & Technology Stack
<!-- 
AI Agent: Analyze the project to fill this out.
- Check existing agent definitions and workflow patterns
- Check `pyproject.toml` for ADK dependencies and Python version
- Check existing agent hierarchies and multi-agent systems
- Check tool integrations and function definitions
- Check deployment configuration for Google Cloud Agent Engine
- **CRITICAL: Analyze existing agent patterns (LlmAgent, SequentialAgent, ParallelAgent, LoopAgent)**
- **CRITICAL: Check for existing tool definitions and agent-tool integrations**
- **CRITICAL: Identify existing authentication patterns and Google Cloud setup**
-->
- **Python Version:** [e.g., Python 3.10+ with uv dependency management]
- **ADK Framework:** [e.g., Google ADK with LlmAgent, SequentialAgent, ParallelAgent, LoopAgent]
- **Model Integration:** [e.g., Gemini 2.5 Flash/Pro for LLM reasoning and tool selection]
- **Tool Ecosystem:** [e.g., Function tools, built-in tools, Google Cloud tools, custom integrations]
- **Deployment Target:** [e.g., Google Cloud Agent Engine with AgentOps monitoring]
- **Session Management:** [e.g., InMemorySessionService or production session service]
- **Authentication:** [e.g., Google Cloud SDK, service account, Vertex AI authentication]
- **🔑 EXISTING AGENT PATTERNS:** [e.g., Root agent with specialized sub-agents]
- **🔑 WORKFLOW PATTERNS:** [e.g., Sequential processing, parallel execution, iterative loops]
- **🔑 TOOL INTEGRATIONS:** [e.g., Web search, code execution, file processing, external APIs]
- **Relevant Existing Modules:** [e.g., `agent.py`, `agent_engine_app.py`, `config.py`]

### Current State
<!-- Describe what exists today based on actual analysis -->
[Describe the current agent system state, existing agents, workflow patterns, and what's working/not working - based on actual file analysis, not assumptions]

### 🔍 MANDATORY: Examine Existing Agent Code First

### 🚨 CRITICAL: LOOK FIRST, DON'T ASK

<!-- 
🚨 ANTI-PATTERN: Asking "Should I create X?" or "Does Y exist?" 
✅ CORRECT PATTERN: Proactively examine the codebase and report what exists

WRONG: "Should I create a research_pipeline as a SequentialAgent?"
RIGHT: "I examined the codebase and found no research_pipeline agent. Here's what exists: [list]. I need to create a research_pipeline."

WRONG: "Does the validation_loop_agent already exist?"
RIGHT: "The validation_loop_agent exists at /sub_agents/loop_agent/agent.py but is empty with no sub-agents."
-->

### 🚨 CRITICAL: Avoid Over-Specificity When Analyzing Examples

**REAL FAILURE PATTERN from Competitor Analysis Implementation:**

**❌ EXAMPLE-SPECIFIC TRAP**: Building solutions around the specific example provided
- User provides "shipkit.ai" example → I hardcoded developer tool patterns everywhere
- User asks about templates + courses → I encoded "rapid_deployment_education" business model  
- User mentions "10x developer" → I created developer-specific keyword lists
- **RESULT**: System completely failed for nicotine pouches, healthcare, restaurants, etc.

**✅ UNIVERSAL EXTRACTION PRINCIPLE**: Extract universal principles from examples
- User example shows business analysis need → Build universal industry classification system
- User case involves product+service → Identify universal business model patterns
- Any specific example → Find the underlying universal category/pattern it represents

**MANDATORY Pre-Implementation Questions:**
- [ ] **Universal Test**: Will this solution work for completely different industries? (Test with 3+ unrelated examples)
- [ ] **Abstraction Check**: Am I hardcoding the example case or building universal patterns?
- [ ] **Principle Extraction**: What's the underlying principle vs. the specific example domain?
- [ ] **Cross-Industry Validation**: Does this approach work for consumer goods, SaaS, healthcare, retail, consulting?

**Real Example of Proper Universal Abstraction:**
```
❌ BAD (Example-specific): "Find shipfa.st competitors" → Hardcoded developer tool searches
✅ GOOD (Universal): "Find same industry + business model competitors" → Works for any business
```

### Before Creating New Components - ALWAYS Examine What Exists

**🔍 MANDATORY EXAMINATION PROCESS:**
1. **List all existing agents** using `list_dir` and `read_file`
2. **Read existing code** to understand current implementation
3. **Document what exists** with specific file paths and current state
4. **Identify gaps** based on actual examination, not assumptions
5. **NEVER ASK** "Does X exist?" - **ALWAYS LOOK AND REPORT**
- [ ] I have created a **State Dependency Table** mapping each `output_key` to every downstream consumer.
- [ ] I confirm no agent reads a key that lacks an upstream writer—or I have documented a proposed fix awaiting user approval.

### 🚨 MANDATORY: Workflow Document Integration

**BEFORE creating any major agent updates or new agent systems:**

#### For Major Agent Updates/New Systems - REQUEST WORKFLOW DOCUMENT
- [ ] **ASK FOR WORKFLOW DOCUMENT** if not provided: "I need the workflow document (like `..._workflow.md`) to understand the existing session state flow and agent architecture before proceeding. Can you provide it?"
- [ ] **EXAMINE PROVIDED WORKFLOW** document thoroughly for session state keys
- [ ] **EXTRACT SESSION STATE KEYS** from workflow documentation
- [ ] **CROSS-REFERENCE** agent instructions with documented session state flow

#### For Simple Updates - OPTIONAL
- Simple bug fixes or minor enhancements may proceed without workflow document
- Use judgment: if unsure, request the workflow document

### Existing Code Examination Checklist

#### 1. Proactively List All Existing Agents & Sub-Agents
**✅ REQUIRED ACTION:** Run examination commands and document findings

**Existing Agents Found:**
```
# Document each agent file found with its current state
- apps/{project}/agent.py - [ROOT AGENT: Current purpose and implementation status]
- apps/{project}/sub_agents/agent_name/agent.py - [SUB-AGENT: What it does, tools, status]
- apps/{project}/sub_agents/other_agent/agent.py - [SUB-AGENT: What it does, tools, status]
```

#### 2. Analyze Agent Capabilities & Current Implementation
**For each existing agent, document based on ACTUAL CODE EXAMINATION:**
- **File Path:** [Exact path to agent.py]
- **Current Implementation:** [What the code actually does - not what it should do]
- **Tools Used:** [Actual tools from the code: google_search, function tools, etc.]
- **Instructions Quality:** [✅ Complete / ⚠️ Needs improvement / ❌ Incomplete]
- **Sub-Agents:** [List actual sub-agents from the code]
- **State:** [✅ Working / ⚠️ Needs fixes / ❌ Broken/Empty]
- **Reusability:** [Can this be reused, modified, or needs replacement?]

**Example Analysis:**
```
- File: apps/competitor-analysis-agent/sub_agents/interactive_planner/agent.py
  - Current Implementation: LlmAgent with research_pipeline as sub-agent
  - Tools Used: None
  - Instructions Quality: ✅ Complete, detailed research coordination
  - Sub-Agents: [research_pipeline]
  - State: ✅ Working but may be redundant with root agent
  - Reusability: ❌ Needs restructuring - root agent handles this role

- File: apps/competitor-analysis-agent/sub_agents/loop_agent/agent.py
  - Current Implementation: LoopAgent with max_iterations config
  - Tools Used: None
  - Instructions Quality: ❌ Empty - no instructions
  - Sub-Agents: None (empty)
  - State: ❌ Incomplete - needs sub-agents
  - Reusability: ⚠️ Can be used but needs sub-agents added
```

#### 3. Identify Missing Components and Integration Gaps
**Based on CODE EXAMINATION, document:**
- **Missing Agents:** [What agents need to be created - not guessed]
- **Empty/Incomplete Agents:** [Agents that exist but are not fully implemented]
- **Workflow Gaps:** [Missing connections between existing agents]
- **Tool Distribution Issues:** [Where tools are needed but missing]

#### 4. Integration Opportunities from Real Code
**Current Architecture State:** [Based on actual code structure]
**Missing Connections:** [Specific workflow gaps found in code]
**Reuse Strategy:** [How to leverage existing code vs. create new]

### 🎯 Examination-First Principle
**MANDATORY BEFORE ASKING ANY QUESTIONS:**
- [ ] **I have examined** all existing agent.py files in the project
- [ ] **I have documented** what each agent currently does based on code
- [ ] **I have identified** specific gaps and missing components
- [ ] **I have analyzed** existing tool distribution and session state flow
- [ ] **I understand** what needs to be created vs. what can be reused
- [ ] **I will NOT ask** "Does X exist?" - I will examine and report

**❌ BANNED QUESTIONS:**
- "Should I create a research_pipeline agent?"
- "Does the validation_loop_agent already exist?"
- "Are these sub-agents already implemented?"

**✅ CORRECT STATEMENTS:**
- "I examined the codebase and found no research_pipeline agent."
- "The validation_loop_agent exists but is empty - it needs sub-agents."
- "These sub-agents are implemented and ready for integration."

### 🗝️ Session State Patterns & Validation

#### Quick Session State Reference

| Pattern | ✅ Correct Example | ❌ Wrong Example |
|---------|-------------------|------------------|
| **Write to State** | `output_key="research_context"` | `session_state["key"] = value` |
| **Read from State** | `{research_context}` in instruction | `session_state.get("key")` in instruction |
| **Agent Communication** | upstream `output_key` → downstream `{placeholder}` | Direct parameter passing |
| **State Validation** | Every `{placeholder}` has upstream writer | Orphaned reads without writers |

#### Session State Anti-Patterns (Real Failures)

| ❌ Anti-Pattern | 💥 Impact | ✅ Correct Pattern |
|----------------|-----------|-------------------|
| Manual state setting in callbacks | Complete communication breakdown | Use `output_key` pattern |
| Changing documented session state keys | Agent-to-agent communication broken | Keep existing key names from workflow docs |
| Orphaned `{placeholder}` reads | Agents get null/empty data | Trace every read to upstream writer |

### 🗝️ Session State READ/WRITE Pattern (Mandatory)

**🚨 CRITICAL SESSION STATE VALIDATION:**

#### Before Writing ANY Agent Instructions - MANDATORY CHECKS:
1. **TRACE ALL `{placeholder}` VALUES** in agent instructions back to upstream sources
2. **VERIFY SESSION STATE DEPENDENCY TABLE** shows every read has a writer
3. **CROSS-REFERENCE WITH WORKFLOW DOCUMENTS** to ensure alignment
4. **IDENTIFY ORPHANED READS** - any `{placeholder}` without upstream writer

#### When Orphaned Reads Found - PROACTIVE RESOLUTION:
**❌ NEVER JUST STOP** - instead, **ASK USER WITH SUGGESTED FIXES:**

"I found orphaned session state reads that need resolution before proceeding:

**Orphaned Reads Found:**
- `{company_name}` in enhanced_search_agent - no upstream writer found
- `{industry}` in enhanced_search_agent - no upstream writer found

**Suggested Fixes:**
1. **Option A:** Update agent to read existing keys like `{research_findings}` 
2. **Option B:** Add upstream agent to write `company_name` and `industry` to session state
3. **Option C:** Remove these placeholders and use static instructions

Which approach would you prefer?"

**Correct Patterns**

1. **Read from state (instruction template-var)**
```python
story_generator = LlmAgent(
    name="StoryGenerator",
    model="gemini-2.5-flash",
    instruction="""Write a short story about a cat, focusing on the theme: {topic}."""
    # topic was injected into instruction automatically by ADK because
    # the previous agent wrote `topic` to session_state via output_key.
)
```

2. **Write to state via `output_key` (preferred)**
```python
section_planner_agent = LlmAgent(
    name="section_planner_agent",
    model=config.model,
    output_key="research_sections",  # <- will save the agent's final output
    instruction="""Here is the research plan:
    {research_plan}

    Generate a detailed set of research sections covering the entire plan."""
)
```

3. **Write to state programmatically (callbacks / tools – advanced)**
```python
# Inside a callback or function tool
callback_context.state["my_key"] = my_value  # <-- explicit write
```

**❌ Wrong Patterns (Banned):**
- Accessing `session_state.get()` inside instruction string
- Describing writes in instruction prose (e.g., "WRITE TO SESSION STATE: …") – ADK ignores this

### Updated Checklist (add to Examination Principle section)
- [ ] Instruction strings use `{state_key}` placeholders for inputs
- [ ] `output_key` is set when agent output must be consumed by another agent
- [ ] No `session_state.get()` calls inside instruction text
- [ ] Programmatic writes (callback/tool) only when `output_key` is insufficient
- [ ] **ALL `{placeholder}` values traced to upstream writers**
- [ ] **Session State Dependency Table completed and validated**
- [ ] **Workflow document cross-referenced for session state alignment**

---

## 3. Strategic Analysis & Agent Architecture Options

### When to Use Strategic Analysis for Agent Systems
<!-- 
AI Agent: Use your judgement to determine when strategic analysis is needed vs direct implementation.

**✅ CONDUCT STRATEGIC ANALYSIS WHEN:**
- Multiple agent architecture approaches exist (single vs multi-agent)
- Trade-offs between different ADK patterns are significant (Sequential vs Parallel vs Loop)
- Tool distribution strategies have different implications
- Workflow complexity could be handled through different agent hierarchies
- Performance, maintainability, or complexity trade-offs are substantial
- User requirements could be met through different agent coordination patterns

**❌ SKIP STRATEGIC ANALYSIS WHEN:**
- Single agent with instructions can clearly handle the task
- Agent architecture is straightforward and follows existing patterns
- Tool requirements are simple and obvious
- Change is an enhancement to existing agent system

**DEFAULT BEHAVIOR:** When in doubt, provide strategic analysis. Better to consider options than assume the best approach.
-->

### Problem Context
<!-- Restate the problem and why it needs strategic consideration for agent architecture -->
[Explain the problem and why multiple agent system approaches should be considered - what makes this agent architecture decision important?]

### 🚨 CRITICAL: Prompting vs Engineering Trade-offs Analysis

**REAL LESSON from Competitor Analysis Implementation:**

When evaluating agent architecture options, ALWAYS consider this fundamental choice:

#### Option: Prompt Engineering Solution (DEFAULT PREFERENCE)
**Approach:** Use intelligent prompts with context injection instead of custom data structures

**Pros:**
- ✅ **Simpler implementation** - no new session state fields or validation logic
- ✅ **More flexible** - can adapt to new patterns without code changes  
- ✅ **Easier maintenance** - changes require only prompt updates
- ✅ **Universal adaptability** - prompts can handle edge cases that code cannot

**Cons:**
- ❌ **Less structured** - relies on LLM consistency 
- ❌ **Harder to validate** - no strict schemas for outputs

**When to Choose:** Business logic can be expressed through prompts and context (90% of cases)

**Real Success Example:**
```
❌ OVER-ENGINEERED: Added business_model_relevance_score: int field + validation logic
✅ PROMPT SOLUTION: "Grade 'pass' only if competitors match industry + business model"
```

#### Option: Code Engineering Solution
**Approach:** Custom data structures, validation logic, complex session state  

**When to Choose ONLY:**
- Complex validation that cannot be expressed in natural language
- Safety-critical logic requiring strict validation
- Structured outputs that downstream systems must parse reliably
- Mathematical calculations or complex algorithms

**⚠️ WARNING**: Default to prompt engineering. Only engineer code when prompts fundamentally cannot handle the complexity.

**MANDATORY Pre-Engineering Questions:**
- [ ] Can I solve this with better context injection in prompts instead?
- [ ] Am I adding session state fields that won't actually be consumed by downstream agents?
- [ ] Would updating instructions be simpler than adding validation code?
- [ ] Is this engineering complexity justified, or am I over-complicating?

### Agent Architecture Options Analysis

#### Option 1: Single Agent with Instructions
**Approach:** [Single LlmAgent with comprehensive instructions handling the entire task]

**Pros:**
- ✅ [Simplicity - minimal maintenance overhead]
- ✅ [Fast implementation - no agent coordination needed]
- ✅ [Single point of failure - easier debugging]

**Cons:**
- ❌ [Limited tool usage - only one built-in tool possible]
- ❌ [Instruction complexity - may become unwieldy for complex tasks]
- ❌ [Processing overhead - all logic in one agent]

**Implementation Complexity:** [Low/Medium/High] - [Brief justification]
**Tool Constraints:** [What tools can/cannot be used in this approach]
**Maintenance Overhead:** [Long-term complexity considerations]

#### Option 2: Root + Sequential Agent Workflow
**Approach:** [Root agent as coordinator + SequentialAgent with specialized sub-agents]

**Pros:**
- ✅ [Clear workflow stages - easy to understand and debug]
- ✅ [Tool distribution - each agent can have its own built-in tool]
- ✅ [Specialized agents - focused responsibilities]

**Cons:**
- ❌ [Coordination complexity - session state management required]
- ❌ [Multiple failure points - any agent can break the workflow]
- ❌ [Implementation overhead - multiple agent files and coordination]

**Implementation Complexity:** [Low/Medium/High] - [Brief justification]
**Tool Distribution Strategy:** [How tools will be distributed across agents]
**Session State Requirements:** [What data needs to flow between agents]

#### Option 3: Root + Parallel Agent Processing
**Approach:** [Root agent + ParallelAgent for concurrent processing]

**Pros:**
- ✅ [Performance benefits - concurrent execution]
- ✅ [Independent processing - agents don't depend on each other]
- ✅ [Tool distribution - each parallel agent can have its own tools]

**Cons:**
- ❌ [Result synchronization - need to combine parallel outputs]
- ❌ [Coordination complexity - managing parallel execution]
- ❌ [Resource usage - multiple agents running simultaneously]

**Implementation Complexity:** [Low/Medium/High] - [Brief justification]
**Parallelization Benefits:** [What specific benefits justify the complexity]
**Result Integration Strategy:** [How parallel results will be combined]

#### Option 4: Complex Multi-Agent Hierarchy (if applicable)
**Approach:** [Multiple specialized agents with sub-agents and complex coordination]

**Pros:**
- ✅ [Maximum specialization - each agent highly focused]
- ✅ [Advanced tool distribution - complex tool requirements met]

**Cons:**
- ❌ [High complexity - difficult to maintain and debug]
- ❌ [Coordination overhead - complex session state management]
- ❌ [Over-engineering risk - may be more complex than needed]

**Implementation Complexity:** High - [Specific justification required]
**Complexity Justification:** [Why this complexity is absolutely necessary]
**Maintenance Considerations:** [Long-term support implications]

### 🚨 CRITICAL: Simplicity Assessment

**BEFORE choosing complex architectures, answer these questions:**
- [ ] **Single Agent Test:** "Can one agent with detailed instructions handle this entire task?"
- [ ] **Tool Requirements:** "Do I need different built-in tools that require separate agents?"
- [ ] **Performance Benefits:** "Will multiple agents actually improve performance?"
- [ ] **Maintenance Overhead:** "Can I maintain this system effectively in 6 months?"

**⚠️ WARNING SIGNS of over-engineering:**
- "I need 5+ agents for this task"
- "Each agent handles one small step"
- "Agents are mostly passing data between each other"
- "The workflow is basically sequential but I'm using multiple agents"

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option [X] - [Solution Name]

**Why this is the best choice:**
1. **[Primary reason]** - [Specific justification based on ADK patterns]
2. **[Secondary reason]** - [Tool distribution or performance benefits]
3. **[Additional reason]** - [Long-term maintainability considerations]

**Key Decision Factors:**
- **Agent Coordination:** [How agents will communicate and coordinate]
- **Tool Distribution:** [How built-in and function tools will be allocated]
- **Session State Management:** [How information flows between agents]
- **Performance Impact:** [Expected performance characteristics]
- **Maintenance Complexity:** [Long-term support requirements]

**Alternative Consideration:**
[If there's a close second choice, explain why it wasn't selected and under what circumstances it might be preferred]

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Option [X]), or would you prefer a different approach? 

**Questions for you to consider:**
- Does the recommended architecture align with your complexity preferences?
- Are there any specific tool requirements I should factor in?
- Do you have experience preferences with ADK patterns?
- What's your priority: simplicity vs. specialization vs. performance?

**Next Steps:**
Once you approve the strategic direction, I'll create the detailed implementation plan in the sections below.

### Implementation Options Process
**👤 AFTER STRATEGIC APPROVAL:** The AI will present implementation options using the exact A/B/C format specified in the workflow. Users should respond with their preferred option letter or clear choice.

### Preview Option Details (Option A)
When users choose Option A, the AI will provide:
- **Specific agent files** to be created/modified with file paths
- **Code snippets** showing before/after changes for critical sections
- **Session state changes** with detailed impact analysis
- **Tool integration examples** with specific configurations
- **File count and line estimates** for implementation scope

---

## 4. ADK Project Analysis & Current State

### ADK Architecture & Technology Stack
<!-- 
AI Agent: Analyze the project to fill this out.
- Check existing agent definitions and workflow patterns
- Check `pyproject.toml` for ADK dependencies and Python version
- Check existing agent hierarchies and multi-agent systems
- Check tool integrations and function definitions
- Check deployment configuration for Google Cloud Agent Engine
- **CRITICAL: Analyze existing agent patterns (LlmAgent, SequentialAgent, ParallelAgent, LoopAgent)**
- **CRITICAL: Check for existing tool definitions and agent-tool integrations**
- **CRITICAL: Identify existing authentication patterns and Google Cloud setup**
-->
- **Python Version:** [e.g., Python 3.10+ with modern type hints and async/await patterns]
- **ADK Framework:** [e.g., Google ADK with LlmAgent, SequentialAgent, ParallelAgent, LoopAgent]
- **Model Integration:** [e.g., Gemini 2.5 Flash/Pro for LLM reasoning and tool selection]
- **Tool Ecosystem:** [e.g., Function tools, built-in tools, Google Cloud tools, custom integrations]
- **Deployment Target:** [e.g., Google Cloud Agent Engine with AgentOps monitoring]
- **Session Management:** [e.g., InMemorySessionService or production session service]
- **Authentication:** [e.g., Google Cloud SDK, service account, Vertex AI authentication]
- **🔑 EXISTING AGENT PATTERNS:** [e.g., Root agent with specialized sub-agents]
- **🔑 WORKFLOW PATTERNS:** [e.g., Sequential processing, parallel execution, iterative loops]
- **🔑 TOOL INTEGRATIONS:** [e.g., Web search, code execution, file processing, external APIs]
- **Relevant Existing Modules:** [e.g., `agent.py`, `agent_engine_app.py`, `config.py`]

### Current State
<!-- Describe what exists today based on actual analysis -->
[Describe the current agent system state, existing agents, workflow patterns, and what's working/not working - based on actual file analysis, not assumptions]

---

## 5. Context & Problem Definition

### Problem Statement
<!-- What specific problem are you solving with this agent system? -->
[Detailed explanation of the problem, including why an agent-based approach is needed, user impact, and business value]

### Success Criteria
<!-- How will you know the agent system is complete and successful? -->
- [ ] [Specific, measurable outcome 1 - e.g., "Root agent successfully orchestrates all sub-agents"]
- [ ] [Specific, measurable outcome 2 - e.g., "Sequential workflow completes in under 30 seconds"]
- [ ] [Specific, measurable outcome 3 - e.g., "Parallel agents process concurrent tasks without conflicts"]

---

## 6. Technical Requirements

### Agent System Requirements
<!-- What should the agent system do? -->
- **Root Agent Capabilities:** [What the main orchestrator needs to accomplish]
- **Sub-Agent Responsibilities:** [Specific roles for each agent in the hierarchy]
- **Tool Integration:** [What external capabilities agents need access to]
- **Workflow Coordination:** [How agents will communicate and coordinate]
- **Error Handling:** [How the system handles failures and recovery]

### 🚨 CRITICAL: Callback Requirements (If Applicable)
<!-- ONLY include this section if the task requires ADK callbacks -->
**If this task requires ADK lifecycle callbacks, specify:**

- **Callback Type:** [Specify exact ADK callback: `before_agent_callback`, `after_agent_callback`, etc.]
- **Callback Purpose:** [What the callback will accomplish]
- **Code Example:** [Provide complete code example showing proper usage]

**❌ NEVER use invalid callback parameters like:**
- `initialize_research_state`, `setup_callback`, `init_state`, etc.

**✅ ONLY use valid ADK callbacks:**
- `before_agent_callback`, `after_agent_callback`, `before_tool_callback`, `after_tool_callback`, `before_model_callback`, `after_model_callback`

**Example for session state initialization:**
```python
from google.adk.agents.callback_context import CallbackContext

def initialize_research_state(callback_context: CallbackContext) -> None:
    """Initialize session state variables for the research workflow."""
    session_state = callback_context._invocation_context.session.state
    if "research_context" not in session_state:
        session_state["research_context"] = {}

# Usage in agent
agent = LlmAgent(
    name="root_agent",
    before_agent_callback=initialize_research_state,  # ✅ CORRECT parameter
    instruction="Coordinate research workflow",
)
```

### Performance Requirements
<!-- Performance, scalability, reliability, etc. -->
- **Response Time:** [Expected response times for different operations]
- **Concurrency:** [Number of concurrent requests/operations supported]
- **Reliability:** [Uptime requirements and failure tolerance]
- **Scalability:** [Expected load and scaling requirements]
- **Resource Usage:** [Memory, CPU, and network usage constraints]

### Technical Constraints
<!-- What limitations exist? -->
- [Constraint 1: Must integrate with existing Google Cloud services]
- [Constraint 2: Must follow ADK single-parent rule for agent hierarchy]
- [Constraint 3: Must use approved model types and authentication methods]

---

## 7. 🚨 CRITICAL: ADK Agent Architecture Rules

### 🚨 CRITICAL: Agent Modification vs. Creation Guidelines

#### When Modifying Existing Agents - MINIMAL CHANGES PRINCIPLE

**🛑 FUNDAMENTAL RULE:** When asked to remove, fix, or update specific functionality in existing agents, make **MINIMAL, SURGICAL CHANGES ONLY** unless explicitly asked to redesign the entire agent.

**✅ CORRECT APPROACH for Agent Updates:**
- **Identify the specific issue** (e.g., remove callbacks, fix broken references)
- **Make targeted changes** to address ONLY the identified issue
- **Preserve everything else** - structure, tone, formatting, comprehensive guidelines
- **Keep original intent** - don't change the agent's purpose or approach

**❌ OVER-ENGINEERING ANTI-PATTERN:**
```python
# User asks: "Remove the callback references from this agent"
# WRONG: Completely rewrite entire agent instruction from scratch
# RIGHT: Remove ONLY the callback lines, keep everything else unchanged
```

**Real Example from Report Composer Task:**
```
❌ BAD: User asks to remove citation system → I rewrote entire instruction template
✅ GOOD: User asks to remove citation system → Remove only `<cite source="src-X"/>` references
```

#### When Complete Agent Redesign is Appropriate

**✅ REDESIGN AGENTS ONLY WHEN:**
- User explicitly says "redesign", "rewrite", or "improve the instructions"
- User asks for fundamentally different functionality or approach
- Agent is broken/empty and needs to be built from scratch
- User specifically requests modern patterns or instruction improvements

**❌ NEVER REDESIGN WHEN:**
- User asks to "remove [specific thing]" - make targeted removal only
- User asks to "fix [specific issue]" - fix only that issue
- User asks to "update [specific functionality]" - update only that part
- Task involves debugging or cleanup - preserve working parts

#### Surgical Change Examples

**Example 1: Remove Callback References**
```python
# ❌ WRONG: Rewrite entire instruction
# ✅ RIGHT: Remove only callback-related lines:
- Delete `collect_research_sources_callback` references
- Remove `{url_to_short_id}` and `{sources}` placeholders  
- Keep all other instruction content unchanged
```

**Example 2: Fix Session State Key**
```python
# ❌ WRONG: Redesign instruction structure  
# ✅ RIGHT: Change only the key reference:
- Change `{old_key}` to `{new_key}` in instruction
- Keep all surrounding context and formatting identical
```

**Example 3: Remove Tool Integration**
```python
# ❌ WRONG: Rewrite tool usage sections
# ✅ RIGHT: Remove only tool references:
- Delete tool from agent.tools list
- Remove tool usage instructions
- Keep all non-tool instruction content
```

#### Validation Questions Before Agent Changes

**🚨 MANDATORY BEFORE ANY AGENT MODIFICATION:**
- [ ] **Scope Check**: Am I being asked to fix/remove something specific, or redesign the entire agent?
- [ ] **Minimal Change Test**: Can I solve this by changing <10% of the agent's instructions?
- [ ] **Preservation Priority**: What existing content should I definitely keep unchanged?
- [ ] **User Intent**: Is the user asking for surgical fixes or comprehensive improvements?

**When in doubt about scope, ASK:**
> "I can either make minimal changes to remove [specific issue] while preserving your existing structure, or redesign the entire agent with modern patterns. Which approach would you prefer?"

### 🚨 CRITICAL: Universal Design Principles (Learned from Real Failures)

#### Avoid Domain-Specific Hardcoding
**❌ REAL ANTI-PATTERN EXAMPLES from Competitor Analysis Implementation:**
```python
# BAD: Hardcoded developer tool patterns that failed for other industries  
if business_model_type == "rapid_deployment_education":
    search_terms = ["SaaS boilerplate", "shipfa.st alternatives", "developer productivity tools"]
    
# BAD: Industry-specific keywords that don't generalize
DEVELOPER_KEYWORDS = ["boilerplate", "starter kit", "templates", "10x developer"]

# BAD: Hardcoded examples in instructions
instruction = """Find competitors like shipkit.io and shipfa.st. 
Search for "rapid deployment course marketplace" competitors."""
```

**✅ CORRECT UNIVERSAL PATTERNS:**
```python
# GOOD: Universal classification system that works for any industry
def classify_industry(business_description: str) -> str:
    # Dynamic classification: consumer-goods, saas, healthcare, etc.
    
def generate_search_terms(industry: str, business_model: str) -> list[str]:
    # Dynamic search generation based on universal business principles
    
# GOOD: Universal instruction patterns
instruction = """
Based on the industry ({industry_type}) and business model ({business_model_type}), 
adapt your approach:
- For consumer goods: [universal pattern]
- For SaaS: [universal pattern]  
- For healthcare: [universal pattern]
"""
```

#### Session State Minimalism Principle
**🛑 BEFORE adding ANY session state field, validate with these questions:**
- [ ] **Consumption Validation**: Which specific downstream agent will read this field?
- [ ] **Necessity Check**: Could existing fields + smarter prompts handle this information?
- [ ] **Usage Confirmation**: Will this field actually be used, or is it "just in case" engineering?
- [ ] **Universal Test**: Does this field make sense across all possible use cases?

**REAL FAILURE EXAMPLES from Implementation:**
- ❌ Added `search_strategy` field → **NEVER consumed by any downstream agent**
- ❌ Added `business_model_relevance_score: int` → **User said "just use better prompts"**
- ✅ Used `industry_type` + `business_model_type` → **Actually consumed for universal context injection**

**Session State Validation Protocol:**
1. **Trace consumption path**: `session_state["field_name"]` → which agent reads `{field_name}`?
2. **Test prompt alternative**: Could this be handled by better context in instructions?
3. **Cross-reference workflow docs**: Is this field documented as necessary?
4. **Universal validation**: Does this work for healthcare, consumer goods, AND developer tools?

#### Critical ADK Export Pattern Maintenance
**🚨 MANDATORY ADK SYSTEM REQUIREMENT:**

Every agent.py file MUST end with the proper export pattern:

```python
# Your agent definition
my_agent = LlmAgent(
    name="my_agent",
    # ... configuration
)

# 🚨 CRITICAL: Export for ADK system (NEVER forget this line!)  
root_agent = my_agent
```

**Real Failure Example:**
- Implemented entire competitor analysis agent system
- Forgot `root_agent = competitor_analysis_agent` export line
- **RESULT**: Entire ADK system broken, import failures, no agent access

**Validation Checklist:**
- [ ] Agent file ends with `root_agent = [agent_name]` export
- [ ] `__init__.py` imports with `from .agent import root_agent`  
- [ ] No other agents are accidentally exported as `root_agent`
- [ ] ADK system can successfully import and initialize the agent

#### Session State Management Anti-Patterns (Based on Real System Failures)

**🚨 CRITICAL: ADK Session State Rules (Learned from Competitor Analysis Failure)**

**❌ INVALID SESSION STATE SETTING (Real mistake that broke entire system):**
```python
# WRONG - This doesn't work in ADK and breaks agent communication
def callback(callback_context: CallbackContext) -> None:
    session_state = callback_context._invocation_context.session.state
    session_state["business_context"] = ""  # ❌ INVALID - agents can't manually set output values
    session_state["industry_type"] = ""     # ❌ INVALID - only tools/output_key can write
    session_state["business_model_type"] = ""  # ❌ INVALID - breaks downstream reads
```

**Real Failure Impact:**
- Root agent tried to set multiple session state fields manually
- Downstream agents couldn't read the expected data
- Entire agent communication workflow broken
- System completely non-functional

**✅ CORRECT SESSION STATE PATTERNS:**
```python
# RIGHT - Use output_key to save agent's complete output
agent = LlmAgent(
    name="classifier_agent",
    output_key="research_context",  # Saves agent's final response to session state
    instruction="""Analyze and output structured summary:
    
    **RESEARCH CONTEXT SUMMARY:**
    - **Industry Type**: healthcare  
    - **Business Model**: b2b-saas
    - **Target Market**: dental practices
    [... complete analysis in one structured response]
    """
)

# RIGHT - Use tools to write specific fields (advanced pattern)
@tool
def save_classification(industry: str, business_model: str):
    return {"industry": industry, "business_model": business_model}
```

**ADK Session State Writing Rules:**
- [ ] **ONLY agents with `output_key` can write to session state**
- [ ] **ONLY tools can write to session state programmatically** 
- [ ] **Callbacks CANNOT manually set session state values**
- [ ] **Manual `session_state["key"] = value` is INVALID in ADK**
- [ ] **One agent output_key = one session state field**

#### Workflow Document Integration Failure Prevention

**🚨 CRITICAL: Workflow Document Validation Protocol (Based on Real Communication Breakage)**

**REAL FAILURE from Competitor Analysis**: Changed session state key names without checking existing workflow documentation, completely broke agent-to-agent communication.

**MANDATORY Pre-Implementation Session State Validation:**

1. **Find Existing Workflow Documentation:**
   - [ ] Search for workflow documents (e.g., `competition_workflow.md`, `*_workflow.md`)
   - [ ] Locate session state flow documentation in project
   - [ ] Identify all existing session state keys used by agents

2. **Extract Documented Session State Flow:**
   ```
   # Example from competition_workflow.md:
   research_context → research_plan → research_sections → research_findings → evaluation_result
   ```

3. **Validate ALL Session State Keys Match:**
   - [ ] **EVERY `output_key` value** matches documented downstream reads exactly
   - [ ] **EVERY `{placeholder}` in instructions** has corresponding upstream writer
   - [ ] **NO typos or variations** in session state key names
   - [ ] **NO new keys introduced** without updating workflow documentation

4. **Cross-Reference Agent Instructions:**
   - [ ] Check all `{placeholder}` variables match upstream `output_key` values exactly
   - [ ] Verify no agent tries to read non-existent session state keys
   - [ ] Confirm session state data types match between writers and readers

**MANDATORY Before Implementation Questions:**
- [ ] **Does workflow documentation exist** for this project?
- [ ] **What session state keys** are already established and used?
- [ ] **Which agents write** each session state key currently?
- [ ] **Which agents read** each session state key currently?
- [ ] **Am I changing any existing key names** or introducing new ones?

**Real Session State Validation Example:**
```
✅ Workflow Documentation Says:
- section_researcher writes `research_findings` (output_key="research_findings")
- research_evaluator reads `{research_findings}` in instruction

✅ Implementation Validation:
- section_researcher has output_key="research_findings" ← MATCHES
- research_evaluator instruction contains {research_findings} ← MATCHES  
- Keys are identical - no typos or case differences ← VALIDATED

❌ FAILURE would be:
- section_researcher has output_key="research_results" ← DOESN'T MATCH
- research_evaluator tries to read {research_findings} ← BROKEN
```

#### Workflow Communication Validation Checklist (Prevent Agent Communication Failures)

**MANDATORY Session State Flow Validation (Based on Real Implementation Failures):**

**Before Any Agent Implementation:**
- [ ] **Identify existing workflow document** (search for `*_workflow.md` files)
- [ ] **Map complete session state flow** from existing documentation
- [ ] **Document EVERY session state key** used in the project:

```markdown
| Agent | Writes (output_key) | Reads ({placeholder}) | Status |
|-------|---------------------|----------------------|---------|
| root_agent | research_context | user_input | ✅ VALID |
| plan_generator | research_plan | {research_context} | ✅ VALID |
| evaluator | evaluation_result | {research_findings} | ✅ VALID |
```

**During Agent Implementation:**
- [ ] **Verify EVERY `output_key`** matches documented downstream reads exactly
- [ ] **Test EVERY `{placeholder}`** has corresponding upstream writer
- [ ] **NEVER modify session state keys** without updating ALL dependent agents
- [ ] **Use exact key names** from workflow documentation - no variations

**After Agent Implementation:**
- [ ] **Test session state flow** with actual agent execution
- [ ] **Verify data flows** correctly between all agents
- [ ] **Update workflow documentation** if any keys were legitimately changed

**Real Prevention Example:**
```
❌ WOULD BREAK: Changing research_context to business_context
- plan_generator tries to read {research_context}
- root_agent now writes to business_context  
- NO CONNECTION: plan_generator gets empty/null data
- SYSTEM FAILURE: Entire workflow broken

✅ PREVENTION: Keep research_context name exactly as documented
- root_agent: output_key="research_context" 
- plan_generator: reads {research_context}
- CONNECTED: Data flows correctly between agents
```

**Emergency Session State Recovery:**
If session state flow is broken:
1. **Stop all implementation** immediately
2. **Revert to documented session state keys** from workflow documentation
3. **Update ALL agents** to use original key names
4. **Test complete workflow** before proceeding
5. **Update workflow docs** only after confirmed working system

### Essential ADK Patterns (Based on Real-World Experience)

#### Root Agent as Human Consultant Pattern
**✅ ROOT AGENT SHOULD:**
- **Act like a human consultant** meeting a new client
- **Gather business context first** before diving into work
- **Delegate control** to specialized workflow agents
- **Save context to session state** with `output_key`
- **Keep instructions simple and focused**

**❌ ROOT AGENT SHOULD NOT:**
- Contain complex processing logic
- Have detailed instructions about what sub-agents should do
- Try to orchestrate multiple agents directly
- Use both `sub_agents` and `tools` for the same agent
- Execute tools (delegate to sub-agents)

#### 🚨 CRITICAL: sub_agents vs tools Distinction

**🔑 KEY INSIGHT:**
- **`sub_agents`** = Delegate control (hand off conversation/workflow)
- **`tools`** = Call like function, get result back (stay in control)

**✅ CORRECT Usage:**
```python
# Delegate control to workflow
root_agent = LlmAgent(
    sub_agents=[workflow_agent],     # Hand off control
    # No tools - we're delegating, not calling
)

# Use helper agent as tool  
planning_agent = LlmAgent(
    tools=[AgentTool(plan_generator)],  # Call for specific help
    sub_agents=[execution_pipeline],    # Then delegate main work
)
```

**❌ NEVER DO THIS:**
```python
# Wrong - same agent in both (major error)
confused_agent = LlmAgent(
    sub_agents=[workflow_agent],        # Delegate control  
    tools=[AgentTool(workflow_agent)],  # Also call as tool? NO!
)
```

#### 🚨 CRITICAL: Agent Duplication Prevention

**🛑 MANDATORY VALIDATION**: Before implementing any agent, verify:

1. **No agent appears in both sub_agents AND tools** for the same parent agent
2. **Each agent has ONE role** - either a sub-agent OR a tool, never both
3. **Clear separation** between delegation (sub_agents) and function calls (tools)

**❌ REAL MISTAKE EXAMPLE (from actual implementation):**
```python
# WRONG - plan_generator appears in BOTH
root_agent = LlmAgent(
    sub_agents=[plan_generator_agent, research_pipeline],  # ❌ plan_generator here
    tools=[AgentTool(plan_generator)],                     # ❌ AND here too!
)
```

**✅ CORRECT IMPLEMENTATION:**
```python
# RIGHT - plan_generator is ONLY a tool, research_pipeline is ONLY a sub-agent
root_agent = LlmAgent(
    sub_agents=[research_pipeline],        # Delegate main workflow
    tools=[AgentTool(plan_generator)],     # Call for planning help
)
```

**🔍 VALIDATION CHECKLIST:**
- [ ] **No duplicate agents** across sub_agents and tools lists
- [ ] **Each agent has single role** - either delegation target OR helper tool
- [ ] **Architecture matches workflow docs** - verify agent roles are consistent
- [ ] **Clear responsibility separation** - no confusion about agent purposes

#### Session State Communication Only

**🔑 KEY INSIGHT:** Information ALWAYS flows through session state, never direct parameter passing.

**✅ CORRECT:**
```python
step1_agent = LlmAgent(
    name="step1_agent",
    instruction="Process the initial request and save findings...",
    output_key="step1_results"  # Saves to session state
)

step2_agent = LlmAgent(
    name="step2_agent", 
    instruction="""
    Read step1_results from session state:
    - analysis = session_state.get('step1_results')
    
    Process that data and provide next step...
    """,
    output_key="step2_results"  # Saves to session state
)
```

#### Built-in Tool Constraints (ABSOLUTE RULES)

**🚨 ADK Built-in Tools have strict limitations:**
- **Only ONE built-in tool per individual agent/workflow**
- **NO other tools can be used with built-in tools in the same agent**
- **Multiple agents in a system can each have their own built-in tool**
- **Each agent workflow gets its own built-in tool allowance**

**Available Built-in Tools:**
- **Google Search (`google_search`):** Web search capabilities
- **Code Execution (`built_in_code_execution`):** Execute Python code
- **Vertex AI Search (`VertexAiSearchTool`):** Query custom data stores

## 📋 ADK Agent Architecture Rules

### 🚀 Quick ADK Architecture Patterns

#### Agent Architecture Decision Flowchart
```
📝 What are you building?
│
├─ 🔧 Need different built-in tools?
│  ├─ Google Search + Code Execution needed?
│  │  └─ ✅ Multiple LlmAgents (one tool per agent)
│  └─ Only one built-in tool needed?
│     └─ ✅ Single LlmAgent with built-in tool
│
├─ 🔄 Need quality loops or iterative refinement?
│  └─ ✅ LoopAgent with critic-checker-action pattern
│
├─ ⚡ Sequential workflow with distinct phases?
│  └─ ✅ SequentialAgent with specialized sub-agents
│
└─ 🎯 Simple processing with clear instructions?
   └─ ✅ Single LlmAgent with comprehensive instructions
```

#### ADK Constraint Quick Reference

| Constraint | Rule | Example |
|------------|------|---------|
| **Built-in Tools** | One per agent maximum | `google_search` OR `code_execution`, never both |
| **Session State** | Use `output_key` to write | Never manual `session_state["key"] = value` |
| **Root Export** | Must end with `root_agent = my_agent` | System breaks without this line |
| **Agent Roles** | One role only: sub-agent OR tool | Never same agent in both lists |

### **🔗 ADK Lifecycle Callbacks**

**CRITICAL**: These are the ONLY valid ADK lifecycle callbacks. Do not invent callback parameters that don't exist.

#### **Valid ADK Callback Parameters:**

1. **`before_agent_callback`** - Setup, initialization, state preparation
2. **`after_agent_callback`** - Cleanup, post-processing, state transformation  
3. **`before_tool_callback`** - Tool preparation, input validation, logging
4. **`after_tool_callback`** - Result processing, error handling, state updates
5. **`before_model_callback`** - Rate limiting, request modification, monitoring
6. **`after_model_callback`** - Response processing, content transformation

#### **Real-World Callback Examples:**

##### **`before_agent_callback` - State Initialization**
```python
from google.adk.agents.callback_context import CallbackContext

def initialize_research_state(callback_context: CallbackContext) -> None:
    """Initialize all required state keys for the research workflow"""
    session_state = callback_context._invocation_context.session.state
    
    # Initialize all state keys that will be referenced throughout the workflow
    if "research_context" not in session_state:
        session_state["research_context"] = {}
    if "research_plan" not in session_state:
        session_state["research_plan"] = {}
    if "research_sections" not in session_state:
        session_state["research_sections"] = []

# Usage in agent
root_agent = Agent(
    name="root_agent",
    before_agent_callback=initialize_research_state,
    instruction="Coordinate research workflow",
)
```

##### **`after_agent_callback` - Source Collection**
```python
def collect_research_sources_callback(callback_context: CallbackContext) -> None:
    """Collect sources from grounding metadata - real ADK implementation"""
    session = callback_context._invocation_context.session
    url_to_short_id = callback_context.state.get("url_to_short_id", {})
    sources = callback_context.state.get("sources", {})
    id_counter = len(url_to_short_id) + 1
    
    for event in session.events:
        if not (event.grounding_metadata and event.grounding_metadata.grounding_chunks):
            continue
        
        for idx, chunk in enumerate(event.grounding_metadata.grounding_chunks):
            if not chunk.web:
                continue
            
            url = chunk.web.uri
            title = chunk.web.title if chunk.web.title != chunk.web.domain else chunk.web.domain
            
            if url not in url_to_short_id:
                short_id = f"src-{id_counter}"
                url_to_short_id[url] = short_id
                sources[short_id] = {
                    "short_id": short_id,
                    "title": title,
                    "url": url,
                    "domain": chunk.web.domain,
                    "supported_claims": [],
                }
                id_counter += 1
    
    callback_context.state["url_to_short_id"] = url_to_short_id
    callback_context.state["sources"] = sources

# Usage in agent
research_agent = LlmAgent(
    name="research_agent",
    tools=[google_search],
    after_agent_callback=collect_research_sources_callback,
)
```

##### **`before_model_callback` - Rate Limiting**
```python
import time
from google.adk.models import LlmRequest

RATE_LIMIT_SECS = 60
RPM_QUOTA = 10

def rate_limit_callback(callback_context: CallbackContext, llm_request: LlmRequest) -> None:
    """Rate limit model calls to prevent API quota exhaustion"""
    now = time.time()
    
    if "timer_start" not in callback_context.state:
        callback_context.state["timer_start"] = now
        callback_context.state["request_count"] = 1
        return
    
    request_count = callback_context.state["request_count"] + 1
    elapsed_secs = now - callback_context.state["timer_start"]
    
    if request_count > RPM_QUOTA:
        delay = RATE_LIMIT_SECS - elapsed_secs + 1
        if delay > 0:
            time.sleep(delay)
        callback_context.state["timer_start"] = now
        callback_context.state["request_count"] = 1
    else:
        callback_context.state["request_count"] = request_count

# Usage in agent
agent = Agent(
    name="rate_limited_agent",
    before_model_callback=rate_limit_callback,
)
```

##### **`after_model_callback` - Content Processing**
```python
from google.genai import types as genai_types
import re

def citation_replacement_callback(callback_context: CallbackContext) -> genai_types.Content:
    """Replace citation tags with markdown links - real ADK implementation"""
    final_report = callback_context.state.get("final_cited_report", "")
    sources = callback_context.state.get("sources", {})

    def tag_replacer(match: re.Match) -> str:
        short_id = match.group(1)
        if not (source_info := sources.get(short_id)):
            return ""
        display_text = source_info.get("title", source_info.get("domain", short_id))
        return f" [{display_text}]({source_info['url']})"

    processed_report = re.sub(
        r'<cite\s+source\s*=\s*["\']?\s*(src-\d+)\s*["\']?\s*/>',
        tag_replacer,
        final_report,
    )
    processed_report = re.sub(r"\s+([.,;:])", r"\1", processed_report)
    callback_context.state["final_report_with_citations"] = processed_report
    return genai_types.Content(parts=[genai_types.Part(text=processed_report)])

# Usage in agent
report_agent = LlmAgent(
    name="report_composer",
    after_model_callback=citation_replacement_callback,
)
```

##### **`before_tool_callback` - Input Validation**
```python
from google.adk.tools import BaseTool
from typing import Dict, Any

def before_tool_callback(tool: BaseTool, args: Dict[str, Any], tool_context: CallbackContext):
    """Validate tool inputs and apply business rules"""
    # Customer ID validation example
    if 'customer_id' in args:
        valid, err = validate_customer_id(args['customer_id'], tool_context.state)
        if not valid:
            return err
    
    # Business rule example
    if tool.name == "sync_ask_for_approval":
        amount = args.get("value", None)
        if amount <= 10:
            return {
                "status": "approved",
                "message": "Auto-approved for small amounts"
            }
    return None

# Usage in agent
agent = Agent(
    name="customer_service",
    tools=[approval_tool],
    before_tool_callback=before_tool_callback,
)
```

##### **`after_tool_callback` - Result Processing**
```python
from google.adk.tools.tool_context import ToolContext

def after_tool_callback(tool: BaseTool, args: Dict[str, Any], tool_context: ToolContext, tool_response: Dict):
    """Process tool results and perform follow-up actions"""
    if tool.name == "approve_discount":
        if tool_response.get('status') == "approved":
            # Automatically apply the discount
            apply_discount_to_cart(args.get('customer_id'), args.get('amount'))
    
    return None

# Usage in agent
agent = Agent(
    name="customer_service",
    tools=[discount_tool],
    after_tool_callback=after_tool_callback,
)
```

#### **Callback Best Practices:**

1. **Single Responsibility**: Each callback should handle one specific concern
2. **Error Handling**: Always include proper error handling and fallbacks
3. **State Validation**: Validate state keys exist before accessing them
4. **Performance**: Keep callbacks lightweight to avoid blocking agent execution
5. **Logging**: Add appropriate logging for debugging and monitoring

#### **Common Callback Use Cases:**

- **State Initialization**: Set up required session state keys with default values
- **Source Collection**: Extract and organize research sources from grounding metadata
- **Citation Processing**: Transform citation tags into formatted links
- **Rate Limiting**: Prevent API quota exhaustion through request throttling
- **Input Validation**: Validate tool inputs and apply business rules
- **Result Processing**: Transform tool results and trigger follow-up actions
- **Content Transformation**: Modify agent outputs before final delivery

**🚨 IMPORTANT**: Never create custom callback parameters like `initialize_research_state` - only use the 6 valid ADK lifecycle callbacks listed above.

---

## 8. Agent System Design

### Agent Hierarchy Structure
<!-- Define the complete agent hierarchy based on approved strategy -->
```
Root Agent (Main Orchestrator)
├── Agent 1 (Specific Role)
│   ├── Built-in Tool: [tool_name]
│   └── Session State: [reads X, writes Y]
├── Agent 2 (Specific Role)
│   ├── Function Tools: [tool1, tool2, tool3]
│   └── Session State: [reads Y, writes Z]
└── Agent 3 (Specific Role)
    ├── Built-in Tool: [tool_name]
    └── Session State: [reads Z, writes final_result]
```

### Agent Specifications

#### Root Agent
- **Type:** [LlmAgent with coordination instructions]
- **Role:** [Human consultant pattern - gather context and delegate]
- **Sub-agents:** [List of sub-agents to delegate to]
- **Tools:** [None - delegates only, OR AgentTool helpers - NEVER same as sub-agents]
- **Session State:** [What context it gathers and saves]
- **Instructions:** [Brief coordination instructions]
- **🚨 CRITICAL:** Verify NO agent appears in both sub_agents AND tools lists

#### Agent 1: [Agent Name]
- **Type:** [LlmAgent, SequentialAgent, ParallelAgent, or LoopAgent]
- **Role:** [Specific responsibility and focus]
- **Tools:** [Built-in tool OR function tools, never both]
- **Session State:** [What it reads and writes]
- **Instructions:** [Core processing instructions]

#### Agent 2: [Agent Name]
- **Type:** [Agent type]
- **Role:** [Specific responsibility]
- **Tools:** [Tool allocation]
- **Session State:** [Data flow]
- **Instructions:** [Processing focus]

### Session State Protocol
<!-- How agents communicate through session state -->
**📋 Session State Naming Convention:**
- `user_request` - Original user input from root agent
- `business_context` - Gathered context from root agent consultation
- `[step1]_results` - Output from first processing step
- `[step2]_results` - Output from second processing step
- `final_report` - Complete output ready for user

### Universal Agent Instruction Design (Learned from Real Implementation)

#### Context Injection Pattern for Universal Agents
**✅ CORRECT UNIVERSAL INSTRUCTION TEMPLATE:**
```python
instruction = """
You are a [ROLE] who works across ALL industries and business types.

**CONTEXT FROM SESSION STATE:**
Industry Type: {industry_type}
Business Model: {business_model_type}  
Business Context: {business_context}

## UNIVERSAL APPROACH
Based on the industry ({industry_type}) and business model ({business_model_type}), 
adapt your strategy accordingly:

**For Consumer Goods Industries:**
- Focus on brand differentiation and retail distribution channels
- Research product comparison sites and customer review platforms

**For Technology/SaaS Industries:**
- Analyze software comparison sites (G2, Capterra) and developer communities
- Study integration ecosystems and technical documentation

**For Service Industries:**
- Research professional directories and client testimonials
- Focus on local vs national service provider competition

**For Healthcare Industries:**
- Examine healthcare technology directories and medical associations
- Consider regulatory compliance and certification requirements

This universal approach ensures your analysis works for nicotine pouches, shipkit.ai, 
dental software, restaurants, consulting services, and any other business type.
"""
```

#### Avoid Example-Driven Instructions
**❌ BAD - Hardcoded Examples (Real Failure):**
```python
# This completely failed when user asked about healthcare or consumer goods
instruction = """
Find competitors like shipkit.io and shipfa.st for rapid deployment tools.
Search for "SaaS boilerplate marketplace" and "developer productivity tools".  
Focus on template + course combinations like shipfa.st.
"""
```

**✅ GOOD - Universal Pattern Recognition:**
```python
# This works for ANY industry + business model combination
instruction = """  
Find competitors with the same industry + business model combination.
Generate search terms based on:
- Industry-specific terminology and distribution channels  
- Business model keywords and pricing approaches
- Target customer segments and problem domains
"""
```

### Instruction Design Best Practices
This section provides the gold standard for writing effective agent instructions, based on analysis of all agent prompts in the repository.

#### 🚨 MANDATORY: Current Date/Year Verification

**BEFORE writing any agent instructions, task documents, or code that references years/dates:**

1. **TIME TOOL REQUIRED**: Use `time` tool to verify current date (fallback to web search if time tool unavailable)
2. **UPDATE ALL REFERENCES**: Replace any 2024 references with current year (2025)
3. **AVOID TRAINING DATA ASSUMPTIONS**: Never assume year based on AI training data
4. **DOCUMENT VERIFICATION**: Note in task documents that date was verified

**Example of Required Date Verification:**
```
❌ BAD: "Include recent sources (preferably 2024 data)"
✅ GOOD: "Include recent sources (preferably 2025 data)" [after web search confirmation]
```

#### Core Principles of Effective Prompting
To turn a simple set of commands into a high-quality prompt, adhere to these core principles. They explain *why* the universal structure works so effectively.

1.  **Principle 1: Role-Playing for Consistency**
    *   **Why it works**: Assigning a role (e.g., `You are an expert financial advisor.`) primes the LLM to access a specific domain of knowledge and adopt a consistent tone. It dramatically reduces variability and improves the quality of the response.

2.  **Principle 2: Structure for Clarity & Reliability**
    *   **Why it works**: Large Language Models can lose track of complex instructions. Breaking tasks into explicit, numbered phases (`Phase 1: ...`, `Phase 2: ...`) forces a logical, step-by-step execution. This is the most critical technique for ensuring the agent completes all parts of a multi-step task without skipping ahead.

3.  **Principle 3: Explicit Constraints for Safety**
    *   **Why it works**: LLMs can hallucinate actions or make unsafe assumptions. Adding clear, negative constraints (e.g., `You must NOT...`, `NEVER...`) acts as a powerful guardrail, preventing the agent from performing unintended or incorrect actions.

4.  **Principle 4: Format Specification for Predictability**
    *   **Why it works**: When an agent's output is consumed by another system or agent, its structure must be predictable. Demanding a specific format (e.g., `Your response must be a single, raw JSON object...`) makes the output reliable and machine-parseable, which is essential for stable multi-agent workflows.

#### The Universal Prompt Structure
High-quality agent instructions follow a clear, hierarchical structure:

1.  **Role Declaration**: Always start with a single, crisp sentence that defines the agent's persona and expertise.
    > **Example**: `You are an expert financial advisor.`

2.  **High-Level Goal**: Immediately follow the role with a one-sentence objective.
    > **Example**: `Your goal is to provide users with accurate and well-supported answers to their questions.`

3.  **Context Injection (from Session State)**: If the agent consumes data from the session, present it next using a simple, human-readable preamble.
    > **Example**:
    > ```text
    > Here is the research plan:
    > {research_plan}
    > ```

4.  **Phase-Based Execution / Workflow**: Break the core logic into explicitly numbered or named phases (e.g., `Phase 1: ...`, `Step 1: ...`). This is the most critical pattern for ensuring reliable, step-by-step execution.
    > **Example**:
    > ```text
    > **Phase 1: Goal Alignment**
    > - Understand and confirm the user's primary marketing objectives.
    >
    > **Phase 2: Strategy Development**
    > - Develop a comprehensive marketing strategy based on the aligned goals.
    > ```

5.  **Tool Usage Guidelines**: Be explicit about *which* tools to use and *when*. Provide rules for their invocation.
    > **Example**:
    > ```text
    > *   Use the `search` tool to find relevant products.
    > *   **Note:** You must ONLY click on the buttons that are visible on the CURRENT webpage.
    > ```

6.  **Constraints and Rules**: Use a dedicated section (e.g., `# Rules` or `**CRITICAL CONSTRAINTS:**`) to outline non-negotiable rules of engagement.

7.  **Output Format Specification**: If the output needs to be structured (e.g., for a downstream agent), define the exact format.
    > **Example**:
    > ```text
    > **Output Format**
    > The last block of your output should be a Markdown-formatted list, summarizing your verification result.
    > ```

#### A Worked Example: From User Request to High-Quality Prompt
This example demonstrates how to apply the principles to transform a simple request into a robust agent instruction.

**1. The Raw User Request:**
> "I need an agent that can research a topic for me and then write a summary."

**2. Deconstruction & Analysis:**
-   **Core Actions**: "research", "write summary"
-   **Implicit Persona**: A research assistant.
-   **Inputs**: A `topic` (string).
-   **Outputs**: A `summary` (string, likely Markdown).
-   **Dependencies**: The "write summary" action depends on the "research" action. This implies a two-phase sequence.
-   **Tools**: The "research" action will require a search tool.

**3. Applying the Universal Structure (First Draft):**
```text
You are a research assistant.
Your goal is to research a topic and write a summary.

Here is the research topic:
{topic}

**Phase 1: Research**
Use the `google_search` tool to find information about the topic.

**Phase 2: Write Summary**
Write a summary of your findings.

**Output Format**
A Markdown summary.
```

**4. Refining with Principles (Final, High-Quality Prompt):**
This version adds specificity, constraints, and clearer formatting rules to make the agent far more reliable.

```text
You are an expert research assistant.
Your primary goal is to conduct thorough research on a given topic and produce a concise, well-structured summary.

Here is the research topic:
{topic}

---
**Phase 1: Information Gathering**

**Your Task:**
1.  Formulate 3 distinct, targeted search queries to investigate the topic.
2.  Execute each query using the `google_search` tool.
3.  Synthesize the results into a set of key findings.

**CRITICAL CONSTRAINTS:**
-   You must execute exactly 3 searches.
-   You must use only the `google_search` tool.

---
**Phase 2: Summary Generation**

**Your Task:**
1.  Review the key findings from Phase 1.
2.  Compose a summary of the topic.

**CRITICAL CONSTRAINTS:**
-   You must NOT use any tools in this phase.
-   Your summary must be based ONLY on the information gathered in Phase 1.

---
**Output Format**
Your final output must be a single Markdown document with the following structure:
## Summary of [Topic]
### Key Findings
-   [Bulleted list of 3-5 key findings]
### Detailed Summary
[A multi-paragraph summary]
```

#### Common Pitfalls & Anti-Patterns (How to Fix Bad Prompts)

| Pitfall / Anti-Pattern | ❌ Bad Example | ✅ Good Example (The Fix) | Why it's Better |
|---|---|---|---|
| **Vague, Ambiguous Goals** | "Summarize the research." | "Generate a bulleted list of the top 5 key findings from the research." | Provides a concrete, measurable, and verifiable goal. |
| **Implicit Assumptions** | "Find relevant information." | "Execute 3 searches using the `google_search` tool to find credible sources." | Explicitly names the tool and sets a clear success metric. |
| **Conversational Language** | "Could you please try to find out about...?" | "Your task is to investigate the following topic using these steps:" | Imperative, direct commands lead to more consistent and reliable execution. |
| **Missing Output Format** | "Provide the results." | "Your final output must be a JSON object with two keys: 'summary' (string) and 'sources' (list of strings)." | Ensures the output is structured, predictable, and machine-readable for downstream tasks. |
| **Lack of Constraints** | "Feel free to use tools to help." | "**CRITICAL RULE:** You must ONLY use the `google_search` tool. Do not use any other tools." | Prevents the agent from using unintended tools or performing unsafe actions. |
| **Outdated Year References** | "Include recent sources (preferably 2024 data)" | "Include recent sources (preferably 2025 data)" [after web search verification] | Uses current year information, not AI training data assumptions. |

#### Canonical Examples of Common Agent Prompts
The following are complete, high-quality examples taken from the agent library, representing the most common agent archetypes.

**1. The Root Agent as a Dynamic Delegator (`travel-concierge`)**

This agent acts as the main entry point or "human consultant." It does not perform the detailed work itself. Its sole purpose is to understand the user's context (e.g., is the trip in the planning phase, underway, or over?) and delegate the task to the appropriate specialist sub-agent. This is a powerful pattern for creating sophisticated, context-aware applications.

```python
# This instruction is dynamically generated using an f-string to inject real-time context.
root_agent_instruction = f"""
You are a travel concierge agent.

Current user:
  <user_profile>
  {user_profile}
  </user_profile>

Current time: {_time}

Trip phases:
- If "{itinerary_datetime}" is before "{itinerary_start_date}", we are in "pre_trip" phase
- If "{itinerary_datetime}" is between "{itinerary_start_date}" and "{itinerary_end_date}", we are in "in_trip" phase
- If "{itinerary_datetime}" is after "{itinerary_end_date}", we are in "post_trip" phase

<itinerary>
{itinerary}
</itinerary>

Delegate to appropriate phase agents: pre_trip, in_trip, post_trip.
"""
```

*   **Why this works:**
    *   **Dynamic Context**: It uses f-strings to inject the current time and user itinerary. This allows the LLM to make a real-time decision about which "phase" the user is in.
    *   **Clear Delegation Logic**: The instructions don't say *how* to book a flight or find a hotel. They are entirely focused on one high-level task: evaluate the current phase and delegate to the correct sub-agent (`pre_trip`, `in_trip`, or `post_trip`).
    *   **Separation of Concerns**: This agent masters orchestration, leaving the detailed work to specialist agents.

**2. The Tool-Using Specialist (`llm-auditor/critic`)**

This agent has a single, highly focused, and complex task: to act as an investigative journalist, verify claims, and produce a structured report. It relies on a tool (`google_search`) to accomplish its goal. The prompt is a masterclass in providing clear, phased instructions and demanding a specific output.

```text
You are a professional investigative journalist, excelling at critical thinking and verifying information...

# Your task
Your task involves three key steps: First, identifying all CLAIMS presented in the answer. Second, determining the reliability of each CLAIM. And lastly, provide an overall assessment.

## Step 1: Identify the CLAIMS
Carefully read the provided answer text. Extract every distinct CLAIM made within the answer.

## Step 2: Verify each CLAIM
For each CLAIM you identified... use your general knowledge and/or search the web to find evidence...
Determine the VERDICT:
    * Accurate: ...
    * Inaccurate: ...
    * Disputed: ...

## Step 3: Provide an overall assessment
...

# Output format
The last block of your output should be a Markdown-formatted list, summarizing your verification result.
```

*   **Why this works:**
    *   **Strong Persona**: "You are a professional investigative journalist" immediately sets a high standard for critical thinking.
    *   **Phased Execution**: The task is broken into three unambiguous steps, ensuring the agent follows a reliable workflow.
    *   **Explicit Tool Guidance**: It clearly instructs the agent to "search the web," guiding it to use its `google_search` tool.
    *   **Strict Output Contract**: Demanding a specific Markdown format ensures its output is predictable and can be reliably parsed by the next agent in the sequence.

**3. The Sequential Pipeline Step (`llm-auditor/reviser`)**

This agent is designed to be a step within a `SequentialAgent` pipeline. It's a perfect example of an agent that consumes the structured output from a previous agent (the `critic`) and performs a transformation. Its instructions are simple and laser-focused on its single task.

```text
You are a professional copywriter responsible for revising a text according to a critique.

Here is the original question, the original answer, and the critique of the answer from a trusted source.

Rewrite the original answer to address all the points in the critique.

* If the critique says the answer is correct, you can just repeat the original answer.
* If the critique says the answer is incorrect, you should correct it.
* If the critique says the answer is incomplete, you should add the missing information.
* You should address all the points in the critique.
* You should produce a comprehensive answer to the question.
* Your answer should be well-written and easy to understand.
* Do not copy the critique in your answer.
* Do not mention the critique in your answer.
```

*   **Why this works:**
    *   **Clear Input Assumption**: The prompt is written with the explicit assumption that it will receive the "original question, the original answer, and the critique" from the previous step in the pipeline.
    *   **Single, Focused Task**: The agent's goal is unambiguous: "Rewrite the original answer to address all the points in the critique." It has no other responsibilities.
    *   **Conditional Logic**: It provides simple `if...then` rules to handle different types of critiques, guiding the LLM's response based on the input.
    *   **Negative Constraints**: Rules like "Do not copy the critique" and "Do not mention the critique" are crucial for preventing the agent from including unwanted artifacts in its final output.
 
#### Advanced Patterns & Recommendations
-   **Externalize Complex Prompts**: For any instruction longer than a few lines, create a `prompt.py` file in the agent's directory and import the instruction string. This keeps `agent.py` clean.
-   **Use Dynamic Instructions**: Leverage Python f-strings to inject runtime context (e.g., `datetime.now()`, user data from session state) into prompts, making agents more context-aware.
-   **Focus Coordinator Prompts on Delegation**: When an agent's role is to orchestrate `AgentTool`s, its instructions should focus on *delegation strategy* (i.e., *when* to call which tool) rather than execution details.

#### Canonical Examples

1.  **Minimal State-Driven Agent**
    ```python
    section_planner_agent = LlmAgent(
        name="section_planner_agent",
        model=config.model,
        output_key="research_sections",
        instruction="""
    Here is the research plan:
    {research_plan}

    **Your Task**
    Generate a detailed outline that breaks the plan into research sections.

    **Output format (Markdown)**
    - `### [Section Title]`
      - **Objective**: ...
      - **Questions**: ...
    """
    )
    ```

2.  **Tool-Heavy Phase-Based Agent (Instruction Excerpt)**
    ```text
    **Phase 2: Search Phase**
    *   Use the "search" tool to find relevant products based on the user's request.
    *   Present the search results to the user, highlighting key product options.
    *   Ask the user which product they would like to explore further.
    ```

4.  **The Action-Critic-Checker Loop (`LoopAgent`)**

    This is one of the most powerful patterns in the ADK, used for iterative refinement and quality assurance. The loop contains three distinct roles: an **Action Taker** to perform or enhance work, a **Critic** to evaluate the work, and a **Checker** to decide if the loop should end.

    **The Canonical Structure:**
    ```python
    iterative_refinement_loop = LoopAgent(
        name="iterative_refinement_loop",
        max_iterations=config.max_search_iterations,
        sub_agents=[
            research_evaluator,         # The Critic
            EscalationChecker(name="escalation_checker"), # The Checker
            enhanced_search_executor,   # The Action Taker (for the next iteration)
        ],
    )
    ```

    ---

    **Component 1: The Critic Agent (`LlmAgent`)**

    The Critic's job is to evaluate the work done in the previous step (e.g., by an initial `section_researcher`) and produce structured, machine-readable feedback. It uses a Pydantic `output_schema` to ensure its output is reliable.

    ```python
    from pydantic import BaseModel, Field
    from typing import Literal

    class Feedback(BaseModel):
        """Model for providing evaluation feedback on research quality."""
        grade: Literal["pass", "fail"] = Field(...)
        comment: str = Field(...)
        follow_up_queries: list[str] | None = Field(default=None)

    research_evaluator = LlmAgent(
        model=config.critic_model,
        name="research_evaluator",
        instruction="""
        You are a meticulous quality assurance analyst evaluating the research findings in 'section_research_findings'.
        If you find significant gaps, assign a grade of "fail" and generate specific follow-up queries.
        If the research is comprehensive, grade "pass".
        Your response must be a single, raw JSON object validating against the 'Feedback' schema.
        """,
        output_schema=Feedback,
        output_key="research_evaluation", # Writes the Feedback object to the session
    )
    ```

    ---

    **Component 2: The Checker Agent (`BaseAgent`)**

    The Checker is a simple, non-LLM agent. It reads the Critic's evaluation from the session state and decides whether to stop the loop. This is the official ADK pattern for loop control.

    ```python
    from google.adk.agents import BaseAgent, Event, EventActions
    from google.adk.agents.invocation_context import InvocationContext

    class EscalationChecker(BaseAgent):
        """Checks the critic's grade and escalates to stop the loop if it's 'pass'."""
        
        def __init__(self, name: str):
            super().__init__(name=name)
            # ❌ NEVER implement custom max_iterations logic here
            # ✅ LoopAgent handles iteration limits automatically
        
        async def _run_async_impl(self, ctx: InvocationContext) -> AsyncGenerator[Event, None]:
            evaluation = ctx.session.state.get("research_evaluation")
            
            # ✅ ONLY check quality criteria, NOT iteration counts
            if evaluation and evaluation.get("grade") == "pass":
                # This 'escalate=True' event is the signal to stop the LoopAgent
                yield Event(author=self.name, actions=EventActions(escalate=True))
            else:
                # Yielding a simple event allows the loop to continue
                # LoopAgent will automatically handle max_iterations
                yield Event(author=self.name)
    ```

    ---

    **Component 3: The Action Taker Agent (`LlmAgent`)**

    This agent only runs if the Checker allows the loop to continue. It takes the Critic's feedback (e.g., `follow_up_queries`) and performs a corrective action. Its output often overwrites the original data that was critiqued.

    ```python
    enhanced_search_executor = LlmAgent(
        model=config.worker_model,
        name="enhanced_search_executor",
        instruction="""
        You have been activated because the previous research failed validation.
        Review the 'research_evaluation' state key to understand the feedback.
        Execute EVERY query listed in 'follow_up_queries' using the 'google_search' tool.
        Combine the new findings with the old to improve the research.
        """,
        tools=[google_search],
        output_key="section_research_findings", # Overwrites the original findings
    )
    ```

    **❌ LOOP AGENT ANTI-PATTERNS (NEVER DO THIS):**
    - Do NOT pass a `stop_condition` function to the `LoopAgent` constructor.
    - Do NOT pass `callbacks` to the `LoopAgent` constructor.
    - **Do NOT implement custom max_iterations logic in sub-agents** - use `LoopAgent`'s built-in `max_iterations` parameter.
    - The loop's control flow logic MUST be encapsulated within a sub-agent for quality checks only.

    **✅ CORRECT LOOP AGENT PATTERNS:**
    - **Use `max_iterations` parameter** on the `LoopAgent` itself for iteration limits.
    - **Custom BaseAgent sub-agents** should only check quality/completion criteria, NOT iteration counts.
    - **Let LoopAgent handle iteration management** - don't duplicate this logic in sub-agents.

### Session State Dependency Table (Required)

🛑 **STOP GATE:** This section MUST be completed and validated BEFORE any agent implementation begins.

**🚨 MANDATORY VALIDATION PROCESS:**
1. **Complete the table** with ALL agents and their session state interactions
2. **Verify every `{placeholder}` read** has a corresponding upstream writer
3. **Cross-reference with workflow documents** (if provided) to ensure alignment
4. **Identify any orphaned reads** and propose fixes to user
5. **Get user approval** for any proposed session state changes

| Agent | Writes (`output_key` / callback) | Reads (`{placeholder}`) | Upstream Source(s) | Notes / Proposed Fixes |
|-------|----------------------------------|-------------------------|--------------------|------------------------|
|       |                                  |                         |                    |                        |

**State Integrity Verification Checklist:**
- [ ] **All reads traced**: Every `{placeholder}` in agent instructions has upstream writer
- [ ] **No orphaned reads**: No agent reads keys that don't exist
- [ ] **Workflow alignment**: Session state matches provided workflow documentation
- [ ] **User approval**: Any proposed fixes have been approved by user
- [ ] **Clear data flow**: Session state flow is logical and well-documented

**🚨 IF ANY ORPHANED READS FOUND:**
**STOP IMPLEMENTATION** and ask user with suggested fixes:

"I found orphaned session state reads that need resolution before proceeding:

**Orphaned Reads Found:**
- `{company_name}` in [agent_name] - no upstream writer found
- `{industry}` in [agent_name] - no upstream writer found

**Suggested Fixes:**
1. **Option A:** Update agent to read existing keys like `{research_findings}` 
2. **Option B:** Add upstream agent to write `company_name` and `industry` to session state
3. **Option C:** Remove these placeholders and use static instructions

Which approach would you prefer?"

---

## 9. Tool Integration & Distribution

### Tool Architecture Strategy
<!-- Choose approach based on approved agent architecture -->

**Selected Strategy:** [Based on strategic analysis choice]

#### Built-in Tool Distribution
<!-- One built-in tool per agent - strict ADK constraint -->
- **[Agent Name]:** `google_search` - [Why this agent needs web search]
- **[Agent Name]:** `built_in_code_execution` - [Why this agent needs code execution]
- **[Agent Name]:** `VertexAiSearchTool` - [Why this agent needs vertex search]

#### Function Tool Distribution
<!-- Multiple function tools per agent allowed -->
- **[Agent Name]:** [function_tool1, function_tool2, function_tool3] - [Processing requirements]
- **[Agent Name]:** [validation_tool, report_tool] - [Validation and output requirements]

#### Root Agent (Coordinator)
<!-- Root agent typically has no tools - delegates only -->
- **Tools:** None - delegates to sub-agents with appropriate tools
- **Coordination:** Uses BuiltInPlanner for workflow coordination

### Tool-Agent Mapping Justification
<!-- Explain why each tool goes to each agent -->
- **Built-in Tool Constraints:** [How ADK limitations shaped tool distribution]
- **Specialization Benefits:** [Why specific agents need specific tools]
- **Workflow Efficiency:** [How tool distribution supports agent coordination]

---

### 🚨 CRITICAL: ADK Function Tool Creation Guide

**MANDATORY: Read Before Creating ANY Custom Tools**

Based on the official ADK documentation, there are **three types of tools** available:

#### **1. Function Tool (Most Common)**
**✅ CORRECT PATTERN:** Simple Python functions - ADK automatically wraps them as tools

```python
# Official ADK Example (from documentation) - Simple tool without context
def get_stock_price(symbol: str):
    """
    Retrieves the current stock price for a given symbol.

    Args:
        symbol (str): The stock symbol (e.g., "AAPL", "GOOG").

    Returns:
        float: The current stock price, or None if an error occurs.
    """
    try:
        stock = yf.Ticker(symbol)
        historical_data = stock.history(period="1d")
        if not historical_data.empty:
            current_price = historical_data['Close'].iloc[-1]
            return current_price
        else:
            return None
    except Exception as e:
        print(f"Error retrieving stock price for {symbol}: {e}")
        return None

# Function Tool WITH Context Access (for session state management)
from google.adk.tools import ToolContext

def save_user_preferences(preferences: str, tool_context: ToolContext) -> dict:
    """
    Save user preferences to session state.
    
    Args:
        preferences (str): Complete user preferences information (theme, language, etc.)
        tool_context (ToolContext): ADK context for state access (ALWAYS LAST PARAMETER)
        
    Returns:
        Dictionary with operation status and confirmation message
    """
    # Read from session state  
    current_prefs = tool_context.state.get("user_preferences", {})
    
    # Save the complete preferences information
    tool_context.state["user_preferences"] = preferences
    
    return {
        "status": "success",
        "message": "User preferences saved successfully"
    }

# Usage in agent - ADK automatically wraps functions as tools
agent = LlmAgent(
    model='gemini-2.0-flash',
    name='preference_agent',
    tools=[get_stock_price, save_user_preferences],  # ✅ Direct functions - ADK handles wrapping
    instruction='You can get stock prices and save user preferences...'
)
```

#### **2. Long Running Function Tool**
**For operations that take significant time:**

```python
from google.adk.tools import LongRunningFunctionTool  # Only needed for long-running tools

def ask_for_approval(purpose: str, amount: float) -> dict[str, str]:
    """Ask for approval for the reimbursement."""
    # Create approval ticket, send notification
    return {
        'status': 'pending', 
        'approver': 'Manager', 
        'purpose': purpose, 
        'amount': amount,
        'ticket-id': 'approval-ticket-1'
    }

# Usage
long_running_tool = LongRunningFunctionTool(func=ask_for_approval)
agent = LlmAgent(
    name="approval_agent",
    tools=[long_running_tool],
    instruction="Use ask_for_approval for expense approvals"
)
```

#### **3. Agent-as-a-Tool**
**Using other agents as tools:**

```python
from google.adk.tools.agent_tool import AgentTool

# Create specialist agent
search_agent = LlmAgent(
    name="search_specialist", 
    tools=[google_search],
    instruction="Perform web searches"
)

# Use as tool in coordinator
coordinator = LlmAgent(
    name="coordinator",
    tools=[AgentTool(agent=search_agent)],  # ✅ Agent as tool
    instruction="Use search_specialist for research tasks"
)
```

### **🚨 CRITICAL ADK Function Tool Requirements:**

#### **🚨 MANDATORY: No Default Parameter Values**
```python
# ❌ WRONG: LLM cannot interpret default values
def bad_function(name: str, age: int = 25):  # WILL BREAK
    pass

# ✅ CORRECT: All parameters must be explicit
def good_function(name: str, age: int) -> dict[str, str]:
    pass
```

#### **🚨 MANDATORY: Tool Context as Last Parameter (When Needed)**
```python
from google.adk.tools import ToolContext

# ✅ CORRECT: tool_context as LAST parameter
def manage_state(user_id: str, action: str, tool_context: ToolContext) -> dict:
    """Function that needs session state access."""
    # Read from state
    current_data = tool_context.state.get("user_data", {})
    
    # Update state
    tool_context.state["user_data"] = updated_data
    
    return {"status": "success"}

# ❌ WRONG: tool_context not last parameter
def bad_tool(tool_context: ToolContext, user_id: str, action: str) -> dict:  # WRONG ORDER
    pass
```

#### **🚨 MANDATORY: Comprehensive Docstring**
```python
def save_data(user_id: str, data: dict, tool_context: ToolContext) -> dict[str, str]:
    """Save user data to session state with validation.
    
    The docstring is SENT TO THE LLM and is critical for proper tool usage.
    Explain the purpose, parameters, and return values clearly.
    
    Args:
        user_id (str): Unique identifier for the user (required)
        data (dict): Dictionary containing user data to save
        tool_context (ToolContext): ADK context for state access (ALWAYS LAST)
        
    Returns:
        Dictionary with 'status' and 'message' keys indicating result
    """
    # Read current state
    current_state = tool_context.state.get("users", {})
    
    # Update state
    current_state[user_id] = data
    tool_context.state["users"] = current_state
    
    return {"status": "success", "message": f"Data saved for user {user_id}"}
```

#### **🚨 CRITICAL: Session State Access Patterns**
```python
from google.adk.tools import ToolContext

def session_state_example(param: str, tool_context: ToolContext) -> dict:
    """Example of correct session state read/write patterns."""
    
    # ✅ CORRECT: Reading from session state
    existing_data = tool_context.state.get("data_key", {})
    user_prefs = tool_context.state.get("preferences", [])
    
    # ✅ CORRECT: Writing to session state
    tool_context.state["data_key"] = {"new": "value"}
    tool_context.state["updated_at"] = datetime.now().isoformat()
    
    # ❌ WRONG: Trying to access CallbackContext (doesn't work in tools)
    # callback_context = CallbackContext.get_current()  # INVALID IN TOOLS
    
    return {"status": "success", "message": "State updated"}
```

#### **🚨 CRITICAL: JSON-Serializable Types Only**
```python
# ✅ ALLOWED TYPES: str, int, float, bool, list, dict
def good_function(
    name: str,           # ✅ String
    age: int,            # ✅ Integer  
    height: float,       # ✅ Float
    active: bool,        # ✅ Boolean
    tags: list[str],     # ✅ List
    metadata: dict,      # ✅ Dictionary
    tool_context: ToolContext  # ✅ ToolContext (when needed)
) -> dict[str, str]:
    pass

# ❌ FORBIDDEN: Custom classes, complex objects
def bad_function(
    user: UserObject,    # ❌ Custom class
    date: datetime,      # ❌ Complex object
    config: MyConfig     # ❌ Custom type
) -> UserObject:         # ❌ Custom return
    pass
```

### **✅ ADK Function Tool Best Practices (Based on Official Examples):**

1. **🚨 CRITICAL Requirements (Will Break if Missing):**
   - **NEVER** use default parameter values (LLM cannot interpret them)
   - **MANDATORY** comprehensive docstring (sent directly to LLM)
   - **ONLY** JSON-serializable types: `str`, `int`, `float`, `bool`, `list`, `dict`

2. **🎯 Parameter Design Best Practices:**
   - **Prefer fewer parameters:** Single `context` string vs. multiple separate fields
   - **Simplify for LLM:** Easier to pass one structured string than multiple parameters
   - **Group related data:** Instead of 7 separate parameters, use one comprehensive parameter

   ```python
   # ❌ TOO COMPLEX: Many separate parameters
   def save_context(desc: str, industry: str, model: str, market: str, 
                    value: str, focus: str, objectives: str, tool_context: ToolContext):
       pass
   
   # ✅ SIMPLE: Single context parameter  
   def save_context(context: str, tool_context: ToolContext):
       """Save complete structured context - much simpler for LLM to use."""
       tool_context.state["research_context"] = context
       return "Context saved successfully"
   ```

3. **Recommended Patterns (From Official Examples):**
   - **Simple Returns:** Return the actual data (`float`, `str`, `None`) not wrapper dictionaries
   - **Error Handling:** Use try/catch blocks, return `None` or fallback values for errors
   - **Clear Docstring:** Include Args and Returns sections with type information
   - **Meaningful Names:** Function and parameter names help LLM understand purpose

4. **Official ADK Pattern:**
   ```python
   def your_function(param: str):
       """
       Brief description of what the function does.
       
       Args:
           param (str): Description of the parameter.
           
       Returns:
           return_type: Description of what is returned.
       """
       try:
           # Your logic here
           return actual_result  # Return the data directly
       except Exception as e:
           print(f"Error: {e}")
           return None  # Simple error handling
   ```

### **ADK Tool Integration Patterns:**

```python
# ✅ CORRECT: Mixed tool types in one agent
processing_agent = LlmAgent(
    name="processing_agent",
    tools=[
        validate_data,                      # ✅ Function (auto-wrapped)
        transform_data,                     # ✅ Function (auto-wrapped)  
        AgentTool(agent=search_specialist), # ✅ Agent as tool
    ],
    instruction="Process data and delegate searches"
)

# ✅ CORRECT: Built-in tool only (no mixing)
search_agent = LlmAgent(
    name="search_agent", 
    tools=[google_search],  # Only built-in tool
    instruction="Perform web searches"
)

# ❌ WRONG: Built-in + function tools (ADK constraint)
mixed_agent = LlmAgent(
    name="mixed_agent",
    tools=[
        google_search,    # ❌ Built-in tool
        process_data,     # ❌ + Function tool = NOT ALLOWED
    ]
)
```

### **🚨 CRITICAL: Function Tool File Organization Strategy**

**DECISION RULE: Where to put your function tools?**

#### **✅ KEEP TOOLS IN SAME agent.py FILE WHEN:**
- **Only one agent uses the tool** (most common case)
- **Tool manages session state only** (no external API calls)
- **Tool is simple and agent-specific** (< 20 lines of code)

```python
# agent.py - Keep simple state management tools here
from google.adk.agents import LlmAgent
from google.adk.tools import ToolContext

def save_research_context(business_description: str, industry: str, tool_context: ToolContext) -> str:
    """Save research context - only used by this agent for state management."""
    tool_context.state["research_context"] = {
        "business_description": business_description,
        "industry": industry
    }
    return "Research context saved successfully"

root_agent = LlmAgent(
    name="root_agent",
    tools=[save_research_context],  # ✅ Simple state tool in same file
    instruction="Use save_research_context to save business analysis..."
)
```

#### **✅ CREATE SEPARATE TOOL FILES WHEN:**
- **Multiple agents use the tool** (shared utility)
- **Tool interacts with external APIs** (database, web services, etc.)
- **Tool is complex** (>50 lines, complex logic)
- **Tool has reusable business logic**

```python
# tools/api_tools.py - Separate file for external API tools
import requests
from google.adk.tools import ToolContext

def fetch_competitor_data(domain: str, tool_context: ToolContext) -> dict:
    """Fetch competitor data from external API - used by multiple agents."""
    try:
        response = requests.get(f"https://api.competitor-service.com/analyze/{domain}")
        data = response.json()
        
        # Save to session state for other agents to use
        competitors = tool_context.state.get("competitors", [])
        competitors.append(data)
        tool_context.state["competitors"] = competitors
        
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": f"API call failed: {str(e)}"}

def send_email_report(report: str, email: str) -> dict:
    """Send email report - reusable across multiple agent systems."""
    # Email sending logic
    return {"status": "success", "message": f"Report sent to {email}"}
```

#### **🚨 ANTI-PATTERNS TO AVOID:**
```python
# ❌ DON'T: Generic file names
# tools/function_tools.py  # Too generic - what functions?
# tools/utils.py          # Too vague - what utilities?

# ✅ DO: Specific, descriptive file names
# tools/competitor_api_tools.py    # Clear purpose
# tools/email_notification_tools.py # Specific functionality
# tools/database_tools.py          # Clear domain
```

#### **File Organization Examples:**

```python
# SIMPLE STATE MANAGEMENT - Keep in agent.py
def update_user_progress(step: str, tool_context: ToolContext) -> dict:
    progress = tool_context.state.get("progress", [])
    progress.append(step)
    tool_context.state["progress"] = progress
    return {"status": "updated"}

# EXTERNAL API INTEGRATION - Separate file: tools/crm_tools.py  
def create_lead_in_crm(name: str, email: str, company: str) -> dict:
    # CRM API integration logic
    crm_api.create_lead({"name": name, "email": email, "company": company})
    return {"status": "lead_created"}

# SHARED UTILITY - Separate file: tools/validation_tools.py
def validate_business_email(email: str) -> dict:
    # Complex email validation logic used by multiple agents
    if "@" not in email or "." not in email:
        return {"valid": False, "error": "Invalid email format"}
    return {"valid": True}
```

### **🚨 CRITICAL: ADK Function Tool Validation Checklist:**

**MANDATORY Requirements (Will Break if Missing):**
- [ ] **🚨 No default parameter values** (LLM cannot interpret them - will cause errors)
- [ ] **🚨 Comprehensive docstring with Args/Returns** (sent directly to LLM for understanding)
- [ ] **🚨 JSON-serializable types only** (`str`, `int`, `float`, `bool`, `list`, `dict`)

**Recommended Patterns (Based on Official ADK Examples):**
- [ ] **Return actual data directly** (`float`, `str`, `None`) rather than wrapper dictionaries  
- [ ] **Use try/catch for error handling** (return `None` or fallback values on errors)
- [ ] **Clear, meaningful names** (function and parameter names help LLM understand purpose)
- [ ] **Keep it simple** (follow official ADK examples - avoid over-engineering)
- [ ] **Added directly to tools list** (`tools=[your_function]` - ADK auto-wraps)

---

## 10. Implementation Plan

### Phase 1: Agent Architecture Setup
**Goal:** Create basic agent hierarchy and coordination structure

- [ ] **Task 1.1: Project Structure Setup**
  - Files: `agent.py`, `__init__.py`, `config.py`
  - Details: Create basic ADK project structure with configuration
  
- [ ] **Task 1.2: Root Agent Implementation**
  - Files: `agent.py` (root agent definition)
  - Details: Implement root agent as human consultant with delegation pattern
  
🛑 **State Gate:** Do **NOT** move to Phase 2 until the **Session State Dependency Table** is complete, all mismatches are resolved, and the user has approved your proposed fixes.

### Phase 2: Core Agent Implementation
**Goal:** Implement specialized agents with tool integration

- [ ] **Task 2.1: [Agent 1] Implementation**
  - Files: `agents/[agent1]/agent.py`
  - Details: Implement with [built-in tool] and session state integration
  
- [ ] **Task 2.2: [Agent 2] Implementation**
  - Files: `agents/[agent2]/agent.py`
  - Details: Implement with [function tools] and workflow processing
  
- [ ] **Task 2.3: Session State Protocol**
  - Files: Agent instruction updates
  - Details: Implement consistent session state communication pattern

### Phase 3: Tool Integration & Testing
**Goal:** Complete tool setup and validate agent coordination

- [ ] **Task 3.1: Built-in Tool Configuration**
  - Files: Agent configurations with tool assignments
  - Details: Configure google_search, code_execution, or vertex_ai_search
  
- [ ] **Task 3.2: Function Tool Development**
  - Files: `tools/` directory with custom function tools
  - Details: Implement processing, validation, and utility tools
  
- [ ] **Task 3.3: Agent Coordination Testing**
  - Files: Test scenarios and validation
  - Details: Verify session state flow and agent delegation works

### Phase 4: Basic Code Validation (AI-Only)
**Goal:** Run basic automated checks - this is NOT the final code review
**⚠️ NOTE:** This is basic validation only. Comprehensive code review happens in Phase 5.

- [ ] **Task 4.1:** Code Quality Verification
  - Files: All modified agent files
  - Details: Run linting, type checking, Python compilation checks
- [ ] **Task 4.2:** ADK Compliance Validation
  - Files: All agent definitions and exports
  - Details: Verify agent exports, import patterns, ADK constraint compliance (NO live testing)

### Phase 5: Comprehensive Code Review (Mandatory)
**Goal:** Present "Implementation Complete!" and execute thorough code review

🚨 **CRITICAL WORKFLOW CHECKPOINT:**

- [ ] **Task 5.1:** Present Implementation Complete Message (MANDATORY)
  - **Action:** Present the exact "Implementation Complete!" message below
  - **Wait:** For user approval before proceeding with code review
  
  **📋 EXACT MESSAGE TO PRESENT:**
  ```
  🎉 **Implementation Complete!**
  
  All phases have been implemented successfully. I've made changes to [X] files across [Y] phases.
  
  **📋 I recommend doing a thorough code review of all changes to ensure:**
  - No mistakes were introduced
  - All goals were achieved  
  - Code follows ADK project standards
  - Everything will work as expected
  
  **Would you like me to proceed with the comprehensive code review?**
  ```

- [ ] **Task 5.2:** Execute Comprehensive Code Review (If User Approves)
  - **Action:** Read all modified files and verify changes match task requirements exactly
  - **Validation:** Run complete ADK validation on all modified agent files
  - **Integration:** Check for session state flow issues between modified agents
  - **Requirements:** Verify all success criteria from task document are met
  - **Report:** Provide detailed review summary with confidence assessment

🛑 **MANDATORY CHECKPOINT:** Do NOT proceed to Phase 6 without completing code review

### Phase 6: Deployment & Production Setup
**Goal:** Deploy to Google Cloud Agent Engine with monitoring

- [ ] **Task 6.1: Agent Engine Configuration**
  - Files: `agent_engine_app.py`
  - Details: Set up Google Cloud Agent Engine deployment configuration
  
- [ ] **Task 6.2: AgentOps Integration**
  - Files: Monitoring and observability setup
  - Details: Configure monitoring, logging, and performance tracking
  
- [ ] **Task 6.3: Production Validation**
  - Files: Production testing and validation
  - Details: End-to-end testing in production environment

### 🚨 CRITICAL: Simplicity Validation After Each Phase
**MANDATORY checks after each phase:**
- [ ] **Complexity Justification:** Can I reduce the number of agents?
- [ ] **Tool Necessity:** Are all tools actually needed?
- [ ] **Instruction Efficiency:** Can instructions replace custom tools?
- [ ] **Session State Simplicity:** Is agent communication straightforward?
- [ ] **Maintenance Overhead:** Is this system maintainable?

---

## 11. File Structure & Organization

### 🚀 Quick ADK File Structure Reference

| File Type | Location | Purpose | Required Export |
|-----------|----------|---------|-----------------|
| **Root Agent** | `agent.py` | Main orchestrator | `root_agent = my_agent` |
| **Sub-Agents** | `agents/[name]/agent.py` | Specialized agents | `[agent_name] = ...` |
| **Configuration** | `config.py` | Model settings | `Config` class |
| **Dependencies** | `pyproject.toml` | uv dependency management | ADK packages |
| **Deployment** | `agent_engine_app.py` | Google Cloud Agent Engine | Agent configuration |

### ADK Project Structure
```
agent-project/
├── agent.py                           # Main agent definitions and root agent
├── __init__.py                        # Root agent export: from .agent import root_agent
├── config.py                          # Configuration management
├── pyproject.toml                     # Dependencies and project configuration
├── agent_engine_app.py                # Google Cloud Agent Engine deployment
├── .env                               # Environment variables
├── agents/                            # Each agent in its own folder (ADK requirement)
│   ├── [agent1_name]/
│   │   ├── agent.py                   # Agent definition
│   │   └── __init__.py                # Export: from .agent import [agent1_name]
│   ├── [agent2_name]/
│   │   ├── agent.py                   # Agent definition
│   │   └── __init__.py                # Export: from .agent import [agent2_name]
│   └── [agent3_name]/
│       ├── agent.py                   # Agent definition
│       └── __init__.py                # Export: from .agent import [agent3_name]
├── tools/
│   ├── __init__.py                    # Tools package initialization
│   ├── function_tools.py              # Custom function tools
│   ├── processing_tools.py            # Data processing tools
│   └── external_api_tools.py          # External service integrations
```

### 🚨 CRITICAL: ADK Compliance Requirements
**MANDATORY for ADK deployment:**

1.  **Canonical Imports**: Always use the correct imports for ADK components.
    ```python
    # For different agent types
    from google.adk.agents import (
        Agent,
        BaseAgent,
        LlmAgent,
        LoopAgent,
        ParallelAgent,
        SequentialAgent,
    )

    # For custom agent logic and loop control
    from google.adk.events import Event, EventActions
    from google.adk.sessions import InvocationContext

    # For tools
    from google.adk.tools import google_search
    from google.adk.tools.agent_tool import AgentTool
    ```

2.  **Root Agent Export Pattern**:
   ```python
   # In agent.py
   root_agent = your_main_agent_instance
   
   # In __init__.py
   from .agent import root_agent
   __all__ = ["root_agent"]
   ```

3. **Agent Import Paths**: When agents are in subfolders:
   ```python
   # In agents/search_agent/agent.py
   from ...config import Config  # Note the three dots for subfolder
   ```

4. **Dependencies Management**: Use `uv` commands only:
   ```bash
   # Add dependencies
   uv add "google-adk>=0.1.0"
   uv add --group dev "ruff>=0.12.0"
   
   # Never use pip install directly
   ```

### Key Files to Create
- [ ] **`agent.py`** - Root agent and main agent hierarchy
- [ ] **`__init__.py`** - Root agent export with `from .agent import root_agent`
- [ ] **`config.py`** - Model configuration and environment settings
- [ ] **`agent_engine_app.py`** - Google Cloud Agent Engine deployment setup
- [ ] **`agents/[name]/agent.py`** - Individual agent implementations
- [ ] **`tools/function_tools.py`** - Custom function tools (if needed)

---

## 12. Error Handling & Agent Coordination

### Agent Error Patterns
- [ ] **Agent Failure Handling:** [How individual agent failures are managed]
- [ ] **Workflow Interruption:** [How to handle workflow interruptions]
- [ ] **Tool Failure Recovery:** [Recovery strategies for tool failures]
- [ ] **Session State Corruption:** [Handling invalid or corrupted session state]

### Multi-Agent Coordination Issues
- [ ] **Session State Conflicts:** [Preventing concurrent session state corruption]
- [ ] **Agent Deadlock Prevention:** [Preventing circular dependencies between agents]
- [ ] **Tool Resource Conflicts:** [Managing built-in tool resource usage]
- [ ] **Workflow Error Propagation:** [How errors flow through agent hierarchy]

---

## 13. Security & Authentication

### ADK Security Considerations
- [ ] **Google Cloud Authentication:** [Service account and IAM configuration]
- [ ] **Tool Security:** [Secure tool execution and input validation]
- [ ] **Session Security:** [Protecting session state and user data]
- [ ] **Agent Isolation:** [Preventing unauthorized agent interactions]

### Authentication Strategy
- [ ] **Development Environment:** [Google Cloud SDK configuration]
- [ ] **Production Deployment:** [Service account and workload identity]
- [ ] **API Key Management:** [For external service integrations in function tools]

---

## 14. Deployment & Production

### Google Cloud Agent Engine Deployment
```bash
# Export dependencies for deployment
uv export > requirements.txt

# Deploy to Agent Engine
python agent_engine_app.py

# Monitor deployment
gcloud logging read "resource.type=gce_instance"
```

### AgentOps Integration
```python
# Enable monitoring in agent configuration
from google.adk.observability import AgentOps

# Configure monitoring
agent_ops = AgentOps(
    project_id="your-project-id",
    agent_name="your-agent-name"
)

# Add to agent configuration
root_agent = LlmAgent(
    name="root_agent",
    model="gemini-2.5-flash",
    callbacks=[agent_ops],
    # ... other configuration
)
```

### Environment Configuration
```bash
# .env file for deployment
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_CLOUD_STAGING_BUCKET=your-staging-bucket

# Agent configuration
AGENT_NAME=your-agent-system
MODEL=gemini-2.5-flash
```

---

## 15. Second-Order Consequences & Impact Analysis

### ADK-Specific Impact Assessment

#### 1. **Agent Coordination Complexity**
- [ ] **Session State Dependencies:** Will changes to session state structure break existing agents?
- [ ] **Tool Distribution Impact:** How will tool changes affect agent specialization?
- [ ] **Workflow Bottlenecks:** Will new agents create coordination bottlenecks?
- [ ] **Error Propagation:** How will failures in one agent affect the entire system?

#### 2. **Performance & Scalability**
- [ ] **Agent Processing Overhead:** Will multiple agents improve or degrade performance?
- [ ] **Tool Resource Usage:** Are built-in tools being used efficiently across agents?
- [ ] **Session State Memory:** Will session state grow too large for complex workflows?
- [ ] **Google Cloud Costs:** What are the cost implications of the agent architecture?

#### 3. **Maintenance & Evolution**
- [ ] **Agent Code Distribution:** Will agents in separate folders increase maintenance overhead?
- [ ] **Tool Evolution:** How will changes to built-in tools affect existing agents?
- [ ] **ADK Version Updates:** Will agent architecture handle ADK framework updates?
- [ ] **Debugging Complexity:** Will multi-agent systems be harder to debug and monitor?

### Critical Issues for ADK Systems

#### 🚨 **RED FLAGS - Alert User Immediately**
- [ ] **Over-Engineering:** More than 5 agents in the system
- [ ] **Orphan Reads:** Agent reads a key that no upstream agent writes
- [ ] **Duplicate Writers:** Multiple agents write to the same key without coordination
- [ ] **Tool Constraint Violations:** Built-in tools used with other tools in same agent
- [ ] **Session State Complexity:** Complex session state management patterns
- [ ] **Coordination Bottlenecks:** Root agent doing processing instead of delegating

#### ⚠️ **YELLOW FLAGS - Discuss with User**
- [ ] **Agent Proliferation:** Creating agents for every small processing step
- [ ] **Custom Tool Complexity:** Building complex function tools for simple tasks
- [ ] **Import Path Complexity:** Deep agent folder hierarchies affecting imports
- [ ] **Deployment Overhead:** Complex agent engine configuration requirements

---

## 16. AI Agent Instructions

### Default Workflow - SIMPLICITY AND STRATEGIC ANALYSIS FIRST
🎯 **MANDATORY OPERATING PROCEDURE:**
When implementing ADK agent systems, **DEFAULT BEHAVIOR** should be:

1. **EVALUATE STRATEGIC NEED** - Can single agent handle this vs multi-agent benefits?
2. **STRATEGIC ANALYSIS** (if needed) - Present agent architecture options with pros/cons
3. **CREATE TASK DOCUMENT** using this template with approved strategy
4. **PRESENT A/B/C OPTIONS** - Show implementation choices (preview/proceed/feedback)
5. **IMPLEMENT PHASE-BY-PHASE** - Execute in phases with recap between each
6. **FINAL CODE REVIEW** - Recommend comprehensive validation after completion
7. **QUALITY ASSURANCE** - Validate ADK compliance, session state flow, and code quality

### Agent Architecture Decision Workflow
🚨 **MANDATORY: Always follow this exact sequence:**

1. **SIMPLICITY ASSESSMENT FIRST (Required)**
   - [ ] **Single Agent Test:** Can one agent with instructions handle this?
   - [ ] **Complexity Justification:** What specific benefit do multiple agents provide?
   - [ ] **Tool Requirements:** Do I need different built-in tools?
   - [ ] **ADK Constraints:** How do ADK limitations affect the design?

2. **STRATEGIC ANALYSIS SECOND (If needed)**
   - [ ] **Present architecture options** with pros/cons for each ADK pattern
   - [ ] **Include tool distribution strategy** based on ADK constraints
   - [ ] **Provide clear recommendation** with agent architecture rationale
   - [ ] **Wait for user decision** on preferred approach before proceeding

3. **CREATE TASK DOCUMENT THIRD (Required)**
   - [ ] **Create new task document** in `ai_docs/tasks/` using this template
   - [ ] **🔢 FIND LATEST TASK NUMBER** using `list_dir` on ai_docs/tasks/ directory
   - [ ] **Name file** using pattern `XXX_agent_system_name.md`
   - [ ] **Fill out all sections** with specific ADK technical details
   - [ ] **Include approved agent architecture** from strategic analysis

4. **PRESENT IMPLEMENTATION OPTIONS (Required)**
   - [ ] **After incorporating user feedback**, present these 3 exact options:
   
   **👤 IMPLEMENTATION OPTIONS:**
   
   **A) Preview High-Level Code Changes** 
   Would you like me to show you detailed code snippets and specific changes before implementing? I'll walk through exactly what agent files will be created/modified and show before/after code examples.
   
   **B) Proceed with Implementation**
   Ready to begin implementation? Say "Approved" or "Go ahead" and I'll start implementing phase by phase.
   
   **C) Provide More Feedback**
   Need to ask questions or request changes to this task plan before implementation?

5. **PHASE-BY-PHASE IMPLEMENTATION (Only after Option B approval)**
   - [ ] **🚨 CRITICAL: CHECK OFF COMPLETED TASKS IN REAL-TIME**
     - [ ] **Update task document immediately** after completing each task/subtask
     - [ ] **Mark checkboxes as [x]** for completed items
     - [ ] **Add completion notes** with file paths and details when helpful
   - [ ] Start with Phase 1 and complete fully before moving to Phase 2
   - [ ] **After each phase completion:**
     
     **📋 PHASE RECAP FORMAT:**
     **✅ [Phase Name] Complete: [Brief Description]**
     
     **What I Did:**
     - ✅ [Specific accomplishment 1] ([file count] files, [line count] lines changed)
     - ✅ [Specific accomplishment 2] ([file count] files, [line count] lines changed)
     
     **Files Created/Modified:** [List key files with paths]
     **Results:** [Brief summary of outcomes]
     
     ---
     
     **🚀 Starting [Next Phase]: [Next Phase Description]**
     
     **What I'm About To Do:**
     - 📝 [Specific action 1] ([file count] files impacted)
     - 🔄 [Specific action 2] ([file count] files impacted)
     
     **Ready to proceed with [next phase name]?**
   - [ ] **🚨 INSPECT FUNCTION DEFINITIONS** before calling any ADK methods, external APIs, or constructors
   - [ ] **Follow ADK file structure requirements strictly**
   - [ ] **Use `uv` commands for dependency management** (never pip install)
   - [ ] **Test agent coordination through session state**
   - [ ] **Validate tool distribution follows ADK constraints**
   - [ ] **Run code quality checks** (`uv run ruff check`, `uv run mypy`, `uv run black`)
   - [ ] **🚨 CRITICAL:** After final implementation phase, you MUST proceed to Phase 5 (Comprehensive Code Review) - DO NOT skip this step

6. **WORKFLOW CONTINUATION**
   - [ ] **After all implementation phases complete**: Proceed to Phase 5 (Comprehensive Code Review) 
   - [ ] **Follow the mandatory workflow** outlined in Phase 5 above
   - [ ] **Present "Implementation Complete!" message** and wait for user approval
   - [ ] **Execute comprehensive code review** only after user approval

7. **TRACK PROGRESS CONTINUOUSLY (Required)**
   - [ ] **Check off completed tasks** in workflow documents as you complete them
   - [ ] **Update workflow checklists** when implementation differs from original plan
   - [ ] **Document deviations** from planned approach with reasons
   - [ ] **Keep workflow documents current** to reflect actual implementation state

### 🚨 MANDATORY: Workflow Document Maintenance

**CRITICAL: Always maintain workflow documents during implementation:**

#### **Check Off Tasks as You Complete Them**
- **🔄 CONTINUOUS PROCESS**: After completing ANY implementation task, immediately check it off in workflow documents
- **📝 UPDATE DETAILS**: If implementation differs from plan, update the checklist details to reflect actual approach
- **✅ MARK COMPLETED**: Change `- [ ]` to `- [x]` for all completed subtasks

#### **Common Workflow Document Updates**
- **Agent Implementation**: Check off agent creation, configuration, testing
- **Model Changes**: Update references when using different models (e.g., `Feedback` vs `EvaluationResult`)
- **Session State**: Update session state flow when keys change
- **Tool Distribution**: Mark tool assignments as complete
- **Testing Completion**: Check off validation and testing phases

#### **Example Progress Tracking**
```markdown
❌ BEFORE IMPLEMENTATION:
- [ ] **Build `research_evaluator`** (LlmAgent - Quality Assessment)
  - [ ] Configure `output_schema=EvaluationResult` for structured evaluation
  - [ ] Test evaluation logic and structured output generation

✅ AFTER IMPLEMENTATION:
- [x] **Build `research_evaluator`** (LlmAgent - Quality Assessment)
  - [x] Configure `output_schema=Feedback` for structured evaluation
  - [x] Test evaluation logic and structured output generation
```

#### **Why This Matters**
- **Progress Visibility**: User can see what's been completed
- **Requirement Tracking**: Ensures no tasks are missed
- **Documentation Accuracy**: Workflow reflects actual implementation
- **Future Reference**: Accurate record for maintenance and updates

#### **Workflow Update Checklist**
- [ ] Check off completed implementation tasks immediately
- [ ] Update task descriptions when implementation differs from plan
- [ ] Mark testing and validation phases as complete
- [ ] Document any changes to session state keys or agent configuration
- [ ] Keep workflow documents synchronized with actual codebase

### 🚨 MANDATORY: Current Date/Year Verification Protocol

**BEFORE writing any agent instructions, task documents, or code that references years/dates:**

1. **TIME TOOL REQUIRED**: Use `time` tool to verify current date (fallback to web search if time tool unavailable)
2. **UPDATE ALL REFERENCES**: Replace any 2024 references with current year (2025)
3. **AVOID TRAINING DATA ASSUMPTIONS**: Never assume year based on AI training data
4. **DOCUMENT VERIFICATION**: Note in task documents that date was verified

**Example Required Process:**
```
❌ WRONG: "Include recent sources (preferably 2024 data)" [based on training data assumption]
✅ CORRECT: [use time tool, fallback to web search] → "Include recent sources (preferably 2025 data)"
```

### ADK Framework Usage & Verification Protocol

**🚨 MANDATORY: If you are ever unsure how to use a specific ADK class, function, or parameter, you MUST follow this protocol:**

1.  **STOP CODING IMMEDIATELY.** Do not proceed with an implementation based on assumptions.
2.  **PRIORITIZE CODEBASE CONTEXT.** First, use `codebase_search` or `grep_search` to find existing examples of the feature within this project. The way it's already used here is the strongest precedent.
3.  **CONSULT OFFICIAL DOCUMENTATION.** If no local examples exist, use `web_search` to find the official Google Agent Development Kit documentation. Search for the specific class (e.g., `LoopAgent`, `BaseAgent`) to find its API reference and correct usage patterns.
4.  **STATE YOUR FINDINGS.** Before writing any new code, you must report what you found. For example:
    *   "I was unsure about the `LoopAgent`'s stop condition. I searched the codebase and found no existing examples. I then searched the web for the official ADK documentation and found that the correct pattern is to use a custom `BaseAgent` that yields an `escalate=True` event."
5.  **PROCEED WITH CORRECT PATTERN.** Only after verifying the correct usage should you proceed with the implementation.

**❌ ANTI-PATTERN TO AVOID:**
*   Never assume an ADK class has parameters (`stop_condition`, `callbacks`, etc.) without verifying.
*   Never write code based on how you *think* a framework *should* work.
*   Never continue with an implementation if you encounter unexplained errors or linter warnings related to the framework itself.

This protocol is designed to prevent incorrect framework usage, reduce rework, and ensure all implementations adhere to the official ADK patterns.

### 🚨 CRITICAL: Pre-Implementation Validation Checklist

**MANDATORY VALIDATION BEFORE ANY AGENT IMPLEMENTATION:**

#### Session State Validation (Enhanced Based on Real System Failures)
- [ ] **Existing workflow documentation identified** (search for `*_workflow.md` files in project)
- [ ] **ALL documented session state keys extracted** and mapped from existing workflow
- [ ] **ALL `{placeholder}` values traced** to upstream writers - MUST match existing documentation exactly
- [ ] **NO orphaned reads** - every session state read has corresponding upstream writer
- [ ] **NO session state key changes** without updating ALL dependent agents
- [ ] **ADK output_key pattern used** - never manual session state setting in callbacks
- [ ] **Workflow document cross-referenced** and session state flow matches exactly
- [ ] **User approval obtained** for any proposed session state fixes

#### Current Date/Year Validation  
- [ ] **Time tool used** for current date verification (with web search fallback if needed)
- [ ] **All year references updated** to current year (2025, not 2024)
- [ ] **No training data assumptions** about dates or years
- [ ] **Date verification documented** in task or implementation notes

#### Agent Instruction Validation
- [ ] **Session state placeholders align** with upstream agent outputs
- [ ] **Tool usage is correct** for agent type and ADK constraints
- [ ] **Output formats specified** for agents that feed downstream agents
- [ ] **Constraints clearly defined** to prevent agent hallucination

#### ADK Callback Validation (If Applicable)
- [ ] **Only valid ADK callbacks used** (`before_agent_callback`, `after_agent_callback`, etc.)
- [ ] **NO invalid callback parameters** (like `initialize_research_state`, `setup_callback`, etc.)
- [ ] **Callback examples provided** in task documents when callbacks are required
- [ ] **Proper CallbackContext usage** verified in implementation

#### Agent Architecture Validation
- [ ] **NO agent duplication** - same agent never appears in both sub_agents AND tools
- [ ] **Single agent roles** - each agent is either delegation target OR helper tool, not both
- [ ] **Architecture matches workflow docs** - agent roles consistent with documentation
- [ ] **Clear separation** between sub_agents (delegation) and tools (function calls)

#### Workflow Document Integration
- [ ] **Workflow document examined** (for major updates) or requested if not provided
- [ ] **Session state keys match** documented workflow patterns
- [ ] **Agent roles align** with documented architecture
- [ ] **No conflicts** between new agents and existing workflow

#### Workflow Maintenance Preparation
- [ ] **Workflow document identified** for progress tracking during implementation
- [ ] **Implementation tasks located** in workflow checklists for checking off
- [ ] **Progress tracking plan established** for continuous workflow updates
- [ ] **Task deviation process understood** for when implementation differs from plan

**🛑 STOP IMPLEMENTATION if any validation fails** - resolve with user first.

### 🚨 CRITICAL: Real-World Implementation Anti-Patterns (Learned from Failures)

#### The "Example Specificity Trap"
**FAILURE SCENARIO**: User provides example (shipkit.ai) and you build solution only for that example

**REAL FAILURE from Competitor Analysis:**
```python
# ❌ I did this - encoded shipkit.ai example everywhere
business_model_patterns = {
    "rapid_deployment_education": {
        "search_terms": ["shipfa.st alternatives", "SaaS boilerplate course"],
        "competitors": ["shipkit.io", "boilerplates.dev"],  
        "keywords": ["10x developer", "ship fast", "templates"]
    }
}
# This completely failed for healthcare, consumer goods, restaurants, etc.
```

**PREVENTION PROTOCOL:**
- [ ] **Universal Test**: Will this work for nicotine pouches, dental software, restaurants?
- [ ] **Abstraction Check**: Am I encoding the example or extracting universal principles?
- [ ] **Cross-Industry Test**: Does this approach work across 5+ different industries?
- [ ] **Principle Extraction**: What's the underlying category vs. the specific example?

**✅ CORRECT UNIVERSAL IMPLEMENTATION:**
```python
# Extract universal principles that work across all industries
def classify_business(description: str) -> tuple[str, str]:
    return (industry_type, business_model_type)  # Works for ANY business

def generate_research_strategy(industry: str, business_model: str) -> dict:
    # Universal approach that adapts to any industry + business model combination
```

#### The "Over-Engineering vs Prompt Engineering" Trap
**FAILURE SCENARIO**: Adding complex data structures when smarter prompts would work

**REAL FAILURES from Implementation:**
1. **Field Engineering Failure:**
   - ❌ Added `business_model_relevance_score: int` field with validation logic
   - User response: *"Just update the prompt to specify what's relevant"*
   - ✅ Solution: Better context injection in evaluation prompt

2. **Dead Code Failure:**
   - ❌ Added `search_strategy` session state field 
   - **NEVER consumed by any downstream agent**
   - ✅ Should have used existing fields with smarter instructions

**PREVENTION CHECKLIST:**
- [ ] **Prompt Alternative**: Can I solve this with better context injection in instructions?
- [ ] **Session State Necessity**: Will this field actually be consumed by downstream agents?
- [ ] **Complexity Justification**: Is engineering complexity truly necessary vs. prompt improvements?
- [ ] **Maintenance Impact**: Would updating prompts be simpler than maintaining validation code?

#### Session State Field Validation Protocol (Based on Real Failures)
**MANDATORY BEFORE adding ANY new session state field:**

1. **Consumption Tracing**: 
   - Which specific downstream agent will read `{field_name}`?
   - Can I find the exact instruction line that uses this field?

2. **Prompt Alternative Testing**:
   - Could existing fields + better context accomplish this?
   - Can instruction improvements eliminate the need for this field?

3. **Universal Validation**:
   - Does this field make sense for healthcare, consumer goods, AND developer tools?
   - Is this truly universal or just example-specific?

**REAL VALIDATION FAILURE EXAMPLES:**
- `search_strategy` field → No downstream consumers found → Dead code
- `business_model_relevance_score` → Prompt solution simpler → Over-engineering

#### Critical ADK Export Pattern (Based on Real System Breakage)
**REAL FAILURE**: Implemented entire agent system, forgot `root_agent = ...` export
**RESULT**: Complete system breakage, import failures, no agent access

**MANDATORY EXPORT PATTERN VALIDATION:**
```python
# End of every agent.py file MUST have:
my_agent = LlmAgent(name="my_agent", ...)

# 🚨 NEVER FORGET THIS LINE - System breaks without it!
root_agent = my_agent  
```

**Export Validation Checklist:**
- [ ] Agent file ends with `root_agent = [agent_name]` 
- [ ] `__init__.py` has `from .agent import root_agent`
- [ ] ADK system can import without errors
- [ ] No other agents accidentally exported as `root_agent`

### 🚨 CRITICAL: Complete Failure Pattern Analysis (Comprehensive Real-World Lessons)

**These are ALL REAL FAILURES from the competitor analysis implementation. Each one broke the system:**

#### Failure Pattern 1: Invalid Session State Management
```python
# ❌ THIS BROKE THE ENTIRE SYSTEM
def initialize_research_state(callback_context: CallbackContext) -> None:
    session_state = callback_context._invocation_context.session.state
    session_state["business_context"] = ""    # INVALID - doesn't work in ADK
    session_state["industry_type"] = ""       # INVALID - no way for agents to read this
    session_state["business_model_type"] = "" # INVALID - manual setting doesn't work
```
**Impact**: Complete communication breakdown between all agents.

#### Failure Pattern 2: Session State Key Misalignment  
```python
# ❌ THIS BROKE AGENT-TO-AGENT COMMUNICATION
# Workflow doc said: research_context → research_plan  
# But I implemented: business_context, industry_type, business_model_type
# Result: plan_generator couldn't read {research_context} - got null/empty data
```
**Impact**: Downstream agents couldn't access upstream data, workflow completely broken.

#### Failure Pattern 3: Ignoring Workflow Documentation
```python
# ❌ THIS IGNORED ESTABLISHED PATTERNS
# competition_workflow.md clearly documented session state flow
# But I created new session state patterns without checking existing workflow
# Result: Broke established agent communication that was already working
```
**Impact**: Entire established workflow broken, had to revert all changes.

#### Failure Pattern 4: Over-Engineering vs Prompting
```python
# ❌ THIS WAS UNNECESSARY COMPLEXITY
# Added business_model_relevance_score: int field with validation
# User said: "Just update the prompt to specify what's relevant"  
# Prompt solution was 10x simpler and more flexible
```
**Impact**: Wasted development time, added unnecessary maintenance overhead.

#### Failure Pattern 5: Example-Specific Implementation
```python
# ❌ THIS FAILED FOR OTHER INDUSTRIES
business_model_patterns = {
    "rapid_deployment_education": ["shipfa.st", "boilerplates.dev"],
    # Hardcoded for developer tools only - failed for healthcare, consumer goods
}
```
**Impact**: System only worked for one example case, completely failed for universal use.

**PREVENTION PROTOCOL FOR ALL PATTERNS:**
1. **Always check workflow documentation FIRST**
2. **Never manually set session state in callbacks** 
3. **Use output_key pattern for all session state writes**
4. **Test universal applicability with 3+ different industries**
5. **Default to prompt engineering over code complexity**
6. **Validate session state flow matches existing patterns**
7. **Never change session state key names without updating all agents**

### 🚨 CRITICAL: ADK Anti-Pattern Prevention

**IMMEDIATE RED FLAGS - STOP and simplify:**
- "I need 5+ agents for this task"
- "Root agent has complex processing instructions"
- "Using built-in tools with other tools in same agent"
- "Complex session state management patterns"
- "Custom orchestration methods instead of BuiltInPlanner"
- **"Same agent in both sub_agents and tools lists"** ← CRITICAL ARCHITECTURE ERROR
- **"Adding session state fields without downstream consumers"** ← DEAD CODE ERROR
- **"Building example-specific solutions"** ← UNIVERSAL DESIGN ERROR
- **"Missing root_agent export"** ← SYSTEM BREAKAGE ERROR
- **"Manual session_state[key] = value setting in callbacks"** ← INVALID ADK PATTERN
- **"Changing existing session state key names"** ← BREAKS AGENT COMMUNICATION

**CORRECT RESPONSES:**
- "Start with 1 agent, add complexity only when justified by tool constraints"
- "Root agent coordinates, sub-agents process"
- "Distribute built-in tools across separate agents"
- "Use simple session state key-value communication"
- "Let ADK BuiltInPlanner handle coordination"
- **"Each agent has ONE role - either sub-agent OR tool, never both"** ← ARCHITECTURE VALIDATION
- **"Trace session state consumption before adding fields"** ← DEAD CODE PREVENTION
- **"Build universal patterns that work across all industries"** ← UNIVERSAL DESIGN
- **"Always end agent.py with root_agent = [agent_name] export"** ← SYSTEM INTEGRITY
- **"Use output_key to write session state, never manual setting"** ← PROPER ADK PATTERN
- **"Keep existing session state key names from workflow docs"** ← COMMUNICATION INTEGRITY

### Code Quality Standards for ADK
- [ ] **🚨 FUNCTION INSPECTION:** Always inspect function definitions before calling - never guess parameter types
- [ ] **Complete type annotations** for all agent and tool code
- [ ] **Clear agent documentation** with role and responsibility descriptions
- [ ] **Tool documentation** that LLMs can understand for proper usage
- [ ] **Session state documentation** showing data flow between agents
- [ ] **ADK pattern compliance** following SequentialAgent, ParallelAgent, LoopAgent best practices
- [ ] **Error handling** with agent-specific error types and recovery strategies
- [ ] **Configuration management** using pydantic-settings and environment variables
- [ ] **Deployment readiness** for Google Cloud Agent Engine
- [ ] **Monitoring integration** with AgentOps for production observability

### 🚨 CRITICAL: Function Definition Inspection (MANDATORY)
**BEFORE calling ANY external function, method, or constructor:**
- [ ] **NEVER guess parameter types** - Always inspect the actual function signature
- [ ] **Check import requirements** - Verify which modules provide the required types
- [ ] **Look for usage examples** - Search codebase for existing correct usage patterns
- [ ] **Verify object construction** - Ensure you're using proper constructors, not raw data structures

**Example Workflow:**
```
1. BEFORE: content = Content(parts=[{"text": "hello"}])  # WRONG - guessing
2. INSPECT: Go to Content class definition, see it needs Part objects  
3. AFTER: content = Content(parts=[Part(text="hello")])  # CORRECT - verified
```

**🔍 Inspection Techniques:**
- [ ] **IDE "Go to Definition"** - Navigate to actual function signature
- [ ] **Codebase search** - Find existing usage: `grep_search` for similar calls
- [ ] **Documentation lookup** - Check official docs for parameter types
- [ ] **Type annotations** - Read function parameter and return type hints

**ADK-Specific Considerations:**
- [ ] **Agent constructor parameters** - Verify proper agent initialization patterns
- [ ] **Tool integration types** - Check what types ADK expects for tool definitions
- [ ] **Session state types** - Ensure session state reads/writes use correct formats
- [ ] **GenAI type imports** - Use `from google.genai import types as genai_types` for content objects

### What Constitutes "Explicit User Approval"

#### For Strategic Analysis
**✅ STRATEGIC APPROVAL RESPONSES (Proceed to task document creation):**
- "Option 1 looks good" / "Go with your recommendation"
- "I prefer the single agent approach" / "Use the multi-agent architecture"
- "Proceed with [specific option]" / "That approach works"

#### For Implementation Options (A/B/C Choice)
**✅ OPTION A RESPONSES (Show code preview):**
- "A" / "Option A" / "Preview changes" / "Show me the code" / "Let me see what you'll change"

**✅ OPTION B RESPONSES (Start implementation):**  
- "B" / "Option B" / "Proceed" / "Go ahead" / "Approved" / "Start implementation"

**✅ OPTION C RESPONSES (More feedback):**
- "C" / "Option C" / "I have questions" / "Let me think" / "Need to change something"

#### For Phase-by-Phase Implementation
**✅ PHASE CONTINUATION RESPONSES:**
- "Proceed" / "Continue" / "Go ahead" / "Next phase" / "Keep going"

**❓ PHASE CLARIFICATION NEEDED:**
- Questions about specific implementation details
- "Wait, let me check something" / "How will you handle..."

#### For Final Code Review
**✅ REVIEW APPROVAL RESPONSES:**
- "Proceed with review" / "Do the code review" / "Check everything"

**❓ CLARIFICATION NEEDED (Do NOT start coding):**
- Questions about agent architecture or tool distribution
- Requests for changes to agent hierarchy or session state design
- "What about..." / "How will you handle..." / "I'd like to change..."

🛑 **NEVER start implementing agents without user approval via Option B!**
🛑 **NEVER create task documents without strategic approval if strategic analysis was conducted!**
🛑 **NEVER skip comprehensive code review after implementation phases!**
🛑 **NEVER proceed to deployment without completing code review first!**
🛑 **NEVER violate ADK constraints for built-in tool distribution!**

---

*Template Version: 5.0 - ADK Agent Task Creation with Session State Validation and Current Date Verification*  
*Created: July 2025*  
*Architecture: Google Agent Development Kit*  
*Deployment Target: Google Cloud Agent Engine*
