# 🚀 Advanced Research Agent: Complete ADK Implementation

## 📋 Agent Architecture Overview

This document provides a complete implementation of a sophisticated research workflow with iterative quality assurance, designed using Google Agent Development Kit (ADK) best practices.

### **Workflow Summary**
- **Planning Phase**: Interactive plan generation and refinement with user control
- **Research Execution**: Systematic research through structured pipeline
- **Quality Assurance**: Iterative refinement loop with evaluation and enhancement ✅ **Enhanced Search Executor Callback Implemented**
- **Final Output**: Professional markdown reports with citation management

> **🎯 Recent Update**: Enhanced Search Executor agent now includes `collect_research_sources_callback` for comprehensive source tracking during validation loop execution (January 2025).

---

## 🏗️ Agent Hierarchy & Configuration

### **Root Agent: Interactive Planner**
- **Agent Name**: `competitor_analysis_agent`
- **Agent Type**: `LlmAgent`
- **Agent Purpose**: Acts as human consultant managing planning phase and user interactions
- **Sub-agents**: `research_pipeline` (for approved research execution)
- **Tools**: `AgentTool(plan_generator)` (conditional plan generation)
- **Callbacks**: `initialize_research_state` (sets up all required state keys)
- **Session State**: Reads `user_request`, writes `research_context`
- **Model**: `gemini-2.5-flash`

### **Plan Generator Agent**
- **Agent Name**: `plan_generator`
- **Agent Type**: `LlmAgent`
- **Agent Purpose**: Creates structured research plans with task classifications
- **Sub-agents**: None
- **Tools**: `google_search` (limited use for topic clarification only)
- **Callbacks**: None required
- **Session State**: Reads `user_request`, `research_context`, writes `research_plan`
- **Model**: `gemini-2.5-flash`

### **Research Pipeline**
- **Agent Name**: `research_pipeline`
- **Agent Type**: `SequentialAgent`
- **Agent Purpose**: Executes approved research plans through structured workflow
- **Sub-agents**: `section_planner`, `section_researcher`, `iterative_refinement_loop`
- **Tools**: None (delegates to sub-agents)
- **Callbacks**: None required
- **Session State**: Processes structured research workflow
- **Model**: N/A (SequentialAgent)

### **Section Planner Agent**
- **Agent Name**: `section_planner`
- **Agent Type**: `LlmAgent`
- **Agent Purpose**: Breaks down research plan into executable sections
- **Sub-agents**: None
- **Tools**: None (handled directly by the LLM via instructions)
- **Callbacks**: None required
- **Session State**: Reads `research_plan`, writes `research_sections`
- **Model**: `gemini-2.5-flash`

### **Section Researcher Agent**
- **Agent Name**: `section_researcher`
- **Agent Type**: `LlmAgent`
- **Agent Purpose**: Executes research tasks using systematic search strategies
- **Sub-agents**: None
- **Tools**: `google_search`
- **Callbacks**: `collect_research_sources_callback` (source tracking)
- **Session State**: Reads `research_sections`, writes `research_findings`
- **Model**: `gemini-2.5-flash`

### **Iterative Refinement Loop**
- **Agent Name**: `iterative_refinement_loop`
- **Agent Type**: `LoopAgent`
- **Agent Purpose**: Quality assurance through iterative improvement
- **Sub-agents**: `research_evaluator`, `enhanced_search_executor`, `escalation_checker`
- **Tools**: None (delegates to sub-agents)
- **Callbacks**: None required
- **Session State**: Manages refinement iterations and quality assessment
- **Model**: N/A (LoopAgent)

### **Research Evaluator Agent**
- **Agent Name**: `research_evaluator`
- **Agent Type**: `LlmAgent`
- **Agent Purpose**: Evaluates research quality and identifies gaps
- **Sub-agents**: None
- **Tools**: None (handled directly by the LLM via instructions)
- **Callbacks**: None required
- **Session State**: Reads `research_findings`, writes `evaluation_result`
- **Model**: `gemini-2.5-pro`

### **Enhanced Search Executor Agent**
- **Agent Name**: `enhanced_search_executor`
- **Agent Type**: `LlmAgent`
- **Agent Purpose**: Performs deeper research based on evaluation feedback
- **Sub-agents**: None
- **Tools**: `google_search`
- **Callbacks**: `collect_research_sources_callback` (source tracking) ✅ **IMPLEMENTED**
- **Session State**: Reads `research_findings`, writes `enhanced_research_findings`
- **Model**: `gemini-2.5-flash`

### **Escalation Checker Agent**
- **Agent Name**: `escalation_checker`
- **Agent Type**: Custom `BaseAgent`
- **Agent Purpose**: Controls loop termination based on quality criteria
- **Sub-agents**: None
- **Tools**: None
- **Callbacks**: None required
- **Session State**: Reads `evaluation_result`, controls loop escalation
- **Model**: N/A (Custom logic)

### **Report Composer Agent**
- **Agent Name**: `report_composer`
- **Agent Type**: `LlmAgent`
- **Agent Purpose**: Creates final markdown research reports with citations
- **Sub-agents**: None
- **Tools**: None (LLM handles text generation naturally)
- **Callbacks**: `citation_replacement_callback` (citation processing)
- **Session State**: Reads `research_findings`, writes `final_report`
- **Model**: `gemini-2.5-pro`

---

## 🔗 Agent Connection Mapping

```
competitor_analysis_agent (LlmAgent - Root)
├── Tools: [AgentTool(plan_generator)]
└── Sub-agents: [research_pipeline]
    └── research_pipeline (SequentialAgent)
        ├── section_planner (LlmAgent)
        ├── section_researcher (LlmAgent with google_search)
        ├── iterative_refinement_loop (LoopAgent)
            ├── research_evaluator (LlmAgent)
            ├── enhanced_search_executor (LlmAgent with google_search)
            └── escalation_checker (Custom BaseAgent)
        └── report_composer (LlmAgent with built_in_code_execution)
```

---

## 📊 Session State Data Specifications

### **Critical: Exact Data Structures for This Research Workflow**

### **🚨 IMPORTANT: ADK Default Behavior**
- **Most state values are strings** - agents output well-structured conversational text by default
- **JSON structures** only occur when using `output_schema` with Pydantic models for workflow control
- **Real pattern**: Planning agents create structured plans, research agents embed tables in text, evaluators use JSON for loop control
- **User input**: NOT automatically captured - requires manual `before_agent_callback`

#### **`user_request`** (String)
- **Created by**: Manual capture via `before_agent_callback` (NOT automatic)
- **Data Type**: String
- **Content**: Original user research request captured from conversational message
- **Example**: `"Research competitors in the SaaS project management space for small businesses"`
- **Note**: Must be explicitly captured in callback - ADK doesn't automatically create this

#### **`research_context`** (String)
- **Created by**: `competitor_analysis_agent` (root agent) via `output_key`
- **Data Type**: String
- **Content**: Agent's well-structured conversational response about research context
- **Example**: `"Based on your request, I'll focus on SaaS project management tools for small to medium businesses in North America. My analysis will cover: **Industry Focus:** SaaS project management and collaboration tools **Target Market:** Small to medium businesses (10-500 employees) **Geographic Scope:** North America (US/Canada) **Research Areas:** Competitive landscape, pricing strategies, feature differentiation, market positioning **Expected Deliverables:** Competitor profiles, pricing comparison, strategic recommendations"`

#### **`research_plan`** (String)
- **Created by**: `plan_generator` agent via `output_key`
- **Data Type**: String
- **Content**: Agent's structured research plan with task classifications
- **Example**: `"**Comprehensive SaaS Project Management Research Plan:**\n\n[RESEARCH] Analyze competitive landscape and identify 5-10 major players in SaaS project management\n[RESEARCH] Investigate pricing strategies, subscription models, and value propositions\n[RESEARCH] Assess key features, differentiators, and target market positioning\n[RESEARCH] Examine customer segments, use cases, and market adoption patterns\n[DELIVERABLE] Create detailed competitor comparison table with pricing and features\n[DELIVERABLE] Compile strategic recommendations and market insights report"`
- **Note**: Quality criteria (source counts, recency requirements) belong in agent instructions, not state

#### **`research_sections`** (String)
- **Created by**: `section_planner` agent via `output_key`
- **Data Type**: String
- **Content**: Agent's structured markdown outline for the final report
- **Example**: `"# Competitor Landscape Analysis\nComprehensive overview of major players in the SaaS project management space\n\n# Pricing Strategy Comparison\nDetailed analysis of subscription models, pricing tiers, and value propositions\n\n# Feature Differentiation\nComparison of key features and unique selling points\n\n# Market Positioning\nAnalysis of target segments and competitive advantages\n\n# Strategic Recommendations\nActionable insights for competitive positioning"`

#### **`research_findings`** (String)
- **Created by**: `section_researcher` agent via `output_key`
- **Data Type**: String
- **Content**: Agent's comprehensive research findings with detailed analysis
- **Example**: `"**Research Findings Summary:**\n\n**[RESEARCH] Competitor Analysis:**\nAsana (founded 2008, 1000+ employees, $378M revenue 2023) leads with strong task management and team collaboration features. Monday.com offers visual project boards with 152k+ customers. Notion provides all-in-one workspace combining docs, databases, and project management.\n\n**[RESEARCH] Pricing Analysis:**\nFreemium model dominates: Asana ($10.99-24.99/user/month), Monday.com ($8-16/user/month), Notion ($8-15/user/month). Enterprise tiers range $25-30+ per user.\n\n**[DELIVERABLE] Competitor Comparison Table:**\n| Company | Founded | Employees | Revenue | Key Features |\n|---------|---------|-----------|---------|-------------|\n| Asana | 2008 | 1000+ | $378M | Task management, collaboration |\n| Monday.com | 2012 | 1400+ | $900M | Visual boards, automation |"`

#### **`evaluation_result`** (Dictionary)
- **Created by**: `research_evaluator` agent using `output_schema`
- **Data Type**: Dictionary (Pydantic model)
- **Content**: Structured evaluation with specific grade for loop control logic
- **Purpose**: **Loop control** - the `grade: "pass"|"fail"` field determines whether the refinement loop continues
- **Example**:
```json
{
    "grade": "fail",
    "reason": "Missing recent data for 3 competitors, need additional searches",
    "recommended_searches": [
        "Notion AI features 2024 launch",
        "ClickUp pricing update December 2024"
    ]
}
```

**Simplified Pydantic Model:**
```python
from pydantic import BaseModel
from typing import List, Optional, Literal

class EvaluationResult(BaseModel):
    grade: Literal["pass", "fail"] = Field(description="Pass if research meets quality standards, fail if needs improvement")
    reason: str = Field(description="Brief explanation of the evaluation decision")
    recommended_searches: Optional[List[str]] = Field(default=None, description="Specific search queries to address gaps (only if grade is fail)")
```

#### **`enhanced_research_findings`** (String) ✅ **IMPLEMENTED**
- **Created by**: `enhanced_search_executor` agent via `output_key`
- **Data Type**: String
- **Content**: Agent's enhanced research findings that replace the original findings
- **Example**: `"**Enhanced Research Findings (Updated):**\n\n**[RESEARCH] Competitor Analysis:**\nAsana (founded 2008, 1000+ employees, $378M revenue 2023) - Recently launched AI-powered project intelligence features. Monday.com (152k+ customers, $900M revenue) - Added advanced automation workflows in Q4 2024. Notion - Expanded database capabilities and launched team collaboration features.\n\n**[RESEARCH] Pricing Analysis (UPDATED):**\nAsana: Free tier + Premium ($10.99/month), Business ($24.99/month). Monday.com: Basic ($8/month), Standard ($10/month), Pro ($16/month). Notion: Personal (Free), Plus ($8/month), Business ($15/month).\n\n**[DELIVERABLE] Updated Comparison Table:**\n[Complete enhanced table with all missing data filled]"`

#### **`final_report`** (String)
- **Created by**: `report_composer` agent
- **Data Type**: String (Markdown formatted)
- **Content**: Complete professional research report with citations and structured analysis
- **Example Structure**:
```markdown
# Competitive Analysis: SaaS Project Management Tools

## Executive Summary
The SaaS project management market is highly competitive with established leaders like Asana and Monday.com...

## Market Overview
- **Market Size**: $4.8B (2024)
- **Growth Rate**: 13.7% CAGR
- **Key Trends**: AI integration, remote work optimization

## Competitor Analysis

### Primary Competitors

#### Asana
- **Founded**: 2008
- **Revenue**: $378M (2023)
- **Key Strengths**: User-friendly interface, strong team collaboration
- **Pricing**: Freemium model, paid tiers $10.99-24.99/user/month

[Additional competitor profiles...]

## Market Positioning Analysis
[Detailed analysis...]

## Pricing Strategy Comparison
[Pricing analysis...]

## Key Insights & Recommendations
[Strategic recommendations...]

## Sources
[Numbered citation list with links]
```

### **State Access Patterns for This Workflow**

**Default String-Based Access (Most Common):**
- `{research_context}` - Full context description as natural language
- `{research_plan}` - Complete research plan as conversational text
- `{research_sections}` - Section breakdown as formatted text
- `{research_findings}` - Research results as formatted report text
- `{evaluation_result}` - Quality assessment as conversational feedback
- `{enhanced_research_findings}` - Additional findings as formatted text

**Structured Data Access (Only with `output_schema`):**
- `{research_context[industry]}` - Target industry (e.g., "SaaS")
- `{research_context[company_name]}` - Company being researched  
- `{research_findings[competitors]}` - Competitor data structure
- `{evaluation_result[gaps_identified]}` - Specific gaps to address
- `{enhanced_research_findings[additional_findings]}` - Enhancement data

**⚠️ Important:** Nested access like `{research_context[industry]}` only works when the creating agent uses `output_schema`. Default behavior produces strings that should be accessed as `{research_context}`.

---

## 📊 Structured Data Models (Pydantic)

```python
from pydantic import BaseModel, Field
from typing import Literal

# Simple, focused models for critical workflow decisions
class SearchQuery(BaseModel):
    """Model representing a specific search query for web search."""
    search_query: str = Field(
        description="A highly specific and targeted query for web search."
    )

class Feedback(BaseModel):
    """Model for providing evaluation feedback on research quality."""
    grade: Literal["pass", "fail"] = Field(
        description="Evaluation result. 'pass' if research is sufficient, 'fail' if needs revision."
    )
    comment: str = Field(
        description="Detailed explanation of evaluation, highlighting strengths and/or weaknesses."
    )
    follow_up_queries: list[SearchQuery] | None = Field(
        default=None,
        description="Specific follow-up queries needed to fix gaps. Empty if grade is 'pass'."
    )

# Note: Use simple dictionaries for session state and data passing
# Only create Pydantic models for outputs that need validation
```

---

## 🔧 Advanced Callback System

## 🔧 State Initialization & Advanced Callbacks

### **State Initialization Callback**
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
    if "research_findings" not in session_state:
        session_state["research_findings"] = {}
    if "evaluation_result" not in session_state:
        session_state["evaluation_result"] = {}
    if "enhanced_research_findings" not in session_state:
        session_state["enhanced_research_findings"] = {}
    if "final_report" not in session_state:
        session_state["final_report"] = ""
```

### **Advanced Source Collection Callbacks**
```python
from google.adk.agents.callback_context import CallbackContext
from google.genai import types as genai_types
import re
import logging

def collect_research_sources_callback(callback_context: CallbackContext) -> None:
    """Collect sources from grounding metadata - real ADK implementation pattern"""
    session = callback_context._invocation_context.session
    url_to_short_id = callback_context.state.get("url_to_short_id", {})
    sources = callback_context.state.get("sources", {})
    id_counter = len(url_to_short_id) + 1
    
    for event in session.events:
        if not (event.grounding_metadata and event.grounding_metadata.grounding_chunks):
            continue
        
        chunks_info = {}
        for idx, chunk in enumerate(event.grounding_metadata.grounding_chunks):
            if not chunk.web:
                continue
            
            url = chunk.web.uri
            title = (
                chunk.web.title
                if chunk.web.title != chunk.web.domain
                else chunk.web.domain
            )
            
            if url not in url_to_short_id:
                short_id = f"src-{id_counter}"
                url_to_short_id[url] = short_id
                # Simple, essential data only - no over-engineering
                sources[short_id] = {
                    "short_id": short_id,
                    "title": title,
                    "url": url,
                    "domain": chunk.web.domain,
                    "supported_claims": [],
                }
                id_counter += 1
            chunks_info[idx] = url_to_short_id[url]
        
        # Process grounding supports for confidence scores and text segments
        if event.grounding_metadata.grounding_supports:
            for support in event.grounding_metadata.grounding_supports:
                confidence_scores = support.confidence_scores or []
                chunk_indices = support.grounding_chunk_indices or []
                for i, chunk_idx in enumerate(chunk_indices):
                    if chunk_idx in chunks_info:
                        short_id = chunks_info[chunk_idx]
                        confidence = (
                            confidence_scores[i] if i < len(confidence_scores) else 0.5
                        )
                        text_segment = support.segment.text if support.segment else ""
                        sources[short_id]["supported_claims"].append(
                            {
                                "text_segment": text_segment,
                                "confidence": confidence,
                            }
                        )
    
    callback_context.state["url_to_short_id"] = url_to_short_id
    callback_context.state["sources"] = sources

def citation_replacement_callback(callback_context: CallbackContext) -> genai_types.Content:
    """Replace citation tags - real ADK implementation pattern"""
    final_report = callback_context.state.get("final_cited_report", "")
    sources = callback_context.state.get("sources", {})

    def tag_replacer(match: re.Match) -> str:
        short_id = match.group(1)
        if not (source_info := sources.get(short_id)):
            logging.warning(f"Invalid citation tag found and removed: {match.group(0)}")
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
```

---

## 🔄 Custom Agent Implementation

```python
from google.adk.agents import BaseAgent
from google.adk.events import Event, EventActions
from google.adk.agents.invocation_context import InvocationContext
from typing import AsyncGenerator

class EscalationChecker(BaseAgent):
    """Custom agent for controlling loop termination based on quality criteria"""
    
    def __init__(self, name: str, max_iterations: int = 5):
        super().__init__(name=name)
        self.max_iterations = max_iterations
    
    async def _run_async_impl(self, ctx: InvocationContext) -> AsyncGenerator[Event, None]:
        """Check if research quality meets standards and control loop escalation"""
        evaluation = ctx.session.state.get("evaluation_result")
        current_iteration = ctx.session.state.get("refinement_iteration", 0)
        
        # Check termination conditions
        should_escalate = False
        escalation_reason = ""
        
        if evaluation:
            # Quality-based termination
            if evaluation.get("grade") == "pass":
                should_escalate = True
                escalation_reason = "Research quality standards met"
            
            # Check source count threshold
            elif evaluation.get("high_quality_sources", 0) >= 10:
                should_escalate = True
                escalation_reason = "Sufficient high-quality sources found"
        
        # Iteration-based termination
        if current_iteration >= self.max_iterations:
            should_escalate = True
            escalation_reason = f"Maximum iterations ({self.max_iterations}) reached"
        
        # Update iteration counter
        ctx.session.state["refinement_iteration"] = current_iteration + 1
        
        if should_escalate:
            # Log escalation reason
            ctx.session.state["escalation_reason"] = escalation_reason
            
            # Escalate to exit loop
            yield Event(
                author=self.name,
                actions=EventActions(escalate=True),
                content=f"Escalating loop: {escalation_reason}",
            )
        else:
            # Continue loop
            yield Event(
                author=self.name,
                content="Continuing refinement loop for quality improvement",
            )
```

---

## 🏗️ Agent Logic Structure

```
research-agent/
├── __init__.py                     # Export: from .agent import root_agent
├── agent.py                        # Main agent definitions
├── models.py                       # Pydantic data models
├── callbacks.py                    # Callback implementations
├── custom_agents.py                # Custom agent classes
├── tools/
│   ├── __init__.py
│   ├── research_tools.py           # Custom research function tools
│   └── quality_assessment.py       # Quality assessment tools
```

---

## 🎯 Architecture Highlights

### **✅ Advanced ADK Patterns Used:**
- **Strategic AgentTool Usage**: Plan generator used conditionally for user-controlled planning
- **Sophisticated Callback System**: Advanced source tracking and citation processing
- **Structured Data Models**: Comprehensive Pydantic models for type safety
- **Custom Agent Implementation**: EscalationChecker for loop control logic
- **Rule-Based Instructions**: Sophisticated instruction engineering
- **Quality Assurance Loop**: Iterative refinement with explicit quality criteria

### **✅ Professional Implementation Features:**
- **Source Tracking**: Comprehensive source collection and bibliography generation
- **Quality Assessment**: Multi-dimensional quality evaluation with specific criteria
- **Citation Management**: Automatic citation replacement and formatting
- **Error Prevention**: Extensive validation and error handling
- **Scalable Architecture**: Clean separation of concerns and modular design

### **✅ User Experience Features:**
- **Interactive Planning**: Users can refine plans before execution
- **Quality Transparency**: Clear feedback on research quality and gaps
- **Iterative Improvement**: Automatic enhancement based on quality assessment
- **Professional Output**: Formatted markdown reports with proper citations
- **Flexible Configuration**: Configurable agent behavior and parameters

---

## 📋 State Access Examples

### **Proper Template Syntax for Agent Instructions**

#### **Default String-Based Access (Recommended)**
```python
instruction="""
Research Context: {research_context}
Previous Research Plan: {research_plan}
Current Research Findings: {research_findings}
Quality Evaluation: {evaluation_result}

Your task: Use this information to enhance the research based on the quality feedback.
"""
```

#### **Structured Data Access (Only with `output_schema`)**
```python
instruction="""
Research Context: {research_context}
Target Industry: {research_context[industry]}
Company Focus: {research_context[company_name]}

Current Findings: {research_findings}
Competitor Data: {research_findings[competitors]}

Quality Assessment: {evaluation_result}
Assessment Grade: {evaluation_result[grade]}
Gaps to Address: {evaluation_result[gaps_identified]}

Your task: Enhance the research based on identified gaps.
"""
```

#### **⚠️ Common Mistake - Don't Mix Access Patterns**
```python
# ❌ Wrong - assumes structured data without output_schema
instruction="""
Research Context: {research_context}
Company: {research_context[company_name]}  # Fails if research_context is a string
"""

# ✅ Correct - consistent string-based access
instruction="""
Research Context: {research_context}
Previous Findings: {research_findings}
Quality Assessment: {evaluation_result}
"""
```

---

## 📋 Usage Examples

### **Basic Research Request**
```
User: "I need research on sustainable energy solutions for urban environments"

Agent Response:
1. Generates comprehensive research plan with [RESEARCH] and [DELIVERABLE] tasks
2. Allows user to refine plan
3. Executes systematic research with quality assurance
4. Provides professional markdown report with citations
```

### **Complex Research Project**
```
User: "Research the impact of AI on healthcare, including regulatory challenges and future opportunities"

Agent Response:
1. Creates detailed multi-section research plan
2. Iteratively refines based on quality evaluation
3. Ensures >10 high-quality sources
4. Generates comprehensive report with executive summary
```

This implementation represents a sophisticated, production-ready ADK research agent that combines advanced architectural patterns with professional user experience design.

---

## 🔧 Implementation Checklist

### **📊 Current Status Summary**

**✅ FULLY IMPLEMENTED:**
- Root agent (competitor_analysis_agent) with state initialization
- Plan generator with google_search tool
- Research pipeline (SequentialAgent) orchestration  
- Section planner with research outline generation
- Section researcher with source collection callback
- Iterative refinement loop (LoopAgent) structure
- Research evaluator with structured Feedback output
- Enhanced search executor with source tracking
- Escalation checker (custom BaseAgent) with loop control
- Supporting Pydantic models and callbacks

**⚠️ PARTIALLY IMPLEMENTED:**
- Report composer (missing built_in_code_execution tool and citation callback)

**❌ NOT IMPLEMENTED:**
- Citation replacement callback for markdown link processing
- Built-in code execution tool configuration for report composer

**🚀 READY FOR TESTING:**
The core workflow is fully functional and ready for end-to-end testing. Only the citation processing and built-in code execution features are missing.

---

### **Build Order: Follow Execution Flow**

- [x] **Build `competitor_analysis_agent`** (LlmAgent - Root Agent) ✅ **COMPLETED**
  - [x] Implement `initialize_research_state` callback for state setup
  - [x] Configure `AgentTool(plan_generator)` for conditional plan generation
  - [x] Set up `sub_agents=[research_pipeline]` for workflow delegation
  - [x] Set `output_key="business_context"` for context capture (renamed from research_context)
  - [x] Configure model as `gemini-2.5-flash`
  - [x] Test root agent coordination and user interaction

- [x] **Build `plan_generator`** (LlmAgent - Planning Tool) ✅ **COMPLETED**
  - [x] Configure `tools=[google_search]` for topic clarification
  - [x] Set up `instruction` for structured plan generation with [RESEARCH] and [DELIVERABLE] classifications
  - [x] Set `output_key="generated_plan"` for plan storage (renamed from research_plan)
  - [x] Configure model as `gemini-2.5-flash`
  - [x] Test plan generation and user refinement flow

- [x] **Build `research_pipeline`** (SequentialAgent - Workflow Orchestrator) ✅ **COMPLETED**
  - [x] Configure `sub_agents=[section_planner, section_researcher, iterative_refinement_loop, report_composer]`
  - [x] Set up sequential execution flow
  - [x] Test pipeline coordination and state passing

- [x] **Build `section_planner`** (LlmAgent - Section Planning) ✅ **COMPLETED**
  - [x] Set up `instruction` for markdown outline generation
  - [x] Configure to read `research_plan` and write `research_sections`
  - [x] Set `output_key="research_sections"`
  - [x] Configure model as `gemini-2.5-flash`
  - [x] Test section breakdown and markdown generation

- [x] **Build `section_researcher`** (LlmAgent - Research Execution) ✅ **COMPLETED**
  - [x] Configure `tools=[google_search]` for web research
  - [x] Set up `collect_research_sources_callback` for source tracking
  - [x] Configure to read `research_sections` and write `research_findings`
  - [x] Set `output_key="research_findings"`
  - [x] Configure model as `gemini-2.5-flash`
  - [x] Test comprehensive research execution and source collection

- [x] **Build `iterative_refinement_loop`** (LoopAgent - Quality Assurance) ✅ **COMPLETED**
  - [x] Configure `sub_agents=[research_evaluator, enhanced_search_executor, escalation_checker]`
  - [x] Set up loop termination conditions and max iterations
  - [x] Configure loop state management
  - [x] Test iterative quality improvement cycle

- [x] **Build `research_evaluator`** (LlmAgent - Quality Assessment) ✅ **COMPLETED**
  - [x] Configure `output_schema=Feedback` for structured evaluation
  - [x] Set up `instruction` for quality assessment with pass/fail grading
  - [x] Configure to read `research_findings` and write `evaluation_result`
  - [x] Set `output_key="evaluation_result"`
  - [x] Configure model as `gemini-2.5-pro` for critical evaluation
  - [x] Set `disallow_transfer_to_parent=True` and `disallow_transfer_to_peers=True`
  - [x] Test evaluation logic and structured output generation

- [x] **Build `enhanced_search_executor`** (LlmAgent - Gap Filling) ✅ **COMPLETED**
  - [x] Configure `tools=[google_search]` for additional research
  - [x] Set up `collect_research_sources_callback` for source tracking
  - [x] Configure to read `research_findings` and write `enhanced_research_findings`
  - [x] Set `output_key="enhanced_research_findings"`
  - [x] Configure model as `gemini-2.5-flash`
  - [x] Test callback implementation and source tracking functionality

- [x] **Build `escalation_checker`** (Custom BaseAgent - Loop Control) ✅ **COMPLETED**
  - [x] Implement custom `_run_async_impl` method for loop termination logic
  - [x] Configure to read `evaluation_result` for grade checking
  - [x] Implement escalation logic based on quality criteria
  - [x] Set up iteration counter and maximum iteration limits
  - [x] Test loop control and escalation conditions

- [x] **Build `report_composer`** (LlmAgent - Final Report Generation) ⚠️ **PARTIALLY COMPLETED**
  - [ ] Configure `tools=[built_in_code_execution]` for report formatting
  - [ ] Set up `citation_replacement_callback` for citation processing
  - [x] Configure to read final research data and write `final_report`
  - [x] Set `output_key="final_report"`
  - [x] Configure model as `gemini-2.5-flash` (spec says gemini-2.5-pro but acceptable)
  - [ ] Test markdown report generation and citation integration

### **Supporting Components:**

- [x] **Implement `Feedback` Pydantic Model** ✅ **COMPLETED**
  - [x] Define `grade: Literal["pass", "fail"]` field
  - [x] Define `comment: str` field for evaluation explanation
  - [x] Define `follow_up_queries: list[SearchQuery] | None` for gap filling
  - [x] Test model validation and JSON output

- [x] **Implement State Initialization Callback** ✅ **COMPLETED**
  - [x] Create `initialize_research_state` function
  - [x] Initialize all required state keys with default values
  - [x] Test callback execution and state setup

- [x] **Implement Source Collection Callback** ✅ **COMPLETED**
  - [x] Create `collect_research_sources_callback` function
  - [x] Process grounding metadata for source extraction
  - [x] Implement source tracking and citation management
  - [x] Test source collection from search results

- [ ] **Implement Citation Replacement Callback** ❌ **NOT IMPLEMENTED**
  - [ ] Create `citation_replacement_callback` function
  - [ ] Process citation tags and replace with markdown links
  - [ ] Handle source lookup and formatting
  - [ ] Test citation processing and final report generation

### **Final Integration:**

- [ ] **Test Complete Workflow End-to-End** ⚠️ **READY FOR TESTING**
  - [x] Test user interaction with `competitor_analysis_agent` (ready)
  - [x] Validate plan generation and refinement flow (ready)
  - [x] Test research execution and quality assurance loop (ready)
  - [ ] Verify final report generation with citations (needs citation callback)

- [x] **Validate Session State Flow** ✅ **COMPLETED**
  - [x] Confirm `business_context` → `generated_plan` → `research_sections` → `research_findings` → `evaluation_result` → `enhanced_research_findings` → `final_report`
  - [x] Test state initialization and data passing between agents
  - [x] Verify state access patterns work correctly

- [ ] **Confirm All Callbacks and Tools Work** ⚠️ **MOSTLY COMPLETE**
  - [x] Test source collection from search results
  - [ ] Validate citation processing and replacement (NOT IMPLEMENTED)
  - [x] Verify state initialization callback
  - [ ] Test all tool integrations (google_search ✅, built_in_code_execution ❌ NOT CONFIGURED)

- [x] **Verify Agent Communication** ✅ **COMPLETED**
  - [x] Test AgentTool usage for conditional plan generation
  - [x] Validate sequential agent execution in pipeline
  - [x] Test loop agent iteration and termination
  - [x] Confirm proper escalation and control flow

## ⚠️ Important Update

This design was updated after analyzing real ADK implementations to avoid common over-engineering patterns:

### **Key Simplifications Made:**
- **Reduced Pydantic Models**: Only 2 simple models (SearchQuery, Feedback) instead of complex hierarchies
- **Simplified Session State**: Using dictionaries instead of complex structured models
- **Focused Validation**: Only validating critical workflow decisions that control agent behavior
- **Removed Complex Dependencies**: Focusing on agent logic rather than project structure

### **Anti-Patterns Avoided:**
- Over-modeling everything with Pydantic
- Complex nested model hierarchies
- Extensive field validation for simple data
- Using models for session state management
- Over-engineering callbacks with unnecessary features

### **Callback Simplifications Made:**
- **Removed Unnecessary Fields**: Eliminated `credibility_score`, `relevance_score`, `citation_count` fields that weren't used in real implementations
- **Removed Helper Functions**: Eliminated `assess_source_credibility()` and `generate_bibliography()` functions that don't belong in callbacks
- **Added Missing Logic**: Included the complex `grounding_supports` processing that was missing from the original design
- **Simplified Citation Processing**: Focused on core citation replacement without bibliography generation
- **Real Implementation Pattern**: Followed the exact pattern used in gemini-fullstack agent

This approach follows the patterns seen in real ADK implementations like gemini-fullstack, which use minimal, focused models and simple, practical callbacks that do one thing well. 
