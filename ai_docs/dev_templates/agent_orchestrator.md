# ADK Agent Orchestrator: Comprehensive Workflow Design Guide

> **Purpose**: This guide helps users clarify their workflow ideas and convert them into proper Google Agent Development Kit (ADK) workflows. It serves as a complete reference for AI agents helping users design and build real-world ADK projects.

---

## 🎯 Instructions for AI Agents Using This Guide

### **Your Role**: ADK Workflow Design Assistant
You are helping developers of **every skill level** (from complete beginners to ADK experts) design and build valid Google Agent Development Kit workflows. Your goal is to be **as helpful and proactive as possible** while ensuring they produce working, production-ready agents.

### **Critical Guidelines**:
- ⚠️ **NEVER SKIP PHASES** - Work ONE phase at a time, never jump ahead or mix phases
- ❓ **Phase 1 ONLY**: Ask clarifying questions about workflow requirements  
- ✅ **Get explicit user confirmation** before proceeding to Phase 2
- 🎯 **Be proactive** - offer suggestions, examples, and guidance
- 🏗️ **Take the burden off the user** - do the heavy lifting of workflow design
- 📝 **Ensure valid workflows** - use the cheat sheet to validate all suggestions
- 🚨 **ALWAYS document state data structures** - Never create workflows without detailed state specifications

### **🚨 PHASE VIOLATION WARNING**:
**NEVER ask Phase 1 and Phase 2 questions together!** This is a critical error that breaks the workflow process.

---

## 🔑 ADK Fundamentals

### **Critical ADK Understanding**:
- **ADK agents are ALWAYS user-triggered** - they respond to user input, never run automatically
- **No scheduling or automation** - users invoke agents through conversation
- **Session-based** - each user interaction creates a session with state management
- **Tool-enabled** - agents use tools to perform actions, not autonomous execution

### **❌ Wrong Mental Model**: "Automated system that runs on schedule"
### **✅ Correct Mental Model**: "Conversational agent that responds to user requests"

---

## 🔄 Two-Phase Process

### **Phase 1: User Workflow Input & Clarification**

**Your Tasks:**
1. **Ask the user to submit their workflow ideas** through:
   - **Visual diagrams** or sketches of their process
   - **Bulleted lists** of what they want to accomplish  
   - **Rough descriptions** of their workflow goals

2. **Ask clarifying questions** such as:
   - "What specific data sources do you need to connect to?"
   - "What tools or APIs do you need to integrate with?"
   - "What's the final output format you want?"
   - "Are there any decision points or branching logic?"
   - "What criteria determine success/completion?"
   - "Should this be a universal system or domain-specific?"

### **❌ BAD Phase 1 Questions** (Never Ask These):
- "What triggers this workflow?" - ADK agents are ALWAYS triggered by user input
- "Should this run automatically?" - ADK agents respond to user requests, not automatic triggers
- "How often should this run?" - ADK agents don't have scheduling, users invoke them

### **✅ GOOD Phase 1 Questions** (Focus on These):
- Workflow requirements and goals
- Data sources and integrations needed
- Output format and success criteria
- Decision points and branching logic
- Domain scope (universal vs specific)

3. **Probe for missing details** by being proactive:
   - "I see you want to research competitors - would you like me to suggest using the google_search tool?"
   - "For data analysis, I can include code_execution capabilities - would that be helpful?"
   - "This sounds like it needs multiple steps - should I design a sequential workflow?"

4. **Don't proceed to Phase 2** until you have:
   - ✅ Clear understanding of the user's goals
   - ✅ Identified all required tools and integrations
   - ✅ Confirmed the workflow structure with the user
   - ✅ **EXPLICITLY ASKED**: "Are you ready to proceed to Phase 2?"
   - ✅ **RECEIVED USER CONFIRMATION** to move to Phase 2

### **🛑 PHASE 1 COMPLETION CHECKPOINT**:
You MUST ask: **"Based on our discussion, I believe I understand your workflow requirements. Are you ready for me to proceed to Phase 2 where I'll design the complete ADK implementation?"**

**Only proceed to Phase 2 after receiving explicit user approval.**

### **Phase 2: ADK Workflow Design**

**Your Tasks:**
1. **Use the ADK cheat sheet** to convert user ideas into structured agent workflows
2. **Design proper agent hierarchies** following ADK patterns
3. **Map tools to appropriate agents** using tool distribution rules
4. **Create session state flow** for agent communication
5. **🚨 CRITICAL: Document exact state data structures** - Create detailed specifications showing what data is stored in each state key with complete JSON examples
6. **Generate complete agent architecture** with all required components
7. **🚨 CRITICAL: Save workflow design document** to the correct location

**Present your Phase 2 output as a complete ADK workflow document** following the template below:

#### **📁 SAVE LOCATION REQUIREMENT:**
**MANDATORY**: Save the complete ADK workflow design document to:
```
ai_docs/prep/[workflow_name].md
```

**Examples:**
- `ai_docs/prep/customer_support_workflow.md`
- `ai_docs/prep/research_analysis_workflow.md` 
- `ai_docs/prep/data_processing_workflow.md`

**⚠️ IMPORTANT**: Do NOT save workflow designs to `ai_docs/tasks/` - that folder is for implementation tasks that reference the prep documents.

#### **For Each Agent, Document:**
- **Agent Name**: Clear, descriptive name
- **Agent Type**: LlmAgent, SequentialAgent, ParallelAgent, or LoopAgent
- **Agent Purpose**: 1-2 sentence summary of what the agent does
- **Sub-agents**: List of any sub-agents this agent coordinates
- **Tools**: Built-in tools (google_search, code_execution, VertexAiSearchTool) or function tools
- **Callbacks**: Any before/after callbacks needed
- **Session State**: What state it reads (`input_keys`) and writes (`output_key`)
- **Model**: Which Gemini model to use (gemini-2.5-flash, gemini-2.5-pro)

#### **Session State Data Specifications:**
🚨 **MANDATORY**: For EVERY state key used in the workflow, document:
- **Created by**: Which specific agent writes this data
- **Data Type**: Exact type (String, Dictionary, List)
- **Content**: What information is stored
- **Structure**: Complete JSON examples showing all nested fields
- **Access Patterns**: Show agents how to access nested data like `{state_key[field]}`

#### **Agent Connection Mapping:**
Show how agents connect in the workflow:
- **Root orchestration agent** → **Sequential agent** with specialized sub-agents
- **Parallel agents** processing concurrent tasks
- **Loop agents** for iterative processing
- **Complex hierarchies** with multiple coordination levels

---

## 📋 ADK Agent Architecture Patterns

### **1. Root Agent as Human Consultant Pattern**
✅ **BEST PRACTICE**: Root agents should act like human consultants meeting new clients
- **Gather context first** before diving into work
- **Delegate control** to specialized workflow agents
- **Keep instructions simple** and focused on coordination
- **Save context to session state** with `output_key`

❌ **AVOID**: Root agents with complex processing logic or detailed sub-agent instructions

### **2. Agent Type Selection Guide**

#### **Agent (Base Class - Most Versatile)**
- **Use for**: Complex workflows, advanced configurations, custom behaviors
- **Import**: `from google.adk.agents import Agent`
- **Features**: Full configuration options, callbacks, global instructions
- **Example**: Customer service, FOMC research, Data science
```python
from google.adk.agents import Agent

root_agent = Agent(
    model="gemini-2.5-flash",
    name="complex_agent",
    global_instruction="System-wide context and rules",
    instruction="Specific task instructions",
    tools=[custom_tool],
    before_agent_callback=setup_callback,
    after_agent_callback=cleanup_callback,
)
```

#### **LlmAgent (Simple Language Model)**
- **Use for**: Single-step tasks, basic tool use, simple coordination
- **Import**: `from google.adk.agents import LlmAgent`
- **Features**: Streamlined for LLM-focused workflows
- **Example**: Academic research coordinator, Simple agents
```python
from google.adk.agents import LlmAgent

simple_agent = LlmAgent(
    name="simple_agent",
    model="gemini-2.5-flash",
    instruction="Handle this specific task",
    tools=[google_search],
)
```

#### **SequentialAgent (Step-by-Step Processing)**
- **Use for**: Multi-step workflows requiring ordered execution
- **Pattern**: Agent A → Agent B → Agent C
- **Example**: Research pipeline, Analysis workflow
```python
from google.adk.agents import SequentialAgent

pipeline = SequentialAgent(
    name="research_pipeline",
    sub_agents=[
        planning_agent,
        execution_agent,
        review_agent,
    ],
)
```

#### **ParallelAgent (Concurrent Processing)**
- **Use for**: Independent tasks that can run simultaneously
- **Pattern**: Multiple agents process different aspects concurrently
- **Example**: Financial analysis (multiple market aspects), Content generation
```python
from google.adk.agents import ParallelAgent

parallel_processor = ParallelAgent(
    name="parallel_processor",
    sub_agents=[
        market_agent,
        risk_agent,
        sentiment_agent,
    ],
)
```

#### **LoopAgent (Iterative Processing)**
- **Use for**: Repetitive tasks with termination conditions
- **Pattern**: Repeat workflow until condition met
- **Example**: Image scoring (generate → score → check → repeat)
```python
from google.adk.agents import LoopAgent

iterative_agent = LoopAgent(
    name="iterative_processor",
    max_iterations=10,
    sub_agents=[
        processing_agent,
        evaluation_agent,
        escalation_checker,  # Custom agent to control loop
    ],
)
```

### **3. Advanced Agent Configuration**

#### **Global vs Local Instructions**
```python
# Use global_instruction for system-wide context
agent = Agent(
    global_instruction="You are a customer service assistant for TechCorp...",
    instruction="Handle this specific user request",
)
```

#### **Content Inclusion Control**
```python
# Control what content is included in prompts
agent = LlmAgent(
    include_contents="none",  # Options: "all", "none", "user_only"
    instruction="Focus only on this instruction",
)
```

#### **Transfer Control**
```python
# Prevent agent from transferring to other agents
agent = LlmAgent(
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
    instruction="Complete this task without delegation",
)
```

#### **Structured Outputs**
```python
from pydantic import BaseModel, Field

class Analysis(BaseModel):
    grade: str = Field(description="Grade: pass or fail")
    reasoning: str = Field(description="Detailed reasoning")
    recommendations: List[str] = Field(description="List of recommendations")

evaluator = LlmAgent(
    output_schema=Analysis,  # Forces structured output
    instruction="Provide analysis in the specified format",
)
```

### **4. Custom Agent Classes**

#### **Extending BaseAgent for Custom Logic**
```python
from google.adk.agents import BaseAgent
from google.adk.events import Event, EventActions

class EscalationChecker(BaseAgent):
    """Custom agent for loop control"""
    
    def __init__(self, name: str):
        super().__init__(name=name)
    
    async def _run_async_impl(self, ctx: InvocationContext) -> AsyncGenerator[Event, None]:
        evaluation = ctx.session.state.get("evaluation_result")
        if evaluation and evaluation.get("grade") == "pass":
            # Escalate to stop the loop
            yield Event(author=self.name, actions=EventActions(escalate=True))
        else:
            # Continue the loop
            yield Event(author=self.name)
```

### **5. Advanced Loop Control**

#### **Loop with Custom Escalation**
```python
# Agent that can control loop termination
loop_with_control = LoopAgent(
    name="controlled_loop",
    max_iterations=5,
    sub_agents=[
        research_agent,
        evaluation_agent,
        EscalationChecker("loop_controller"),  # Custom escalation logic
    ],
)
```

### **3. Agent Hierarchy Examples**

#### **Simple Coordination (Academic Research)**
```
academic_coordinator (LlmAgent)
├── Tools: [AgentTool(websearch_agent), AgentTool(newresearch_agent)]
└── Purpose: Coordinate research tasks using other agents as tools
```

#### **Sequential Processing (LLM Auditor)**
```
llm_auditor (SequentialAgent)
├── critic_agent (LlmAgent with google_search)
└── reviser_agent (LlmAgent with google_search)
```

#### **Complex Multi-Agent (Travel Concierge)**
```
root_agent (LlmAgent)
├── inspiration_agent (LlmAgent)
├── planning_agent (LlmAgent)
│   ├── Tools: [AgentTool(flight_search), AgentTool(hotel_search)]
├── booking_agent (LlmAgent)
├── pre_trip_agent (LlmAgent)
├── in_trip_agent (LlmAgent)
└── post_trip_agent (LlmAgent)
```

#### **Iterative Processing (Image Scoring)**
```
image_scoring (LoopAgent)
├── image_generation_scoring_agent (SequentialAgent)
│   ├── prompt_agent (LlmAgent)
│   ├── image_generation_agent (LlmAgent)
│   └── scoring_agent (LlmAgent)
└── checker_agent (LlmAgent with condition check)
```

---

## 🔗 ADK Callback System

### **1. Callback Types and Use Cases**

#### **before_agent_callback**
- **Purpose**: Setup, initialization, state preparation
- **When**: Before agent starts processing
- **Common uses**: Database setup, agent configuration, state initialization
```python
from google.adk.agents.callback_context import CallbackContext

def setup_callback(callback_context: CallbackContext) -> None:
    """Setup database connections and initial state"""
    if "database_settings" not in callback_context.state:
        callback_context.state["database_settings"] = get_db_config()
        callback_context.state["session_id"] = generate_session_id()

agent = Agent(
    name="data_agent",
    before_agent_callback=setup_callback,
    instruction="Process user data requests",
)
```

#### **after_agent_callback**
- **Purpose**: Cleanup, post-processing, state transformation
- **When**: After agent completes processing
- **Common uses**: Data transformation, source collection, cleanup
```python
def collect_sources_callback(callback_context: CallbackContext) -> None:
    """Collect research sources from grounding metadata"""
    session = callback_context._invocation_context.session
    sources = {}
    
    for event in session.events:
        if event.grounding_metadata:
            # Extract source information
            for chunk in event.grounding_metadata.grounding_chunks:
                if chunk.web:
                    sources[chunk.web.uri] = {
                        "title": chunk.web.title,
                        "domain": chunk.web.domain,
                    }
    
    callback_context.state["sources"] = sources

research_agent = LlmAgent(
    name="research_agent",
    tools=[google_search],
    after_agent_callback=collect_sources_callback,
)
```

#### **before_tool_callback**
- **Purpose**: Tool preparation, input validation, logging
- **When**: Before each tool execution
- **Common uses**: Rate limiting, input validation, logging
```python
def before_tool_callback(callback_context: CallbackContext) -> None:
    """Log tool usage and validate inputs"""
    tool_name = callback_context.tool_name
    inputs = callback_context.tool_inputs
    
    logger.info(f"Executing tool: {tool_name}")
    callback_context.state["tool_usage_count"] = (
        callback_context.state.get("tool_usage_count", 0) + 1
    )

agent = Agent(
    name="tool_user",
    tools=[custom_tool],
    before_tool_callback=before_tool_callback,
)
```

#### **after_tool_callback**
- **Purpose**: Result processing, error handling, state updates
- **When**: After each tool execution
- **Common uses**: Result validation, error logging, state updates
```python
def after_tool_callback(callback_context: CallbackContext) -> None:
    """Process tool results and handle errors"""
    tool_name = callback_context.tool_name
    result = callback_context.tool_result
    
    if result.error:
        logger.error(f"Tool {tool_name} failed: {result.error}")
        callback_context.state["tool_errors"] = (
            callback_context.state.get("tool_errors", []) + [result.error]
        )
    else:
        logger.info(f"Tool {tool_name} succeeded")

agent = Agent(
    name="tool_user",
    tools=[custom_tool],
    after_tool_callback=after_tool_callback,
)
```

#### **before_model_callback**
- **Purpose**: Rate limiting, request modification, monitoring
- **When**: Before each model call
- **Common uses**: Rate limiting, request logging, cost tracking
```python
import time
from google.adk.agents.callback_context import CallbackContext

def rate_limit_callback(callback_context: CallbackContext) -> None:
    """Rate limit model calls"""
    last_call = callback_context.state.get("last_model_call", 0)
    current_time = time.time()
    
    if current_time - last_call < 1:  # 1 second rate limit
        time.sleep(1 - (current_time - last_call))
    
    callback_context.state["last_model_call"] = time.time()

agent = Agent(
    name="rate_limited_agent",
    before_model_callback=rate_limit_callback,
)
```

### **2. Advanced Callback Patterns**

#### **Citation and Source Processing**
```python
def citation_replacement_callback(callback_context: CallbackContext) -> genai_types.Content:
    """Replace citation tags with markdown links"""
    report = callback_context.state.get("final_report", "")
    sources = callback_context.state.get("sources", {})
    
    def replace_citations(match):
        source_id = match.group(1)
        if source_info := sources.get(source_id):
            return f" [{source_info['title']}]({source_info['url']})"
        return ""
    
    processed_report = re.sub(
        r'<cite\s+source\s*=\s*["\']?\s*(src-\d+)\s*["\']?\s*/>',
        replace_citations,
        report,
    )
    
    callback_context.state["final_report"] = processed_report
    return genai_types.Content(parts=[genai_types.Part(text=processed_report)])
```

#### **Complex State Management**
```python
def complex_state_callback(callback_context: CallbackContext) -> None:
    """Manage complex state across multiple agents"""
    # Aggregate results from multiple agents
    results = {
        "market_analysis": callback_context.state.get("market_results"),
        "risk_assessment": callback_context.state.get("risk_results"),
        "recommendations": callback_context.state.get("rec_results"),
    }
    
    # Create summary state for next agent
    callback_context.state["aggregated_analysis"] = {
        "complete": all(results.values()),
        "summary": generate_summary(results),
        "next_steps": determine_next_steps(results),
    }
```

---

## 🔧 ADK Tool Distribution Rules

### **🚨 CRITICAL: Built-in Tool Constraints**

#### **Absolute Rules**
- **Only ONE built-in tool per individual agent**
- **NO other tools can be used with built-in tools in the same agent**
- **Multiple agents in a system can each have their own built-in tool**

#### **Available Built-in Tools**
1. **`google_search`** - Web search capabilities
2. **`built_in_code_execution`** - Execute Python code
3. **`VertexAiSearchTool`** - Query custom data stores

#### **Correct Tool Distribution**
```python
# ✅ CORRECT: Each agent has one built-in tool
search_agent = LlmAgent(
    name="search_agent",
    tools=[google_search],  # Only built-in tool
)

execution_agent = LlmAgent(
    name="execution_agent", 
    tools=[built_in_code_execution],  # Only built-in tool
)

# ✅ CORRECT: Agent with multiple function tools
processing_agent = LlmAgent(
    name="processing_agent",
    tools=[
        FunctionTool(func=validate_data),
        FunctionTool(func=format_output),
        FunctionTool(func=send_email),
    ],
)
```

#### **❌ NEVER DO THIS**
```python
# ❌ WRONG: Built-in tool with other tools
confused_agent = LlmAgent(
    name="confused_agent",
    tools=[
        google_search,  # Built-in tool
        FunctionTool(func=process_data),  # Function tool - NOT ALLOWED
    ],
)
```

### **Function Tool Distribution**
- **Multiple function tools per agent**: ✅ Allowed
- **Mix function tools freely**: ✅ Allowed  
- **Distribute based on agent responsibility**: ✅ Recommended

#### **When Tools ARE Required**
Tools are essential when agents need to interact with external systems, perform calculations, or access capabilities beyond the LLM's natural language processing. Here are the key scenarios:

##### **Built-in Tools (One per agent maximum)**
```python
# ✅ Web search for current information
search_agent = LlmAgent(
    name="search_agent",
    tools=[google_search],
    instruction="Research current information using web search",
)

# ✅ Code execution for calculations/analysis
analysis_agent = LlmAgent(
    name="analysis_agent", 
    tools=[built_in_code_execution],
    instruction="Perform mathematical calculations and data analysis",
)

# ✅ Custom knowledge base queries
knowledge_agent = LlmAgent(
    name="knowledge_agent",
    tools=[VertexAiRagRetrieval(rag_corpus="your-corpus")],
    instruction="Answer questions using internal knowledge base",
)
```

##### **Function Tools (Multiple per agent allowed)**
```python
# ✅ Business operations and external APIs
business_agent = LlmAgent(
    name="business_agent",
    tools=[
        FunctionTool(func=update_crm),
        FunctionTool(func=send_email),
        FunctionTool(func=process_payment),
    ],
    instruction="Handle business operations and customer management",
)

# ✅ Data processing and validation
data_agent = LlmAgent(
    name="data_agent",
    tools=[
        FunctionTool(func=validate_data),
        FunctionTool(func=transform_data),
        FunctionTool(func=export_results),
    ],
    instruction="Process and validate data according to business rules",
)
```

##### **Agent Tools (For conditional delegation)**
```python
# ✅ Conditional agent execution
coordinator = LlmAgent(
    name="coordinator",
    tools=[
        AgentTool(search_specialist),    # Use when search needed
        AgentTool(analysis_specialist),  # Use when analysis needed
    ],
    instruction="Route tasks to appropriate specialists based on requirements",
)
```

##### **When Each Tool Type is Needed:**

**Use `google_search` when:**
- Need current/recent information not in training data
- Researching specific topics, companies, or events
- Gathering multiple perspectives on a subject
- Fact-checking or verification required

**Use `built_in_code_execution` when:**
- Mathematical calculations or statistical analysis
- Data manipulation or transformation
- Chart/graph generation
- Complex algorithmic processing
- NOT for text generation or formatting

**Use `VertexAiRagRetrieval` when:**
- Querying internal company knowledge bases
- Accessing proprietary documentation
- Domain-specific information retrieval
- Custom data that's not publicly available

**Use `FunctionTool` when:**
- Integrating with external APIs or services
- Database operations (CRUD)
- File system operations
- Business logic execution
- Custom processing that requires code

**Use `AgentTool` when:**
- Conditional execution of other agents
- User-controlled workflow delegation
- Flexible orchestration patterns
- Dynamic agent selection based on context

#### **When NO Tools Are Required**
Many planning, reasoning, or text-only tasks can be accomplished by the LLM itself without any external tools.  
If an agent only needs to read from session state and generate structured text (e.g., break a plan into sections, classify items, rewrite content, generate reports) **leave the `tools` list empty or omit it entirely**.

```python
# ✅ No tools needed for pure planning / sectioning logic
section_planner = LlmAgent(
    name="section_planner",
    instruction="Break the approved research plan into executable sections",
    # tools=[]  # Omit tools when unnecessary
)

# ✅ No tools needed for report generation
report_composer = LlmAgent(
    name="report_composer",
    instruction="Generate polished, professional markdown reports with citations",
    # No tools needed - LLM handles text generation naturally
)

# ✅ No tools needed for text processing and formatting
text_processor = LlmAgent(
    name="text_processor", 
    instruction="Process and format text content according to specifications",
    # LLM can handle text manipulation without code execution
)

# ✅ No tools needed for evaluation and decision making
evaluator = LlmAgent(
    name="evaluator",
    output_schema=EvaluationResult,
    instruction="Evaluate quality and provide structured feedback",
    # LLM can assess and structure output without external tools
)
```

##### **Tool Decision Framework:**
Ask these questions to determine if tools are needed:

1. **Does the agent need external data?** → Use `google_search` or `VertexAiRagRetrieval`
2. **Does the agent need to perform calculations?** → Use `built_in_code_execution`
3. **Does the agent need to call external services?** → Use `FunctionTool`
4. **Does the agent need to conditionally use other agents?** → Use `AgentTool`
5. **Is this pure text processing/reasoning?** → No tools needed

> **Anti-pattern**: Adding placeholder `FunctionTool`s for simple LLM reasoning tasks or using `built_in_code_execution` for text generation. Only declare a tool when the agent must call external code, perform calculations, or access external services.

---

## 📡 Session State Communication Protocol

### **🔑 Key Principle**: Information flows through session state, never direct parameters

### **Session State Naming Convention**
```python
# Standard session state keys
user_request = "user_request"          # Original user input
business_context = "business_context"  # Gathered context
step1_results = "step1_results"       # First processing step
step2_results = "step2_results"       # Second processing step  
final_report = "final_report"         # Complete output
```

### **Agent Session State Access Pattern**
```python
agent = LlmAgent(
    name="processing_agent",
    instruction="""
    **READ FROM SESSION STATE:**
    Business context: {business_context}
    Previous results: {step1_results}
    
    **YOUR TASK:**
    Process the data and do your specific work
    
    **OUTPUT:**
    Your results will be automatically saved to session state.
    """,
    output_key="step2_results",  # Automatically saves to session state
)
```

### **State Write Rules**
- **Single State Write**: Agents write to ONE state key via `output_key` 
- **Multiple State Writes**: Only possible through tools or callbacks that manipulate state
- **State Keys Must Exist**: All referenced state keys are guaranteed to exist (no `.get()` needed)

### **State Initialization Pattern**
Use `before_agent_callback` to ensure all required state keys exist with proper default values:

```python
def initialize_workflow_state(callback_context: CallbackContext) -> None:
    """Initialize required state keys with defaults to prevent missing key errors"""
    session_state = callback_context._invocation_context.session.state
    
    # Set default values for all state keys that will be referenced
    if "research_context" not in session_state:
        session_state["research_context"] = {}
    if "research_plan" not in session_state:
        session_state["research_plan"] = {}
    if "research_findings" not in session_state:
        session_state["research_findings"] = []

root_agent = Agent(
    name="workflow_coordinator",
    before_agent_callback=initialize_workflow_state,
    # ... other configuration
)
```

---

## 📋 Session State Data Specifications

### **Critical Rule**: State keys must be documented so downstream agents know exactly what data they can access

### **🚨 CRITICAL: Default ADK Behavior**
- **Default Output**: Agents save conversational text (strings) to state via `output_key`
- **Structured Output**: Only occurs when explicitly using `output_schema` with Pydantic models
- **User Input**: NOT automatically captured - must use `before_agent_callback` to save user messages
- **Conversational Nature**: ADK agents respond to messages, not structured queries

### **📋 Real-World Pattern from Production ADK Agents**
**String-Based Agents (Most Common):**
- **Planning agents**: Create well-structured plans with task classifications like `[RESEARCH]` and `[DELIVERABLE]`
- **Section planners**: Generate markdown outlines for report structure
- **Research agents**: Produce comprehensive findings with embedded tables and formatted content
- **Report composers**: Create final user-facing documents with citations

**Structured Output Agents (Rare - Only for Workflow Control):**
- **Evaluation agents**: Use `output_schema` with specific fields like `grade: "pass"|"fail"` for loop control
- **Quality checkers**: Need structured data for automated decision-making in workflows

**✅ Key Insight**: Well-formatted string output handles 90% of use cases. Only use structured output when you need specific fields for automated workflow logic.

### **🎯 What Belongs in State vs Instructions**
**✅ Store in State (passed between agents):**
- Research plans with task classifications
- Research findings and data
- Report outlines and content
- Evaluation results for workflow control

**❌ Don't Store in State (belongs in instructions):**
- Quality criteria (source counts, recency requirements)
- Search strategies and methodologies  
- Output formatting requirements
- Agent behavioral guidelines

### **Common State Data Structures** (in typical creation order)

#### **`user_request`** (String) 
- **Created by**: Manual capture via `before_agent_callback` (NOT automatic)
- **Data Type**: String
- **Content**: Original user input captured from conversational message
- **Example**: `"Research competitors in the SaaS project management space"`
- **Note**: ADK doesn't automatically create this - you must explicitly capture user input in a callback

#### **`research_context`** (String)
- **Created by**: Planning or context-gathering agents via `output_key`
- **Data Type**: String
- **Content**: Agent's well-structured conversational response about research context
- **Example**: `"Based on your request, I'll focus on SaaS project management tools for small businesses in North America, analyzing competitors like Asana, Monday.com, and Notion. I'll examine pricing strategies, key features, market positioning, and target customer segments to provide comprehensive competitive intelligence."`
```json
{
    "industry": "SaaS",
    "company_name": "Target Company", 
    "research_scope": "competitor analysis",
    "target_market": "small to medium businesses",
    "geographic_focus": "North America"
}
```

#### **`research_plan`** (String)
- **Created by**: Planning agents via `output_key`
- **Data Type**: String
- **Content**: Agent's well-structured research plan with clear task classifications
- **Example**: `"**Research Plan:** [RESEARCH] Analyze top SaaS project management competitors and their market positioning [RESEARCH] Investigate pricing strategies and subscription models across major players [RESEARCH] Identify key features and differentiators in the competitive landscape [RESEARCH] Assess target market segments and customer acquisition strategies [DELIVERABLE] Create comprehensive competitor comparison table [DELIVERABLE] Compile executive summary with strategic recommendations"`

#### **`research_sections`** (String)
- **Created by**: Section planning agents via `output_key`
- **Data Type**: String
- **Content**: Agent's structured markdown outline for the final report
- **Example**: `"# Competitor Landscape Analysis\nComprehensive overview of major players in the SaaS project management space\n\n# Pricing Strategy Comparison\nDetailed analysis of subscription models, pricing tiers, and value propositions\n\n# Feature Differentiation\nComparison of key features and unique selling points\n\n# Market Positioning\nAnalysis of target segments and competitive advantages\n\n# Strategic Recommendations\nActionable insights for competitive positioning"`

#### **`research_findings`** (String)
- **Created by**: Research execution agents via `output_key`
- **Data Type**: String
- **Content**: Agent's comprehensive research findings with detailed analysis
- **Example**: `"**Research Findings Summary:**\n\n**[RESEARCH] Competitor Analysis:**\nAsana (founded 2008, 1000+ employees, $378M revenue 2023) leads with strong task management and team collaboration features. Monday.com offers visual project boards with 152k+ customers. Notion provides all-in-one workspace combining docs, databases, and project management.\n\n**[RESEARCH] Pricing Analysis:**\nFreemium model dominates: Asana ($10.99-24.99/user/month), Monday.com ($8-16/user/month), Notion ($8-15/user/month). Enterprise tiers range $25-30+ per user.\n\n**[DELIVERABLE] Competitor Comparison Table:**\n| Company | Founded | Employees | Revenue | Key Features |\n|---------|---------|-----------|---------|-------------|\n| Asana | 2008 | 1000+ | $378M | Task management, collaboration |\n| Monday.com | 2012 | 1400+ | $900M | Visual boards, automation |"`

#### **`evaluation_result`** (Dictionary)
- **Created by**: Quality assessment agents using `output_schema`
- **Data Type**: Dictionary (Pydantic model)
- **Content**: Structured evaluation with specific grade for loop control logic
- **Purpose**: **Loop control** - the `grade: "pass"|"fail"` field determines whether the refinement loop continues
- **Example**:
```json
{
    "grade": "pass",
    "overall_score": 85,
    "quality_assessment": {
        "source_count": 12,
        "data_recency": "90% within 6 months",
        "coverage_completeness": "85%"
    },
    "feedback": "Strong competitor analysis with recent data",
    "gaps_identified": ["Missing pricing for 2 competitors"],
    "follow_up_needed": false
}
```

#### **`enhanced_research`** (String)
- **Created by**: Enhancement/refinement agents via `output_key`
- **Data Type**: String
- **Content**: Agent's enhanced research findings that replace the original findings
- **Example**: `"**Enhanced Research Findings (Updated):**\n\n**[RESEARCH] Competitor Analysis:**\nAsana (founded 2008, 1000+ employees, $378M revenue 2023) - Recently launched AI-powered project intelligence features. Monday.com (152k+ customers, $900M revenue) - Added advanced automation workflows in Q4 2024. Notion - Expanded database capabilities and launched team collaboration features.\n\n**[RESEARCH] Pricing Analysis (UPDATED):**\nAsana: Free tier + Premium ($10.99/month), Business ($24.99/month). Monday.com: Basic ($8/month), Standard ($10/month), Pro ($16/month). Notion: Personal (Free), Plus ($8/month), Business ($15/month).\n\n**[DELIVERABLE] Updated Comparison Table:**\n[Complete enhanced table with all missing data filled]"`

#### **`final_report`** (String)
- **Created by**: Report generation agents
- **Data Type**: String (Markdown formatted)
- **Content**: Complete formatted report with findings and citations
- **Example**: `"# Competitor Analysis Report\n\n## Executive Summary\n..."`

### **State Access Examples**

#### **Accessing State Data in Instructions**

**Default String-Based Access:**
```python
# ✅ Most common - accessing string state data
instruction="""
Research Context: {research_context}
Previous Research Plan: {research_plan}
Current Findings: {research_findings}
Quality Assessment: {evaluation_result}

Your task: Use this information to enhance the research.
"""
```

**Structured Data Access (only with `output_schema`):**
```python
# ✅ Only when using output_schema with Pydantic models
instruction="""
Research Context: {research_context}
Target Industry: {research_context[industry]}
Company Focus: {research_context[company_name]}

Previous Findings: {research_findings}
Competitor Data: {research_findings[competitors]}
"""
```

#### **⚠️ Common Mistake**
```python
# ❌ Wrong - assuming nested access without output_schema
instruction="""
Company: {research_context[company_name]}  # This fails if research_context is a string
"""

# ✅ Correct - string-based access (default behavior)
instruction="""
Research Context: {research_context}  # This works with default string output
"""
```

---

## 🛠️ Advanced Tool Patterns

### **1. Specialized Built-in Tools**

#### **VertexAiRagRetrieval (Custom Knowledge Base)**
- **Purpose**: Query custom document collections and knowledge bases
- **Use case**: Document Q&A, internal knowledge retrieval
- **Configuration**: Requires RAG corpus setup
```python
from google.adk.tools.retrieval.vertex_ai_rag_retrieval import VertexAiRagRetrieval
from vertexai.preview import rag
import os

rag_tool = VertexAiRagRetrieval(
    name='retrieve_documentation',
    description='Retrieve relevant documentation from the knowledge base',
    rag_resources=[
        rag.RagResource(
            rag_corpus="projects/your-project/locations/us-central1/ragCorpora/your-corpus"
        )
    ],
    similarity_top_k=10,
    vector_distance_threshold=0.6,
)

knowledge_agent = Agent(
    name="knowledge_agent",
    tools=[rag_tool],
    instruction="Answer questions using the document knowledge base",
)
```

#### **Built-in Code Execution**
- **Purpose**: Execute Python code for calculations, data manipulation, or running small scripts
- **Use case**: Mathematical calculations, data analysis, computational tasks, NOT for report generation
- **When to use**: When you need actual code execution for calculations or data processing
- **When NOT to use**: For text generation, report writing, content creation (use LLM capabilities instead)
```python
from google.adk.tools import built_in_code_execution

analysis_agent = LlmAgent(
    name="analysis_agent",
    tools=[built_in_code_execution],
    instruction="Perform mathematical calculations and data analysis using Python code execution",
)

# ❌ WRONG - Don't use for report generation
report_agent = LlmAgent(
    name="report_agent",
    tools=[built_in_code_execution],  # Not needed for text generation
    instruction="Generate markdown reports",
)

# ✅ CORRECT - Use LLM capabilities for report generation
report_agent = LlmAgent(
    name="report_agent",
    # No tools needed - LLM handles text generation naturally
    instruction="Generate polished, professional markdown reports",
)
```

### **2. Custom Function Tools**

#### **Business Function Tools**
```python
from google.adk.tools import FunctionTool

def update_crm(customer_id: str, status: str) -> str:
    """Update customer status in CRM system"""
    # Implementation here
    return f"Updated customer {customer_id} to status {status}"

def send_email(recipient: str, subject: str, body: str) -> str:
    """Send email to customer"""
    # Implementation here
    return f"Email sent to {recipient}"

def generate_report(data: dict) -> str:
    """Generate business report"""
    # Implementation here
    return "Report generated successfully"

business_agent = Agent(
    name="business_agent",
    tools=[
        FunctionTool(func=update_crm),
        FunctionTool(func=send_email),
        FunctionTool(func=generate_report),
    ],
    instruction="Handle business operations and customer management",
)
```

#### **Data Processing Tools**
```python
def validate_data(data: dict) -> bool:
    """Validate input data format"""
    required_fields = ["id", "name", "email"]
    return all(field in data for field in required_fields)

def transform_data(data: dict) -> dict:
    """Transform data to required format"""
    return {
        "customer_id": data["id"],
        "full_name": data["name"].title(),
        "email_address": data["email"].lower(),
    }

def export_results(results: list) -> str:
    """Export results to file"""
    # Implementation here
    return f"Exported {len(results)} records"

data_agent = Agent(
    name="data_processor",
    tools=[
        FunctionTool(func=validate_data),
        FunctionTool(func=transform_data),
        FunctionTool(func=export_results),
    ],
    instruction="Process and validate data according to business rules",
)
```

### **3. AgentTool Patterns**

#### **Agent-as-Tool Pattern**
```python
from google.adk.tools.agent_tool import AgentTool

# Create specialized agents
search_agent = LlmAgent(
    name="search_specialist",
    tools=[google_search],
    instruction="Search for information on specific topics",
)

analysis_agent = LlmAgent(
    name="analysis_specialist",
    tools=[built_in_code_execution],
    instruction="Analyze data and create visualizations",
)

# Use agents as tools in coordinator
coordinator = LlmAgent(
    name="coordinator",
    tools=[
        AgentTool(agent=search_agent),
        AgentTool(agent=analysis_agent),
    ],
    instruction="Coordinate research and analysis workflow",
)
```

### **4. Tool Configuration Patterns**

#### **Multiple Tool Types**
```python
# Agent automatically selects appropriate tools based on task needs
multi_tool_agent = Agent(
    name="multi_tool_agent",
    tools=[
        google_search,              # For research tasks
        built_in_code_execution,    # For analysis tasks (Can't use with google_search)
        FunctionTool(func=custom_process),  # For custom processing
    ],
    instruction="Use appropriate tools based on task requirements",
)

# Note: Built-in tools (google_search, built_in_code_execution) cannot be combined
# Use separate agents for different built-in tools
research_agent = Agent(
    name="research_agent",
    tools=[google_search],
    instruction="Handle research tasks",
)

analysis_agent = Agent(
    name="analysis_agent", 
    tools=[built_in_code_execution],
    instruction="Handle analysis tasks",
)
```

### **5. Advanced Tool Integration**

#### **LangChain Tool Integration**
```python
from google.adk.tools.langchain_tool import LangchainTool
from langchain_community.tools import StackExchangeTool
from langchain_community.utilities import StackExchangeAPIWrapper

# Convert LangChain tool to ADK tool
stack_exchange_tool = StackExchangeTool(api_wrapper=StackExchangeAPIWrapper())
langchain_tool = LangchainTool(stack_exchange_tool)

agent = Agent(
    name="langchain_agent",
    tools=[langchain_tool],
    instruction="Use LangChain tools integrated with ADK",
)
```

#### **MCP (Model Context Protocol) Tools**
```python
from google.adk.tools.mcp_tool import MCPToolset, StreamableHTTPConnectionParams
import os

# Configure MCP toolset for GitHub integration
mcp_tools = MCPToolset(
    connection_params=StreamableHTTPConnectionParams(
        url="https://api.githubcopilot.com/mcp/",
        headers={
            "Authorization": "Bearer your-github-token",
        },
    ),
    tool_filter=[
        "search_repositories",
        "search_issues",
        "list_issues",
        "get_issue",
        "list_pull_requests",
        "get_pull_request",
    ],
)

github_agent = Agent(
    name="github_agent",
    tools=[mcp_tools],
    instruction="Use MCP tools to interact with GitHub",
)
```

#### **Toolbox Integration**
```python
from toolbox_core import ToolboxSyncClient
import os

# Initialize Toolbox client
TOOLBOX_URL = "http://127.0.0.1:5000"
toolbox = ToolboxSyncClient(TOOLBOX_URL)

# Load all tools from a toolset
toolbox_tools = toolbox.load_toolset("tickets_toolset")

toolbox_agent = Agent(
    name="toolbox_agent",
    tools=toolbox_tools,
    instruction="Use external toolbox systems",
)
```

#### **Mixed Tool Ecosystems**
```python
from google.adk.tools import google_search, FunctionTool
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.langchain_tool import LangchainTool
from google.adk.tools.mcp_tool import MCPToolset

# Combine multiple tool types in one agent
mixed_agent = Agent(
    name="mixed_agent",
    tools=[
        google_search,                    # Built-in tool
        FunctionTool(func=custom_func),   # Function tool
        langchain_tool,                   # LangChain tool
        mcp_tools,                        # MCP tools
        AgentTool(agent=sub_agent),       # Agent as tool
        *toolbox_tools,                   # Toolbox tools
    ],
    instruction="Use all available tool types as needed",
)
```

### **6. Tool Module Organization**

#### **Module-Based Tool Organization**
```python
# tools/membership.py
from google.adk.tools import FunctionTool

def create_member(name: str, email: str) -> str:
    """Create a new member account"""
    return f"Created member: {name}"

def lookup_member(member_id: str) -> dict:
    """Look up member information"""
    return {"id": member_id, "status": "active"}

def get_tools():
    """Return all tools from this module"""
    return [
        FunctionTool(func=create_member),
        FunctionTool(func=lookup_member),
    ]

# agent.py
from .tools import membership, claims, rewards

# Use module tool spreading
root_agent = Agent(
    name="insurance_agent",
    tools=[
        *membership.get_tools(),  # Spread membership tools
        *claims.get_tools(),      # Spread claims tools
        *rewards.get_tools(),     # Spread rewards tools
    ],
    instruction="Handle insurance operations",
)
```

### **7. Advanced Planner Configuration**

#### **Thinking Configuration**
```python
from google.adk.planners import BuiltInPlanner
from google.genai import types as genai_types

# Enable thinking for complex reasoning
thinking_agent = LlmAgent(
    name="thinking_agent",
    planner=BuiltInPlanner(
        thinking_config=genai_types.ThinkingConfig(include_thoughts=True)
    ),
    instruction="Solve complex problems with step-by-step reasoning",
)
```

### **8. Latest Model Support**

#### **Gemini 2.0 Flash Models**
```python
# Support for latest Gemini models
agent = Agent(
    name="modern_agent",
    model="gemini-2.0-flash",  # Latest model
    instruction="Use the latest Gemini capabilities",
)

# Support for voice/streaming models
voice_agent = Agent(
    name="voice_agent",
    model="gemini-2.0-flash-live-001",  # Live streaming model
    instruction="Handle voice and video interactions",
)
```

### **9. Advanced Prompt Patterns**

#### **Complex Templating**
```python
# prompt.py
ROOT_AGENT_INSTR = """
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

# agent.py
from . import prompt

root_agent = Agent(
    name="travel_agent",
    instruction=prompt.ROOT_AGENT_INSTR,
    sub_agents=[pre_trip_agent, in_trip_agent, post_trip_agent],
)
```

#### **Dynamic Tool Configuration**
```python
def configure_agent_tools(capabilities: list) -> list:
    """Configure agent tools based on required capabilities"""
    tools = []
    
    if "search" in capabilities:
        tools.append(google_search)
    
    if "mcp" in capabilities:
        tools.append(mcp_tools)
        
    if "knowledge" in capabilities:
        tools.append(rag_tool)
    
    return tools

# Use in agent configuration
flexible_agent = Agent(
    name="flexible_agent",
    model="gemini-2.5-flash",
    tools=configure_agent_tools(["search", "knowledge"]),
    instruction="Use configured tools based on capabilities",
)
```

---

## 🏗️ ADK Project Structure Requirements

### **1. Import Patterns**

#### **Standard Import Patterns**
```python
# Recommended agent imports
from google.adk.agents import Agent, LlmAgent, SequentialAgent, ParallelAgent, LoopAgent, BaseAgent

# Alternative shorthand imports (both work)
from google.adk.agents import Agent  # Recommended
from google.adk import Agent         # Alternative

# Tool imports
from google.adk.tools import google_search, FunctionTool, built_in_code_execution
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.langchain_tool import LangchainTool
from google.adk.tools.mcp_tool import MCPToolset, StreamableHTTPConnectionParams
from google.adk.tools.retrieval.vertex_ai_rag_retrieval import VertexAiRagRetrieval

# Session and runner imports
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.agents.callback_context import CallbackContext

# Planning and configuration
from google.adk.planners import BuiltInPlanner
from google.genai import types as genai_types

# Events and actions
from google.adk.events import Event, EventActions
from google.adk.agents.invocation_context import InvocationContext
```

### **2. 🚨 CRITICAL: ADK Compliance File Structure**
```
agent-project/
├── agent.py                           # Root agent definitions
├── __init__.py                        # Export: from .agent import root_agent
├── sub_agents/                        # Sub-agents (if using sub-folders)
│   ├── agent1_name/
│   │   ├── agent.py                   # Agent definition
│   │   └── __init__.py                # Export: from .agent import agent1_name
│   └── agent2_name/
│       ├── agent.py                   # Agent definition
│       └── __init__.py                # Export: from .agent import agent2_name
└── tools/                             # Custom function tools (if needed)
    ├── __init__.py                    # Tools package init
    └── function_tools.py              # Custom function tools
```

### **Required File Patterns**

#### **1. Root Agent Export (`__init__.py`)**
```python
from .agent import root_agent
__all__ = ["root_agent"]
```

#### **2. Main Agent File (`agent.py`)**
```python
from google.adk.agents import LlmAgent, SequentialAgent

root_agent = LlmAgent(
    name="root_agent",
    model="gemini-2.5-flash",
    # ... agent configuration
)
```

#### **3. Configuration (`config.py`) - Optional**
```python
from typing import Optional

class Config:
    def __init__(self):
        self.project_id: Optional[str] = "your-project-id"
        self.location: str = "us-central1"
        self.model: str = "gemini-2.5-flash"
```

**Note**: Focus on agent logic and architecture in workflow designs. Project dependencies and complex file structures are implementation details that should be handled separately during actual development.

---

## 🚀 Advanced Development & Deployment Patterns

### **Modern Development Workflow**

#### **ADK CLI Commands**
```bash
# Create new agent project
adk create  --model gemini-2.5-pro --project YOUR_PROJECT_ID my_agent 

# Run agent interactively
adk run my_agent

# Launch development UI
adk web

# Launch API server for testing
adk api_server

```

#### **Development UI Features**
- **Interactive testing** with text and voice
- **Event inspection** for debugging tool calls
- **Real-time conversation tracking**
- **Voice/video streaming** support
- **Trace analysis** for performance monitoring

#### **Session and Memory Management**
```python
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService

# Create runner with session management
runner = Runner(
    agent=root_agent,
    session_service=InMemorySessionService(),
)

# Run with session context
response = runner.run(
    user_id="user123",
    session_id="session456",
    content="Hello, agent!"
)
```

### **Google Cloud Agent Engine Deployment**

**Note**: Deployment configuration and setup is an implementation detail that should be handled separately from agent design. Focus on agent logic and architecture during workflow design.

---

## 🎨 Common ADK Agent Patterns

### **1. Human Consultant Root Agent**
```python
# Root agent gathers context and delegates
root_agent = LlmAgent(
    name="root_agent",
    model="gemini-2.5-flash",
    instruction="""
    You are a helpful consultant. Your role is to:
    1. Understand the user's needs
    2. Gather necessary context
    3. Delegate work to specialized agents
    
    Save important context to session state for other agents to use.
    """,
    sub_agents=[specialized_workflow_agent],
    output_key="user_context",
)
```

### **2. Sequential Processing Pipeline**
```python
# Sequential workflow for step-by-step processing
workflow_agent = SequentialAgent(
    name="workflow_agent",
    description="Process user request through multiple steps",
    sub_agents=[
        planning_agent,    # Creates plan
        execution_agent,   # Executes plan
        review_agent,      # Reviews results
    ],
)
```

### **3. Parallel Processing System**
```python
# Parallel agents for concurrent tasks
parallel_agent = ParallelAgent(
    name="parallel_processor",
    description="Process multiple aspects simultaneously",
    sub_agents=[
        data_analysis_agent,
        market_research_agent,
        risk_assessment_agent,
    ],
)
```

### **4. Iterative Loop Processing**
```python
# Loop agent for repetitive tasks
loop_agent = LoopAgent(
    name="iterative_processor",
    description="Repeat until condition met",
    max_iterations=10,
    sub_agents=[
        processing_agent,
        evaluation_agent,
    ],
)
```

### **5. Tool-Specialized Agents**
```python
# Agent specialized for search tasks
search_agent = LlmAgent(
    name="search_agent",
    model="gemini-2.5-flash",
    tools=[google_search],
    instruction="Use Google search to find information",
    output_key="search_results",
)

# Agent specialized for data processing
processing_agent = LlmAgent(
    name="processing_agent", 
    model="gemini-2.5-flash",
    tools=[
        FunctionTool(func=validate_data),
        FunctionTool(func=transform_data),
        FunctionTool(func=export_results),
    ],
    instruction="Process and transform data",
    output_key="processed_data",
)
```

---

## 🔄 Sub-Agent Management Patterns

### **1. Sub-Agent Reference Patterns**

#### **Class References (Import Pattern)**
```python
# Import sub-agent classes
from .sub_agents.research_agent import ResearchAgent
from .sub_agents.analysis_agent import AnalysisAgent
from .sub_agents.reporting_agent import ReportingAgent

# Use as class references
root_agent = Agent(
    name="root_agent",
    model="gemini-2.5-flash",
    sub_agents=[
        ResearchAgent,    # Class reference
        AnalysisAgent,    # Class reference
        ReportingAgent,   # Class reference
    ],
    instruction="Coordinate research workflow",
)
```

#### **Instance References (Direct Pattern)**
```python
# Create instances directly
keyword_agent = LlmAgent(
    name="keyword_agent",
    model="gemini-2.5-flash",
    instruction="Find relevant keywords",
)

search_agent = LlmAgent(
    name="search_agent", 
    model="gemini-2.5-flash",
    tools=[google_search],
    instruction="Search for information",
)

comparison_agent = LlmAgent(
    name="comparison_agent",
    model="gemini-2.5-flash",
    instruction="Compare search results",
)

# Use as instances
root_agent = Agent(
    name="root_agent",
    model="gemini-2.5-flash",
    sub_agents=[
        keyword_agent,      # Instance reference
        search_agent,       # Instance reference
        comparison_agent,   # Instance reference
    ],
    instruction="Coordinate workflow",
)
```

#### **AgentTool Wrapper Pattern**
```python
from google.adk.tools.agent_tool import AgentTool

# Create specialized agents
websearch_agent = LlmAgent(
    name="websearch_agent",
    tools=[google_search],
    instruction="Search for academic papers",
)

newresearch_agent = LlmAgent(
    name="newresearch_agent",
    tools=[built_in_code_execution],
    instruction="Analyze research gaps",
)

# Use as tools instead of sub-agents
coordinator = LlmAgent(
    name="coordinator",
    tools=[
        AgentTool(agent=websearch_agent),    # Agent as tool
        AgentTool(agent=newresearch_agent),  # Agent as tool
    ],
    instruction="Coordinate using agents as tools",
)
```

### **2. Sub-Agent Organization Patterns**

#### **Nested Agent Hierarchies**
```python
# Complex nested structure
processing_pipeline = SequentialAgent(
    name="processing_pipeline",
    sub_agents=[
        preprocessing_agent,
        analysis_pipeline,  # This is also a SequentialAgent
        reporting_agent,
    ],
)

analysis_pipeline = SequentialAgent(
    name="analysis_pipeline", 
    sub_agents=[
        data_cleaning_agent,
        statistical_analysis_agent,
        visualization_agent,
    ],
)

root_agent = LlmAgent(
    name="root_agent",
    sub_agents=[processing_pipeline],  # Nested hierarchy
    instruction="Coordinate data analysis workflow",
)
```

#### **Mixed Agent Types**
```python
# Combine different agent types
workflow_agent = SequentialAgent(
    name="workflow_agent",
    sub_agents=[
        planning_agent,        # LlmAgent
        parallel_processor,    # ParallelAgent
        iterative_refiner,     # LoopAgent
        final_reviewer,        # LlmAgent
    ],
)
```

### **3. Sub-Agent Communication Patterns**

#### **State-Based Communication**
```python
# Each agent reads from and writes to session state
step1_agent = LlmAgent(
    name="step1_agent",
    instruction="Process input and save to 'step1_results'",
    output_key="step1_results",
)

step2_agent = LlmAgent(
    name="step2_agent",
    instruction="Use {step1_results} to perform analysis",
    output_key="step2_results",
)

pipeline = SequentialAgent(
    name="pipeline",
    sub_agents=[step1_agent, step2_agent],
)
```

#### **Conditional Sub-Agent Selection**
```python
class ConditionalAgent(BaseAgent):
    """Agent that selects sub-agents based on input"""
    
    def __init__(self, name: str):
        super().__init__(name=name)
        self.research_agent = ResearchAgent()
        self.analysis_agent = AnalysisAgent()
        self.report_agent = ReportAgent()
    
    async def _run_async_impl(self, ctx: InvocationContext) -> AsyncGenerator[Event, None]:
        task_type = ctx.session.state.get("task_type", "research")
        
        if task_type == "research":
            async for event in self.research_agent._run_async_impl(ctx):
                yield event
        elif task_type == "analysis":
            async for event in self.analysis_agent._run_async_impl(ctx):
                yield event
        else:
            async for event in self.report_agent._run_async_impl(ctx):
                yield event
```

### **4. Configuration and Constants Patterns**

#### **Shared Configuration**
```python
# shared_libraries/constants.py
MODEL = "gemini-2.5-flash"
AGENT_NAME = "brand_optimizer"
DESCRIPTION = "Optimize brand search performance"

# agent.py
from .shared_libraries import constants

root_agent = Agent(
    model=constants.MODEL,
    name=constants.AGENT_NAME,
    description=constants.DESCRIPTION,
    sub_agents=[
        keyword_agent,
        search_agent,
        comparison_agent,
    ],
)
```

#### **Configuration-Based Agent Setup**
```python
# config.py
class Config:
    def __init__(self):
        self.project_id = "your-project-id"
        self.location = "us-central1"
        self.model = "gemini-2.5-flash"
        self.agent_name = "default_agent"

# agent.py
from .config import Config

config = Config()

root_agent = Agent(
    model=config.model,
    name=config.agent_name,
    instruction="Handle user requests",
)
```

---

## 📊 Agent Communication Patterns

### **1. Linear Communication (Sequential)**
```
Agent A → Session State → Agent B → Session State → Agent C
```

### **2. Hub Communication (Root + Sub-agents)**
```
Root Agent
├── Delegates to Agent A → Session State
├── Delegates to Agent B → Session State  
└── Delegates to Agent C → Session State
```

### **3. Parallel Communication**
```
Parallel Agent
├── Agent A → Session State A
├── Agent B → Session State B
└── Agent C → Session State C
    └── Combiner Agent reads all states
```

### **4. Loop Communication**
```
Loop Agent
├── Processing Agent → Session State
├── Evaluation Agent → reads Session State
└── Condition Check → continue/exit loop
```

---

## 🚨 ADK Anti-Patterns to Avoid

### **1. Over-Engineering Red Flags**
❌ **IMMEDIATE RED FLAGS**:
- "I need 5+ agents for this task"
- "Root agent has complex processing instructions"
- "Using built-in tools with other tools in same agent"
- "Complex session state management patterns"

✅ **CORRECT APPROACH**:
- Start with 1 agent, add complexity only when justified
- Root agent coordinates, sub-agents process
- Distribute built-in tools across separate agents
- Use simple session state key-value communication

### **2. Tool Distribution Mistakes**
❌ **WRONG**: Built-in tool + function tools in same agent
❌ **WRONG**: Multiple built-in tools in same agent  
❌ **WRONG**: Agents sharing built-in tools

✅ **CORRECT**: One built-in tool per agent, unlimited function tools per agent

### **3. Session State Anti-Patterns**
❌ **WRONG**: Direct parameter passing between agents
❌ **WRONG**: Complex nested session state structures
❌ **WRONG**: Agents modifying other agents' state directly

✅ **CORRECT**: Simple key-value session state communication

### **4. Agent Hierarchy Mistakes**
❌ **WRONG**: Root agent doing processing work
❌ **WRONG**: Deep agent hierarchies (>3 levels)
❌ **WRONG**: Agents calling each other directly

✅ **CORRECT**: Root delegates, clear hierarchy, session state communication

---

## 🔄 Workflow Design Process

### **Step 1: Understand User Intent**
1. **Analyze user's workflow description**
2. **Identify key processing steps**
3. **Determine data flow requirements**
4. **Assess complexity level**

### **Step 2: Choose Agent Architecture**
1. **Single Agent**: Simple tasks, one tool needed
2. **Sequential**: Step-by-step dependencies
3. **Parallel**: Independent concurrent tasks
4. **Loop**: Iterative processing needed
5. **Complex**: Multiple patterns combined

### **Step 3: Design Agent Hierarchy**
1. **Root Agent**: Human consultant pattern
2. **Workflow Agents**: SequentialAgent, ParallelAgent, LoopAgent
3. **Specialized Agents**: Tool-specific LlmAgents
4. **Support Agents**: Validation, formatting, etc.

### **Step 4: Distribute Tools**
1. **Built-in Tools**: One per agent maximum
2. **Function Tools**: Group by agent responsibility
3. **Tool Specialization**: Match tools to agent purpose

### **Step 5: Define Session State Flow**
1. **Input Keys**: What each agent reads
2. **Output Keys**: What each agent writes
3. **State Naming**: Clear, consistent naming
4. **State Validation**: Ensure proper flow

---

## 📚 ADK Agent Best Practices Cheat Sheet

### **Agent Design Principles**
1. **Single Responsibility**: Each agent has one clear purpose
2. **Loose Coupling**: Agents communicate through session state
3. **Tool Specialization**: Match tools to agent capabilities
4. **Simple Instructions**: Clear, focused agent instructions
5. **Error Handling**: Graceful failure and recovery

### **Model Selection Guide**
- **gemini-2.0-flash**: Latest model with enhanced capabilities, voice/video support
- **gemini-2.0-flash-live-001**: Live streaming model for real-time audio/video
- **gemini-2.5-flash**: Fast, cost-effective for most tasks
- **gemini-2.5-pro**: Complex reasoning, analysis, long outputs
- **gemini-1.5-flash**: Older but reliable model
- **gemini-1.5-pro**: Older model for complex reasoning

### **Model Capability Matrix**
| Model | Speed | Cost | Reasoning | Streaming | Voice/Video |
|-------|-------|------|-----------|-----------|-------------|
| gemini-2.0-flash | ⚡⚡⚡ | $ | ⭐⭐⭐ | ✅ | ✅ |
| gemini-2.0-flash-live-001 | ⚡⚡⚡ | $ | ⭐⭐⭐ | ✅ | ✅ |
| gemini-2.5-flash | ⚡⚡⚡ | $ | ⭐⭐⭐ | ✅ | ❌ |
| gemini-2.5-pro | ⚡⚡ | $$ | ⭐⭐⭐⭐⭐ | ✅ | ❌ |
| gemini-1.5-flash | ⚡⚡⚡ | $ | ⭐⭐ | ✅ | ❌ |
| gemini-1.5-pro | ⚡⚡ | $$ | ⭐⭐⭐⭐ | ✅ | ❌ |

### **Session State Best Practices**
- **Consistent naming**: Use clear, descriptive keys
- **Minimal data**: Only store necessary information
- **Validation**: Check state before using
- **Documentation**: Document state flow in instructions

### **Tool Integration Guidelines**
- **Built-in tools**: Use for external data/capabilities
- **Function tools**: Use for custom processing logic
- **Tool documentation**: Clear descriptions for LLM understanding
- **Error handling**: Graceful tool failure management

### **Deployment Considerations**
- **Agent Logic**: Focus on agent design and architecture
- **Testing**: Test agent behavior locally
- **Monitoring**: Enable tracing for debugging

---

## 🎯 Example Workflow Conversions

### **Example 1: Simple User Request**
**User Input**: "I need an agent that answers questions about my documents"

**ADK Design**:
```python
# Single agent with RAG capability
root_agent = LlmAgent(
    name="document_qa_agent",
    model="gemini-2.5-flash",
    tools=[VertexAiRagRetrieval(rag_corpus="your-corpus")],
    instruction="Answer questions using document knowledge",
)
```

### **Example 2: Multi-Step Process**
**User Input**: "Create a research agent that searches, analyzes, and reports"

**ADK Design**:
```python
# Sequential workflow
research_pipeline = SequentialAgent(
    name="research_pipeline",
    sub_agents=[
        search_agent,     # Uses google_search
        analysis_agent,   # Uses code_execution
        report_agent,     # Uses function tools
    ],
)

root_agent = LlmAgent(
    name="research_coordinator",
    sub_agents=[research_pipeline],
    instruction="Coordinate research workflow",
)
```

### **Example 3: Complex Multi-Agent System**
**User Input**: "Build a financial advisor with market analysis, strategy, and risk assessment"

**ADK Design**:
```python
# Complex coordination system
financial_coordinator = LlmAgent(
    name="financial_coordinator",
    model="gemini-2.5-pro",
    tools=[
        AgentTool(agent=data_analyst_agent),    # Uses google_search
        AgentTool(agent=strategy_agent),        # Uses code_execution
        AgentTool(agent=risk_agent),            # Uses function tools
        AgentTool(agent=execution_agent),       # Uses function tools
    ],
    instruction="Guide users through financial analysis workflow",
)
```

---

## 🎓 Advanced ADK Patterns

### **1. Dynamic Agent Selection**
```python
# Root agent selects appropriate workflow based on request
root_agent = LlmAgent(
    name="dynamic_coordinator",
    instruction="""
    Based on the user's request:
    - For simple queries: delegate to simple_agent
    - For complex analysis: delegate to analysis_pipeline
    - For data processing: delegate to processing_workflow
    """,
    sub_agents=[simple_agent, analysis_pipeline, processing_workflow],
)
```

### **2. Conditional Workflow Routing**
```python
# Agent routes based on session state conditions
routing_agent = LlmAgent(
    name="routing_agent",
    instruction="""
    Check session state and route accordingly:
    - If user_type == "expert": use advanced_workflow
    - If user_type == "beginner": use simple_workflow
    """,
    sub_agents=[advanced_workflow, simple_workflow],
)
```

### **3. Error Recovery Patterns**
```python
# Agent with fallback mechanisms
robust_agent = LlmAgent(
    name="robust_processor",
    instruction="""
    Try primary processing method.
    If it fails, use fallback method.
    Always provide user with status updates.
    """,
    tools=[primary_tool, fallback_tool],
)
```

### **4. Human-in-the-Loop**
```python
# Agent that requests human approval
hitl_agent = LlmAgent(
    name="approval_agent",
    instruction="""
    Process the request and create a plan.
    Present plan to user for approval.
    Only proceed after explicit user confirmation.
    """,
    sub_agents=[execution_agent],
)
```

---

## 🔍 Troubleshooting Common Issues

### **1. Agent Not Responding**
**Symptoms**: Agent doesn't process requests
**Solutions**:
- Check `root_agent` export in `__init__.py`
- Verify agent configuration
- Test with simple instruction first

### **2. Tool Errors**
**Symptoms**: Tool calls fail
**Solutions**:
- Check built-in tool constraints (one per agent)
- Verify function tool implementations
- Test tools independently

### **3. Session State Issues**
**Symptoms**: Data not flowing between agents
**Solutions**:
- Check `output_key` configuration
- Verify session state key naming
- Debug state at each step

### **4. Deployment Failures**
**Symptoms**: Agent won't deploy to Cloud
**Solutions**:
- Verify agent configuration and exports
- Check agent configuration
- Test locally first

---

## 📈 Performance Optimization

### **1. Agent Efficiency**
- **Minimize agent count**: Use fewer, more capable agents
- **Optimize instructions**: Clear, concise instructions
- **Smart tool selection**: Choose appropriate tools for tasks

### **2. Session State Management**
- **Minimal state**: Only store necessary data
- **State cleanup**: Clear unused state
- **Efficient serialization**: Use simple data types

### **3. Tool Performance**
- **Function tool optimization**: Efficient implementations
- **Built-in tool usage**: Leverage optimized built-ins
- **Error handling**: Quick failure recovery

---

## 🎯 Quality Checklist

### **Before Implementation**
- [ ] Clear agent responsibilities defined
- [ ] Tool distribution follows ADK rules
- [ ] Session state flow documented
- [ ] Architecture matches complexity needs
- [ ] Anti-patterns avoided

### **During Implementation**
- [ ] Root agent exports correctly
- [ ] Agent hierarchy follows patterns
- [ ] Session state keys consistent
- [ ] Tools properly configured
- [ ] Instructions clear and focused

### **After Implementation**
- [ ] Local testing successful
- [ ] Agent behavior validated
- [ ] Error handling implemented
- [ ] Performance acceptable
- [ ] Documentation complete

---

*This guide represents the collective knowledge from analyzing all ADK agent patterns in the repository. Use it as your comprehensive reference for designing and building effective ADK agent systems.*

**Version**: 1.0  
**Last Updated**: January 2025  
**Architecture**: Google Agent Development Kit  
**Deployment Target**: Google Cloud Agent Engine 

---

## 🎯 Advanced ADK Agent Design Patterns

### **Critical Architecture Decisions**

This section addresses sophisticated ADK patterns that separate professional implementations from basic designs. These patterns are based on analysis of production ADK agents and common design mistakes.

---

## 🔗 Agent-as-Tool vs. Sub-Agent Decision Framework

### **🚨 CRITICAL DECISION**: When to Use AgentTool vs. Sub-Agents

**The Problem**: Many developers incorrectly use sub-agents when AgentTool would be more appropriate, leading to rigid architectures and poor user experience.

### **Decision Framework**

#### **Use AgentTool When:**
- **Parent Processes Results**: Parent agent needs to analyze, modify, or act upon the agent's output
- **Conditional Execution**: Agent should only be called based on specific conditions
- **Repeated Calls**: Agent might be called multiple times in a session
- **Result Integration**: Parent combines multiple agent outputs into final response
- **Flexible Orchestration**: Parent agent needs dynamic control over when/how to use

#### **Use Sub-Agents When:**
- **Direct User Interaction**: User should interact directly with the specialist agent
- **One-Time Routing**: Parent routes once, then specialist takes full control
- **Sequential Processing**: Agent is always part of a predefined workflow
- **Pipeline Steps**: Agent represents a required step in a process
- **Structural Hierarchy**: Agent is a fundamental component of the system

### **Real-World Comparison**

#### **❌ WRONG: Over-using Sub-Agents**
```python
# This creates a rigid, always-executing structure
root_agent = LlmAgent(
    name="research_coordinator",
    sub_agents=[
        plan_generator,        # Always executes
        interactive_planner,   # Always executes
        research_pipeline,     # Always executes
        report_composer,       # Always executes
    ],
    instruction="Coordinate all research steps",
)
```

**Problems with this approach:**
- User has no control over workflow
- All agents execute in sequence regardless of need
- No flexibility for user feedback or iteration
- Poor user experience

#### **✅ CORRECT: Strategic AgentTool Usage**
```python
# From real ADK implementation
interactive_planner_agent = LlmAgent(
    name="interactive_planner_agent",
    tools=[
        AgentTool(plan_generator),  # Called conditionally by user request
    ],
    sub_agents=[
        research_pipeline,          # Always part of approved workflow
    ],
    instruction="""
    1. Use plan_generator tool to create plans when user requests
    2. Allow user to refine plans iteratively
    3. Only delegate to research_pipeline when user approves
    """,
)
```

**Benefits of this approach:**
- User controls when planning happens
- Plan can be refined multiple times
- Research only executes on approval
- Flexible, responsive user experience

### **Advanced AgentTool Patterns**

#### **Conditional Agent Execution**
```python
# Agent that uses other agents conditionally
coordinator = LlmAgent(
    name="smart_coordinator",
    tools=[
        AgentTool(search_specialist),      # Only when search needed
        AgentTool(analysis_specialist),    # Only when analysis needed
        AgentTool(report_specialist),      # Only when reporting needed
    ],
    instruction="""
    Based on user request, determine which specialists to use:
    - For research questions: use search_specialist
    - For data analysis: use analysis_specialist
    - For report generation: use report_specialist
    You may use multiple specialists or none, depending on the request.
    """,
)
```

#### **Multi-Stage Agent Orchestration**
```python
# Agent that orchestrates complex workflows
workflow_manager = LlmAgent(
    name="workflow_manager",
    tools=[
        AgentTool(requirements_gatherer),
        AgentTool(plan_generator),
        AgentTool(approval_handler),
    ],
    sub_agents=[
        execution_pipeline,  # Only after approval
    ],
    instruction="""
    1. Use requirements_gatherer to understand user needs
    2. Use plan_generator to create detailed plans
    3. Use approval_handler to get user confirmation
    4. Only delegate to execution_pipeline after approval
    """,
)
```

### **Anti-Pattern: Agent Tool Overuse**

#### **❌ WRONG: The Middleman Anti-Pattern**
```python
# This creates poor user experience - parent becomes useless middleman
middleman_agent = LlmAgent(
    name="middleman_agent",
    tools=[
        AgentTool(title_specialist),     # Just routes and presents results
        AgentTool(content_specialist),   # No processing of results
    ],
    instruction="Use appropriate specialist and present results to user",
)

# Flow becomes: User → Middleman → Specialist → Middleman → User
# Problems:
# - Middleman disrupts direct user-specialist interaction
# - Poor UX with bouncing between agents
# - Middleman just "presents" work it didn't do
# - User can't build rapport with actual specialist
```

**✅ CORRECT: Direct Routing Pattern**
```python
# Parent routes once, specialist takes full control
router_agent = LlmAgent(
    name="router_agent",
    sub_agents=[
        title_specialist,    # Direct user interaction
        content_specialist,  # Direct user interaction
    ],
    instruction="Route user to appropriate specialist for direct interaction",
)

# Flow becomes: User → Router → Specialist (direct interaction)
```

#### **❌ WRONG: Everything as AgentTool**
```python
# This creates unnecessary complexity
confused_agent = LlmAgent(
    name="confused_agent",
    tools=[
        AgentTool(step1_agent),    # Sequential step - should be sub-agent
        AgentTool(step2_agent),    # Sequential step - should be sub-agent
        AgentTool(step3_agent),    # Sequential step - should be sub-agent
    ],
    instruction="Execute all steps in sequence",
)
```

**Problems:**
- Adds complexity without benefit
- LLM must manage simple sequential flow
- No structural guarantee of execution order
- Harder to debug and maintain

#### **✅ CORRECT: Sequential Pipeline**
```python
# Sequential steps should be sub-agents
pipeline_agent = SequentialAgent(
    name="pipeline_agent",
    sub_agents=[
        step1_agent,
        step2_agent,
        step3_agent,
    ],
)
```

### **Decision Checklist for Future AIs**

When designing agent relationships, ask:

1. **Does the parent agent need to process/act on the results?** → Use AgentTool
2. **Should the user interact directly with the specialist?** → Use Sub-Agent
3. **Is this one-time routing vs. ongoing orchestration?** → Sub-Agent vs. AgentTool
4. **Does the user need control over when this agent executes?** → Use AgentTool
5. **Is this agent always part of the workflow?** → Use Sub-Agent
6. **Might this agent be called multiple times?** → Use AgentTool
7. **Is this a conditional capability?** → Use AgentTool
8. **Is this a required pipeline step?** → Use Sub-Agent

**🚨 CRITICAL CHECK:** Will the parent just "present" results without processing them? If YES → **Use Sub-Agent instead to avoid middleman anti-pattern**

---

## 🔄 Callback-Driven State Management

### **🚨 CRITICAL PATTERN**: Advanced State Management Beyond Session Keys

**The Problem**: Basic session state management becomes unwieldy in complex agents. Professional implementations use sophisticated callback systems for state transformation and management.

### **Callback-Driven vs. Session State Architecture**

#### **❌ BASIC APPROACH: Explicit Session State**
```python
# Naive approach - explicit session state management
search_agent = LlmAgent(
    name="search_agent",
    tools=[google_search],
    instruction="""
    1. Read from session_state.get('search_query')
    2. Perform search and collect results
    3. Save results to session_state['search_results']
    4. Extract sources and save to session_state['sources']
    """,
    output_key="search_results",
)

# Problems:
# - Manual state management in instructions
# - Error-prone key management
# - Limited state transformation capabilities
# - Hard to maintain and debug
```

#### **✅ ADVANCED APPROACH: Callback-Driven State**
```python
# Professional approach - callback-driven state management
def collect_research_sources_callback(callback_context: CallbackContext) -> None:
    """Automatically collect and process research sources from grounding metadata"""
    session = callback_context._invocation_context.session
    url_to_short_id = callback_context.state.get("url_to_short_id", {})
    sources = callback_context.state.get("sources", {})
    id_counter = len(url_to_short_id) + 1
    
    # Process events to extract source information
    for event in session.events:
        if not (event.grounding_metadata and event.grounding_metadata.grounding_chunks):
            continue
        
        # Extract source details from grounding metadata
        for idx, chunk in enumerate(event.grounding_metadata.grounding_chunks):
            if not chunk.web:
                continue
            
            url = chunk.web.uri
            title = chunk.web.title if chunk.web.title != chunk.web.domain else chunk.web.domain
            
            # Create source tracking
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
    
    # Save processed state
    callback_context.state["url_to_short_id"] = url_to_short_id
    callback_context.state["sources"] = sources

# Agent using callback-driven state
search_agent = LlmAgent(
    name="search_agent",
    tools=[google_search],
    instruction="Perform comprehensive search and analysis",
    after_agent_callback=collect_research_sources_callback,
)
```

### **Advanced Callback Patterns**

#### **State Transformation Callbacks**
```python
def transform_research_data_callback(callback_context: CallbackContext) -> None:
    """Transform raw research into structured format"""
    raw_research = callback_context.state.get("raw_research", [])
    
    # Transform data structure
    structured_research = {
        "sections": [],
        "source_count": 0,
        "quality_score": 0,
        "completeness": 0,
    }
    
    for item in raw_research:
        # Complex transformation logic
        structured_section = {
            "title": extract_title(item),
            "content": process_content(item),
            "sources": extract_sources(item),
            "quality_indicators": assess_quality(item),
        }
        structured_research["sections"].append(structured_section)
    
    # Calculate aggregate metrics
    structured_research["source_count"] = count_unique_sources(structured_research)
    structured_research["quality_score"] = calculate_quality_score(structured_research)
    
    callback_context.state["structured_research"] = structured_research

# Agent with transformation callback
research_agent = LlmAgent(
    name="research_agent",
    tools=[google_search],
    instruction="Conduct comprehensive research",
    after_agent_callback=transform_research_data_callback,
)
```

#### **Content Processing Callbacks**
```python
def citation_replacement_callback(callback_context: CallbackContext) -> genai_types.Content:
    """Replace citation tags with markdown links"""
    final_report = callback_context.state.get("final_cited_report", "")
    sources = callback_context.state.get("sources", {})
    
    def tag_replacer(match: re.Match) -> str:
        short_id = match.group(1)
        if not (source_info := sources.get(short_id)):
            logging.warning(f"Invalid citation tag found: {match.group(0)}")
            return ""
        
        display_text = source_info.get("title", source_info.get("domain", short_id))
        return f" [{display_text}]({source_info['url']})"
    
    # Process citation tags
    processed_report = re.sub(
        r'<cite\s+source\s*=\s*["\']?\s*(src-\d+)\s*["\']?\s*/>',
        tag_replacer,
        final_report,
    )
    
    # Clean up spacing
    processed_report = re.sub(r"\s+([.,;:])", r"\1", processed_report)
    
    # Save processed report
    callback_context.state["final_report_with_citations"] = processed_report
    
    # Return processed content
    return genai_types.Content(parts=[genai_types.Part(text=processed_report)])

# Agent with content processing callback
report_agent = LlmAgent(
    name="report_composer",
    tools=[built_in_code_execution],
    instruction="Generate final report with citations",
    after_agent_callback=citation_replacement_callback,
)
```

#### **Multi-Stage Callback Chaining**
```python
def collect_sources_callback(callback_context: CallbackContext) -> None:
    """Stage 1: Collect source information"""
    # Source collection logic
    pass

def process_citations_callback(callback_context: CallbackContext) -> None:
    """Stage 2: Process citations using collected sources"""
    # Citation processing logic
    pass

def format_output_callback(callback_context: CallbackContext) -> genai_types.Content:
    """Stage 3: Format final output"""
    # Output formatting logic
    pass

# Agent with callback chain
advanced_agent = LlmAgent(
    name="advanced_agent",
    tools=[google_search],
    instruction="Perform research with advanced processing",
    after_agent_callback=collect_sources_callback,
    # Note: Multiple callbacks can be chained through sub-agents
)
```

### **Callback Best Practices**

#### **1. Callback Responsibility Separation**
```python
# ✅ GOOD: Single responsibility callbacks
def source_collection_callback(callback_context: CallbackContext) -> None:
    """Only handles source collection"""
    # Source collection logic only

def citation_processing_callback(callback_context: CallbackContext) -> None:
    """Only handles citation processing"""
    # Citation processing logic only

# ❌ BAD: Monolithic callback
def do_everything_callback(callback_context: CallbackContext) -> None:
    """Handles everything - hard to maintain"""
    # Source collection + citation processing + formatting + validation
```

#### **2. Error Handling in Callbacks**
```python
def robust_callback(callback_context: CallbackContext) -> None:
    """Callback with proper error handling"""
    try:
        # Main callback logic
        process_data(callback_context)
    except Exception as e:
        # Log error and set fallback state
        logging.error(f"Callback failed: {e}")
        callback_context.state["callback_error"] = str(e)
        callback_context.state["fallback_mode"] = True
```

#### **3. Callback State Validation**
```python
def validated_callback(callback_context: CallbackContext) -> None:
    """Callback with state validation"""
    # Validate required state exists
    required_keys = ["input_data", "config", "session_info"]
    for key in required_keys:
        if key not in callback_context.state:
            raise ValueError(f"Required state key missing: {key}")
    
    # Validate data types
    if not isinstance(callback_context.state["input_data"], list):
        raise TypeError("input_data must be a list")
    
    # Proceed with processing
    process_validated_data(callback_context)
```

### **When to Use Callback-Driven State Management**

#### **Use Callbacks For:**
- **Complex state transformations** that require processing logic
- **Source tracking and citation systems** in research agents
- **Content formatting and post-processing** of agent outputs
- **Data aggregation and analysis** across multiple agent interactions
- **Error recovery and fallback mechanisms**

#### **Use Session State For:**
- **Simple key-value data passing** between agents
- **User preferences and configuration** data
- **Temporary workflow state** that doesn't need processing
- **Basic communication** between sequential agents

---

## 📊 Structured Data Models for Agent Outputs

### **🚨 CRITICAL PATTERN**: Simple Pydantic Models for Specific Use Cases

**The Problem**: Using generic session state and unstructured outputs leads to errors, inconsistent data formats, and poor debugging experience. However, over-engineering with complex models creates unnecessary complexity.

### **Structured Output Architecture**

#### **❌ BASIC APPROACH: Generic Outputs**
```python
# Naive approach - generic outputs
evaluator_agent = LlmAgent(
    name="evaluator_agent",
    instruction="""
    Evaluate the research and return:
    - grade: pass or fail
    - comment: explanation
    - recommendations: list of improvements
    """,
    output_key="evaluation_result",
)

# Problems:
# - No type safety
# - Inconsistent output formats
# - Hard to validate
# - Poor debugging experience
# - No IDE support
```

#### **✅ PRACTICAL APPROACH: Simple Pydantic Models**
```python
from pydantic import BaseModel, Field
from typing import Literal

# Define simple, focused models
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

# Agent using structured output
evaluator_agent = LlmAgent(
    name="evaluator_agent",
    model="gemini-2.5-pro",
    output_schema=Feedback,  # Enforces structured output
    instruction="""
    Evaluate research quality and provide structured feedback.
    Your response must be a single, raw JSON object matching the Feedback schema.
    """,
    output_key="evaluation_result",
)
```

### **🚨 PYDANTIC ANTI-PATTERNS - AVOID THESE**

#### **❌ Over-Modeling Everything**
```python
# DON'T DO THIS - Over-engineered models
class ComplexResearchTask(BaseModel):
    task_id: str = Field(description="Unique identifier")
    task_type: Literal["RESEARCH", "DELIVERABLE"] = Field(description="Type")
    description: str = Field(description="Task description", min_length=10)
    priority: int = Field(description="Priority", ge=1, le=10)
    status: Literal["pending", "in_progress", "completed", "failed"] = Field(default="pending")
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    estimated_duration: int = Field(ge=1, le=480)
    # ... many more fields with complex validation
```

#### **❌ Complex Nested Hierarchies**
```python
# DON'T DO THIS - Unnecessary complexity
class OverEngineeredReport(BaseModel):
    title: str = Field(description="Report title")
    sections: List[ResearchSection] = Field(min_items=3, max_items=8)
    sources: List[SourceInfo] = Field(min_items=1)
    quality_metrics: Dict[str, QualityMetric] = Field(description="Complex metrics")
    metadata: ReportMetadata = Field(description="Nested metadata")
    # ... complex relationships and validation
```

#### **❌ Session State Models**
```python
# DON'T DO THIS - Models for session state
class SessionStateModel(BaseModel):
    research_findings: List[ResearchFinding]
    evaluation_results: List[EvaluationResult]
    source_tracking: Dict[str, SourceInfo]
    # Session state should use simple dictionaries, not models
```

### **Real-World Usage Examples**

#### **✅ Good: Simple Domain-Specific Models**
```python
# Travel concierge - complex domain entity
class Itinerary(BaseModel):
    """Model for travel itinerary - genuinely complex domain data"""
    destination: str = Field(description="Travel destination")
    start_date: str = Field(description="Trip start date")
    end_date: str = Field(description="Trip end date")
    activities: list[str] = Field(description="Planned activities")

# Customer service - business entity
class Customer(BaseModel):
    """Model for customer data - complex business entity"""
    customer_id: str = Field(description="Unique customer identifier")
    name: str = Field(description="Customer name")
    email: str = Field(description="Customer email")
    phone: str = Field(description="Customer phone number")
    # Only include fields actually needed for the agent's work
```

#### **✅ Good: Critical Workflow Decision Models**
```python
# Quality evaluation - needs validation for loop control
class QualityCheck(BaseModel):
    """Model for quality evaluation - critical workflow decision"""
    grade: Literal["pass", "fail"] = Field(description="Quality grade")
    comment: str = Field(description="Evaluation comment")
    improvement_needed: bool = Field(description="Whether improvement is needed")

# Search refinement - specific output validation
class SearchRefinement(BaseModel):
    """Model for search refinement - specific output validation"""
    search_query: str = Field(description="Refined search query")
    search_focus: str = Field(description="What the search should focus on")
```

#### **✅ Good: Simple Session State Management**
```python
# Use simple dictionaries for session state, not models
def collect_sources_callback(callback_context: CallbackContext) -> None:
    """Simple source collection using dictionaries"""
    sources = callback_context.state.get("sources", {})
    
    # Simple dictionary structure - no complex models needed
    sources["src-1"] = {
        "title": "Article Title",
        "url": "https://example.com",
        "domain": "example.com",
        "supported_claims": []
    }
    
    callback_context.state["sources"] = sources
```

### **Practical Model Guidelines**

#### **1. Simple Field Descriptions**
```python
class SimpleModel(BaseModel):
    """Keep it simple and focused"""
    
    primary_field: str = Field(description="Clear, simple description")
    status: Literal["active", "inactive"] = Field(description="Status indicator")
    
    # Avoid complex validation unless absolutely necessary
    # Most agents don't need extensive field constraints
```

#### **2. Focus on Agent Needs**
```python
# Only model what the agent actually needs to validate
class AgentOutput(BaseModel):
    """Model only what needs validation"""
    
    # If the agent needs to make decisions based on this field, model it
    decision: Literal["approve", "reject"] = Field(description="Agent decision")
    
    # If it's just passing data through, use simple types
    details: str = Field(description="Additional details")
    
    # Don't model everything - keep it minimal
```

### **When to Use Structured Outputs**

#### **✅ Use Pydantic Models For:**
- **Critical workflow decisions** (like pass/fail evaluations that control loops)
- **Complex domain entities** (like customer data, itineraries, user profiles)
- **Structured agent outputs** that need validation for correctness
- **API integration** where specific formats are required

#### **❌ Don't Use Pydantic Models For:**
- **Session state data** (use simple dictionaries)
- **Callback processing** (use plain Python types)
- **Simple string outputs** (just use strings)
- **Data that just passes through** agents without validation needs
- **Everything** (most data doesn't need complex modeling)

#### **Real-World Decision Examples:**
```python
# ✅ Good: Critical workflow decision
class EvaluationResult(BaseModel):
    grade: Literal["pass", "fail"] = Field(description="Quality grade")
    comment: str = Field(description="Evaluation feedback")
    # This controls loop behavior - needs validation

# ❌ Bad: Simple data passing
class SessionData(BaseModel):
    research_findings: str = Field(description="Research results")
    source_count: int = Field(description="Number of sources")
    # Just use dict: {"research_findings": "...", "source_count": 5}

# ✅ Good: Complex domain entity
class CustomerProfile(BaseModel):
    customer_id: str = Field(description="Unique identifier")
    preferences: dict = Field(description="Customer preferences")
    # Genuinely complex business entity

# ❌ Bad: Over-modeling simple data
class SimpleResponse(BaseModel):
    message: str = Field(description="Response message")
    # Just use string: "Your response message"
```

---

## 🏗️ Integration vs. Separation Architecture

### **🚨 CRITICAL DECISION**: When to Integrate vs. Separate Agent Functionality

**The Problem**: Developers often create too many agents, thinking "more agents = better architecture." Professional implementations strategically integrate related functionality while maintaining clear separation of concerns.

### **Integration vs. Separation Framework**

#### **Integration Indicators (Combine into Single Agent)**
- **Tight coupling**: Functions always work together
- **Shared context**: Both functions need same information
- **User workflow**: User sees as single interaction
- **State dependency**: One function depends on other's state
- **Performance**: Frequent communication between functions

#### **Separation Indicators (Split into Multiple Agents)**
- **Independent execution**: Functions can run separately
- **Different tools**: Functions need different built-in tools
- **Specialized models**: Functions need different model capabilities
- **Parallel processing**: Functions can run concurrently
- **Clear boundaries**: Functions have distinct responsibilities

### **Real-World Architecture Comparison**

#### **❌ WRONG: Over-Separation**
```python
# Anti-pattern: Too many agents for tightly coupled functionality
root_agent = LlmAgent(
    name="over_separated_coordinator",
    sub_agents=[
        plan_generator,        # Generates plans
        plan_presenter,        # Presents plans to user
        plan_validator,        # Validates plan format
        approval_handler,      # Handles user approval
        approval_validator,    # Validates approval
        execution_coordinator, # Coordinates execution
        execution_validator,   # Validates execution
        report_generator,      # Generates reports
        report_formatter,      # Formats reports
        report_presenter,      # Presents reports
    ],
    instruction="Coordinate 10 agents for simple workflow",
)

# Problems:
# - Excessive complexity for simple workflow
# - Poor user experience (too many handoffs)
# - Hard to maintain and debug
# - Unnecessary state management overhead
```

#### **✅ CORRECT: Strategic Integration**
```python
# From real ADK implementation - strategic integration
interactive_planner_agent = LlmAgent(
    name="interactive_planner_agent",
    model="gemini-2.5-flash",
    tools=[
        AgentTool(plan_generator),  # Plan generation as tool - PROCESSES results
    ],
    sub_agents=[
        research_pipeline,          # Separate complex workflow
    ],
    instruction="""
    You are a research planning assistant that integrates multiple related functions:
    
    1. PLAN GENERATION: Use plan_generator tool to create research plans
    2. PLAN PRESENTATION: Present plans clearly to users
    3. PLAN REFINEMENT: Handle user feedback and iterate
    4. APPROVAL HANDLING: Manage user approval process
    5. EXECUTION COORDINATION: Delegate to research_pipeline when approved
    
    This integration provides smooth user experience while maintaining clear separation
    from the complex research execution pipeline.
    """,
)

# Benefits:
# - Smooth user experience
# - Clear separation of concerns
# - Easy to maintain and debug
# - Efficient state management
```

#### **✅ CORRECT: Direct Routing Pattern**
```python
# Good: Router pattern for direct specialist interaction
content_master = LlmAgent(
    name="content_master",
    sub_agents=[
        complete_workflow,          # For "I have a new project idea"
        title_specialist,           # For "help with my title"
        email_specialist,           # For "help with my email"
        social_specialist,          # For "help with social posts"
    ],
    instruction="""
    Route users to appropriate workflow or specialist:
    
    - New project ideas → complete_workflow (sequential process)
    - Specific help requests → route to appropriate specialist
    
    Once routed, let the specialist handle the complete interaction.
    """,
)

# Benefits:
# - Clean routing without middleman interference
# - Users get direct specialist interaction
# - No disruption of user experience
# - Specialists maintain full control
```

### **Integration Patterns**

#### **Functional Integration Pattern**
```python
# Integrate related functions that serve same user goal
user_interaction_agent = LlmAgent(
    name="user_interaction_agent",
    tools=[
        AgentTool(requirements_gatherer),
        AgentTool(plan_generator),
        AgentTool(feedback_processor),
    ],
    instruction="""
    You handle all user-facing interactions for research planning:
    
    1. REQUIREMENTS GATHERING: Use requirements_gatherer for unclear requests
    2. PLAN GENERATION: Use plan_generator to create detailed plans
    3. FEEDBACK PROCESSING: Use feedback_processor for user input
    4. ITERATION MANAGEMENT: Continue until user approves
    
    Provide cohesive user experience across all planning interactions.
    """,
)
```

#### **Workflow Integration Pattern**
```python
# Integrate sequential steps that don't need user intervention
processing_agent = LlmAgent(
    name="processing_agent",
    tools=[
        FunctionTool(func=validate_input),
        FunctionTool(func=transform_data),
        FunctionTool(func=enrich_data),
        FunctionTool(func=format_output),
    ],
    instruction="""
    You handle the complete data processing pipeline:
    
    1. VALIDATION: Validate input data format and content
    2. TRANSFORMATION: Transform data to required format
    3. ENRICHMENT: Add additional context and metadata
    4. FORMATTING: Format for next stage consumption
    
    Execute all steps as integrated workflow without user intervention.
    """,
)
```

#### **Context Integration Pattern**
```python
# Integrate functions that share complex context
domain_expert_agent = LlmAgent(
    name="domain_expert_agent",
    tools=[
        google_search,
        FunctionTool(func=analyze_domain_trends),
        FunctionTool(func=assess_market_conditions),
        FunctionTool(func=generate_recommendations),
    ],
    instruction="""
    You are a domain expert that integrates multiple analytical functions:
    
    1. RESEARCH: Use google_search for current information
    2. TREND ANALYSIS: Analyze domain trends using research data
    3. MARKET ASSESSMENT: Assess market conditions with trend context
    4. RECOMMENDATIONS: Generate recommendations based on all analyses
    
    Your domain expertise allows you to integrate these functions seamlessly.
    """,
)
```

### **Separation Patterns**

#### **Tool-Based Separation**
```python
# Separate agents based on tool requirements
search_specialist = LlmAgent(
    name="search_specialist",
    tools=[google_search],  # Built-in tool
    instruction="Perform comprehensive web research",
)

analysis_specialist = LlmAgent(
    name="analysis_specialist",
    tools=[built_in_code_execution],  # Different built-in tool
    instruction="Analyze data and create visualizations",
)

processing_specialist = LlmAgent(
    name="processing_specialist",
    tools=[
        FunctionTool(func=process_data),
        FunctionTool(func=validate_results),
        FunctionTool(func=format_output),
    ],
    instruction="Process and validate data",
)

# Coordinator that uses specialized agents
coordinator = LlmAgent(
    name="coordinator",
    tools=[
        AgentTool(search_specialist),
        AgentTool(analysis_specialist),
        AgentTool(processing_specialist),
    ],
    instruction="Coordinate specialized agents based on task needs",
)
```

#### **Complexity-Based Separation**
```python
# Separate simple coordination from complex processing
simple_coordinator = LlmAgent(
    name="simple_coordinator",
    tools=[
        AgentTool(requirements_agent),
        AgentTool(validation_agent),
    ],
    sub_agents=[
        complex_processing_pipeline,  # Complex workflow separated
    ],
    instruction="Handle simple coordination and delegate complex processing",
)

complex_processing_pipeline = SequentialAgent(
    name="complex_processing_pipeline",
    sub_agents=[
        data_ingestion_agent,
        transformation_agent,
        analysis_agent,
        validation_agent,
        output_agent,
    ],
)
```

#### **Model-Based Separation**
```python
# Separate agents based on model requirements
creative_agent = LlmAgent(
    name="creative_agent",
    model="gemini-2.5-flash",  # Fast model for creative tasks
    tools=[google_search],
    instruction="Generate creative content and ideas",
)

analytical_agent = LlmAgent(
    name="analytical_agent",
    model="gemini-2.5-pro",  # Powerful model for analysis
    tools=[built_in_code_execution],
    instruction="Perform complex analysis and reasoning",
)

coordinator = LlmAgent(
    name="coordinator",
    model="gemini-2.5-flash",  # Fast model for coordination
    tools=[
        AgentTool(creative_agent),
        AgentTool(analytical_agent),
    ],
    instruction="Route tasks to appropriate specialized agents",
)
```

### **Architecture Decision Framework**

#### **Integration Checklist**
Ask these questions to determine if functions should be integrated:

1. **User Experience**: Does the user see these as one interaction?
2. **State Sharing**: Do these functions share complex state?
3. **Execution Flow**: Are these always executed together?
4. **Context Dependency**: Do both functions need the same context?
5. **Performance**: Would separation add unnecessary overhead?

If YES to 3+ questions → **INTEGRATE**

#### **Separation Checklist**
Ask these questions to determine if functions should be separated:

1. **Tool Requirements**: Do functions need different built-in tools?
2. **Model Requirements**: Do functions need different model capabilities?
3. **Independent Execution**: Can functions run independently?
4. **Parallel Processing**: Could functions run concurrently?
5. **Distinct Expertise**: Do functions represent different specializations?

If YES to 2+ questions → **SEPARATE**

### **Common Integration Anti-Patterns**

#### **❌ The Micro-Agent Anti-Pattern**
```python
# Wrong: Creating agents for trivial functions
greeting_agent = LlmAgent(name="greeting_agent", instruction="Say hello")
question_agent = LlmAgent(name="question_agent", instruction="Ask questions")
goodbye_agent = LlmAgent(name="goodbye_agent", instruction="Say goodbye")

# Correct: Integrate trivial functions
conversation_agent = LlmAgent(
    name="conversation_agent",
    instruction="Handle greetings, questions, and goodbyes naturally",
)
```

#### **❌ The God Agent Anti-Pattern**
```python
# Wrong: Single agent doing everything
everything_agent = LlmAgent(
    name="everything_agent",
    tools=[
        google_search,
        built_in_code_execution,  # Can't use multiple built-in tools
        FunctionTool(func=process_data),
        FunctionTool(func=send_email),
        FunctionTool(func=generate_report),
    ],
    instruction="Do everything for everyone",
)

# Correct: Separate by tool requirements and complexity
coordinator = LlmAgent(
    name="coordinator",
    tools=[
        AgentTool(search_agent),      # google_search
        AgentTool(analysis_agent),    # built_in_code_execution
        AgentTool(processing_agent),  # function tools
    ],
    instruction="Coordinate specialized agents",
)
```

### **Best Practices for Integration Decisions**

#### **1. Start Simple, Refactor When Needed**
```python
# Start with integrated approach
initial_agent = LlmAgent(
    name="initial_agent",
    tools=[google_search],
    instruction="Handle search and basic analysis",
)

# Refactor when complexity grows
search_agent = LlmAgent(
    name="search_agent",
    tools=[google_search],
    instruction="Specialized search capabilities",
)

analysis_agent = LlmAgent(
    name="analysis_agent",
    tools=[built_in_code_execution],
    instruction="Advanced analysis capabilities",
)

coordinator = LlmAgent(
    name="coordinator",
    tools=[
        AgentTool(search_agent),
        AgentTool(analysis_agent),
    ],
    instruction="Route to appropriate specialists",
)
```

#### **2. Consider User Mental Model**
```python
# User thinks: "I want to research and create a report"
# Good: Single agent that handles both
research_reporter = LlmAgent(
    name="research_reporter",
    tools=[
        google_search,
        AgentTool(report_generator),
    ],
    instruction="Research topics and generate reports",
)

# User thinks: "I want to analyze data, then create charts, then send results"
# Good: Separate pipeline stages
analysis_pipeline = SequentialAgent(
    name="analysis_pipeline",
    sub_agents=[
        data_analyzer,
        chart_generator,
        results_distributor,
    ],
)
```

---

## 📝 Advanced Instruction Engineering

### **🚨 CRITICAL PATTERN**: Sophisticated Instruction Design for Professional Agents

**The Problem**: Generic, simple instructions lead to inconsistent agent behavior and poor user experience. Professional ADK implementations use sophisticated, rule-based instructions with explicit constraints and dynamic context.

### **Instruction Engineering Architecture**

#### **❌ BASIC APPROACH: Generic Instructions**
```python
# Naive approach - generic instructions
research_agent = LlmAgent(
    name="research_agent",
    instruction="Research the topic and provide analysis",
    tools=[google_search],
)

# Problems:
# - Vague and ambiguous
# - No constraints or rules
# - Inconsistent behavior
# - Poor error handling
# - No context awareness
```

#### **✅ ADVANCED APPROACH: Rule-Based Instructions**
```python
# Professional approach - sophisticated instructions
research_evaluator = LlmAgent(
    name="research_evaluator",
    model="gemini-2.5-pro",
    instruction=f"""
    You are a meticulous quality assurance analyst evaluating research findings.

    **CRITICAL RULES:**
    1. Assume the given research topic is correct. Do not question or verify the subject itself.
    2. Your ONLY job is to assess the quality, depth, and completeness of research provided *for that topic*.
    3. Focus on evaluating: Comprehensiveness, logical flow, credible sources, depth of analysis, clarity.
    4. Do NOT fact-check or question the fundamental premise or timeline of the topic.
    5. If suggesting follow-up queries, dive deeper into existing topic, not question its validity.

    **EVALUATION CRITERIA:**
    - Grade "fail" if significant gaps in depth or coverage exist
    - Grade "pass" if research thoroughly covers the topic
    - Provide detailed comments about what's missing or well-done
    - Generate 5-7 specific follow-up search queries for "fail" grades

    **CONTEXT:**
    Current date: {datetime.datetime.now().strftime("%Y-%m-%d")}
    
    **OUTPUT FORMAT:**
    Your response must be a single, raw JSON object validating against the 'Feedback' schema.
    """,
    output_schema=Feedback,
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
)
```

### **Advanced Instruction Patterns**

#### **Rule-Based Instruction Framework**
```python
# Template for rule-based instructions
def create_rule_based_instruction(
    role: str,
    primary_rules: List[str],
    evaluation_criteria: List[str],
    context_vars: Dict[str, Any],
    output_format: str,
    constraints: List[str] = None,
) -> str:
    """Generate sophisticated rule-based instructions"""
    
    constraints_section = ""
    if constraints:
        constraints_section = f"""
    **CONSTRAINTS:**
    {chr(10).join(f"    - {constraint}" for constraint in constraints)}
        """
    
    return f"""
    You are a {role}.

    **CRITICAL RULES:**
    {chr(10).join(f"    {i+1}. {rule}" for i, rule in enumerate(primary_rules))}

    **EVALUATION CRITERIA:**
    {chr(10).join(f"    - {criterion}" for criterion in evaluation_criteria)}
    {constraints_section}
    **CONTEXT:**
    {chr(10).join(f"    {key}: {value}" for key, value in context_vars.items())}
    
    **OUTPUT FORMAT:**
    {output_format}
    """

# Usage example
research_instruction = create_rule_based_instruction(
    role="comprehensive research specialist",
    primary_rules=[
        "Execute every research goal with absolute fidelity",
        "Generate 4-5 targeted search queries per research goal",
        "Synthesize search results into detailed, coherent summaries",
        "Store summaries for exclusive use in synthesis phase",
    ],
    evaluation_criteria=[
        "Comprehensiveness of search coverage",
        "Quality and relevance of sources",
        "Depth of analysis and synthesis",
        "Clarity and organization of output",
    ],
    context_vars={
        "current_date": datetime.now().strftime("%Y-%m-%d"),
        "max_queries_per_goal": 5,
        "min_sources_per_section": 3,
    },
    output_format="Detailed research findings organized by goal with source attribution",
    constraints=[
        "Do not perform new searches during synthesis phase",
        "Maintain clear separation between research and deliverable tasks",
        "Ensure all outputs are properly sourced and attributed",
    ],
)
```

#### **Context-Aware Instructions**
```python
# Dynamic instruction generation based on context
def generate_context_aware_instruction(
    user_expertise: str,
    task_complexity: str,
    available_tools: List[str],
    time_constraints: str,
) -> str:
    """Generate instructions adapted to context"""
    
    expertise_guidance = {
        "beginner": "Provide detailed explanations and step-by-step guidance",
        "intermediate": "Focus on key insights and important considerations",
        "expert": "Provide concise, high-level analysis and recommendations",
    }
    
    complexity_approach = {
        "simple": "Use straightforward analysis and clear conclusions",
        "moderate": "Provide balanced analysis with multiple perspectives",
        "complex": "Conduct comprehensive analysis with nuanced conclusions",
    }
    
    tool_instructions = {
        "google_search": "Use web search for current information and diverse sources",
        "built_in_code_execution": "Use code execution for analysis and visualization",
        "function_tools": "Use available function tools for specialized processing",
    }
    
    return f"""
    You are an adaptive research assistant tailored to user needs.

    **USER CONTEXT:**
    - Expertise Level: {user_expertise}
    - Task Complexity: {task_complexity}
    - Time Constraints: {time_constraints}

    **APPROACH GUIDANCE:**
    {expertise_guidance.get(user_expertise, expertise_guidance["intermediate"])}
    
    **COMPLEXITY HANDLING:**
    {complexity_approach.get(task_complexity, complexity_approach["moderate"])}
    
    **TOOL USAGE:**
    {chr(10).join(f"    - {tool_instructions[tool]}" for tool in available_tools if tool in tool_instructions)}
    
    **CRITICAL ADAPTATIONS:**
    - Adjust explanation depth based on user expertise
    - Scale analysis scope based on complexity requirements
    - Prioritize efficiency given time constraints
    - Use appropriate tools for optimal results
    """

# Agent with context-aware instructions
adaptive_agent = LlmAgent(
    name="adaptive_agent",
    tools=[google_search, built_in_code_execution],
    instruction=generate_context_aware_instruction(
        user_expertise="intermediate",
        task_complexity="moderate",
        available_tools=["google_search", "built_in_code_execution"],
        time_constraints="moderate",
    ),
)
```

#### **Phase-Based Instructions**
```python
# Instructions that guide multi-phase execution
multi_phase_instruction = """
You are a comprehensive research and synthesis agent with strict phase-based execution.

**EXECUTION PHASES:**

---
**Phase 1: Information Gathering (`[RESEARCH]` Tasks)**

**EXECUTION DIRECTIVE:** You MUST systematically process every goal prefixed with `[RESEARCH]` before proceeding to Phase 2.

For each `[RESEARCH]` goal:
1. **Query Generation:** Formulate 4-5 targeted search queries covering the goal from multiple angles
2. **Execution:** Execute ALL generated queries using the `google_search` tool
3. **Summarization:** Synthesize results into detailed, coherent summary addressing the goal objective
4. **Internal Storage:** Store summary clearly tagged by corresponding `[RESEARCH]` goal

**PHASE 1 COMPLETION CRITERIA:**
- All `[RESEARCH]` goals processed
- All summaries stored and tagged
- No information loss or discarding

---
**Phase 2: Synthesis and Output Creation (`[DELIVERABLE]` Tasks)**

**EXECUTION PREREQUISITE:** This phase MUST ONLY COMMENCE once ALL `[RESEARCH]` goals are completed.

**EXECUTION DIRECTIVE:** Systematically process every goal prefixed with `[DELIVERABLE]`.

For each `[DELIVERABLE]` goal:
1. **Instruction Interpretation:** Treat goal text as direct, non-negotiable instruction
2. **Data Consolidation:** Use ONLY Phase 1 summaries (no new searches)
3. **Output Generation:** Create specified artifact (table, summary, report, etc.)
4. **Output Accumulation:** Maintain all generated artifacts

**PHASE 2 COMPLETION CRITERIA:**
- All `[DELIVERABLE]` goals processed
- All artifacts generated and accumulated
- No new searches performed

---
**FINAL OUTPUT:** Complete set of Phase 1 summaries AND Phase 2 artifacts, presented clearly and distinctly.

**CRITICAL RULES:**
- Maintain strict phase separation
- No phase skipping or mixing
- Complete each phase before proceeding
- Preserve all generated content
"""

# Agent using phase-based instructions
phase_based_agent = LlmAgent(
    name="phase_based_agent",
    tools=[google_search],
    instruction=multi_phase_instruction,
)
```

#### **Constraint-Driven Instructions**
```python
# Instructions with explicit constraints and boundaries
constrained_instruction = f"""
You are a research planning assistant with strict operational constraints.

**PRIMARY FUNCTION:** Convert ANY user request into a research plan.

**CRITICAL CONSTRAINTS:**
1. **NEVER answer questions directly** - always create research plan first
2. **NEVER refuse requests** - find a way to create appropriate research plan
3. **TOOL USE STRICTLY LIMITED** - only use google_search for topic clarification
4. **NO CONTENT RESEARCH** - do not investigate topic themes or content
5. **SEARCH ONLY FOR IDENTIFICATION** - search only if topic is ambiguous

**WORKFLOW CONSTRAINTS:**
1. **Plan Generation:** Use plan_generator tool to create draft plan
2. **Plan Refinement:** Incorporate user feedback iteratively
3. **Approval Required:** Wait for EXPLICIT approval before execution
4. **Execution Delegation:** Delegate to research_pipeline after approval

**BEHAVIORAL CONSTRAINTS:**
- Do not perform research yourself
- Do not provide direct answers
- Do not bypass planning phase
- Do not execute without approval

**CONTEXT CONSTRAINTS:**
- Current date: {datetime.datetime.now().strftime("%Y-%m-%d")}
- Maximum planning iterations: 5
- Required approval phrases: "looks good", "run it", "proceed", "approved"

**OUTPUT CONSTRAINTS:**
- Always start with plan generation
- Present plans clearly and completely
- Ask for explicit approval
- Confirm understanding before delegation
"""

# Agent with constraint-driven instructions
constrained_agent = LlmAgent(
    name="constrained_agent",
    tools=[AgentTool(plan_generator)],
    instruction=constrained_instruction,
)
```

### **Dynamic Instruction Generation**

#### **Template-Based Instructions**
```python
# Template system for consistent instruction generation
class InstructionTemplate:
    """Template for generating consistent agent instructions"""
    
    def __init__(self, role: str, domain: str):
        self.role = role
        self.domain = domain
    
    def generate_instruction(
        self,
        primary_goals: List[str],
        rules: List[str],
        constraints: List[str],
        context: Dict[str, Any],
        output_format: str,
    ) -> str:
        """Generate instruction from template"""
        
        return f"""
        You are a {self.role} specializing in {self.domain}.

        **PRIMARY GOALS:**
        {chr(10).join(f"        {i+1}. {goal}" for i, goal in enumerate(primary_goals))}

        **OPERATIONAL RULES:**
        {chr(10).join(f"        - {rule}" for rule in rules)}

        **CONSTRAINTS:**
        {chr(10).join(f"        - {constraint}" for constraint in constraints)}

        **CONTEXT:**
        {chr(10).join(f"        {key}: {value}" for key, value in context.items())}

        **OUTPUT FORMAT:**
        {output_format}

        **QUALITY STANDARDS:**
        - Maintain consistency with role and domain expertise
        - Follow all operational rules without exception
        - Respect all constraints and limitations
        - Utilize context information appropriately
        - Produce output in specified format
        """

# Usage examples
research_template = InstructionTemplate(
    role="research specialist",
    domain="comprehensive information analysis"
)

research_instruction = research_template.generate_instruction(
    primary_goals=[
        "Conduct comprehensive research on assigned topics",
        "Synthesize findings into coherent analysis",
        "Provide source attribution and quality assessment",
    ],
    rules=[
        "Execute systematic search strategies",
        "Evaluate source credibility and relevance",
        "Maintain objectivity and balanced perspective",
    ],
    constraints=[
        "Use only approved search tools",
        "Limit search queries to 5 per topic",
        "Complete research before synthesis",
    ],
    context={
        "current_date": datetime.now().strftime("%Y-%m-%d"),
        "quality_threshold": "minimum 3 sources per topic",
        "time_limit": "30 minutes per research goal",
    },
    output_format="Structured research findings with source attribution",
)
```

#### **Conditional Instruction Logic**
```python
# Instructions that adapt based on runtime conditions
def create_conditional_instruction(
    base_role: str,
    conditions: Dict[str, Any],
    conditional_rules: Dict[str, List[str]],
) -> str:
    """Create instruction that adapts to runtime conditions"""
    
    active_rules = []
    
    # Evaluate conditions and apply appropriate rules
    for condition, rule_set in conditional_rules.items():
        if eval_condition(condition, conditions):
            active_rules.extend(rule_set)
    
    return f"""
    You are a {base_role} with adaptive behavior based on runtime conditions.

    **RUNTIME CONDITIONS:**
    {chr(10).join(f"    {key}: {value}" for key, value in conditions.items())}

    **ACTIVE RULES:**
    {chr(10).join(f"    - {rule}" for rule in active_rules)}

    **ADAPTIVE BEHAVIOR:**
    Your behavior automatically adjusts based on the active rules derived from current conditions.
    Always check conditions before taking action and follow applicable rules.
    """

def eval_condition(condition: str, context: Dict[str, Any]) -> bool:
    """Evaluate condition against context"""
    # Simple condition evaluation logic
    if condition == "high_complexity":
        return context.get("complexity_level", 0) > 7
    elif condition == "time_constrained":
        return context.get("time_available", 60) < 30
    elif condition == "expert_user":
        return context.get("user_expertise", "beginner") == "expert"
    return False

# Agent with conditional instructions
conditional_agent = LlmAgent(
    name="conditional_agent",
    instruction=create_conditional_instruction(
        base_role="adaptive research assistant",
        conditions={
            "complexity_level": 8,
            "time_available": 20,
            "user_expertise": "expert",
        },
        conditional_rules={
            "high_complexity": [
                "Use advanced analysis techniques",
                "Provide comprehensive coverage",
                "Include multiple perspectives",
            ],
            "time_constrained": [
                "Prioritize most critical information",
                "Focus on high-impact findings",
                "Streamline output format",
            ],
            "expert_user": [
                "Use technical terminology",
                "Provide concise explanations",
                "Focus on insights and implications",
            ],
        },
    ),
)
```

### **Instruction Quality Patterns**

#### **Explicit Behavior Specification**
```python
# Instructions with explicit behavior specifications
explicit_instruction = """
You are a research evaluator with precisely defined behavior.

**EXPLICIT BEHAVIORS:**

**WHEN evaluating research:**
- Read all provided research findings completely
- Assess coverage of planned research sections
- Count high-quality sources (domain authority, recency, relevance)
- Identify specific gaps in coverage or depth
- Generate targeted follow-up queries for gaps

**WHEN research is insufficient:**
- Assign grade "fail"
- Write detailed comment explaining deficiencies
- Generate 5-7 specific follow-up search queries
- Focus on filling identified gaps, not questioning premise

**WHEN research is sufficient:**
- Assign grade "pass"
- Write positive comment highlighting strengths
- Set follow_up_queries to null or empty list
- Confirm comprehensive coverage achieved

**NEVER do these things:**
- Question the fundamental premise of research topic
- Fact-check or verify the subject matter itself
- Suggest changing research direction or scope
- Provide vague or generic feedback

**ALWAYS do these things:**
- Assume research topic is correct and valid
- Focus solely on quality, depth, and completeness
- Provide specific, actionable feedback
- Generate targeted improvement suggestions
"""

# Agent with explicit behavior specification
explicit_agent = LlmAgent(
    name="explicit_agent",
    instruction=explicit_instruction,
    output_schema=Feedback,
)
```

#### **Error Prevention Instructions**
```python
# Instructions designed to prevent common errors
error_prevention_instruction = """
You are a research coordinator with error prevention protocols.

**ERROR PREVENTION PROTOCOLS:**

**To prevent incomplete research:**
- Verify all research goals are processed before proceeding
- Check that each goal has multiple search queries executed
- Ensure all findings are properly summarized and stored
- Confirm no research goals are skipped or forgotten

**To prevent format errors:**
- Validate all outputs against required schema
- Check that all required fields are populated
- Ensure data types match specifications
- Verify constraints and validation rules are met

**To prevent workflow errors:**
- Confirm user approval before executing research
- Verify research plan is complete before approval
- Check that all dependencies are satisfied
- Ensure proper sequence of operations

**To prevent quality issues:**
- Validate source credibility and relevance
- Check for sufficient depth and coverage
- Ensure balanced perspective and objectivity
- Verify all claims are properly sourced

**ERROR RECOVERY PROCEDURES:**
- If error detected, stop current process
- Identify root cause of error
- Implement corrective action
- Resume process from stable state
- Document error for future prevention
"""

# Agent with error prevention focus
error_prevention_agent = LlmAgent(
    name="error_prevention_agent",
    instruction=error_prevention_instruction,
)
```

### **Best Practices for Instruction Engineering**

#### **1. Layered Instruction Architecture**
```python
# Base layer: Role and context
# Rule layer: Operational constraints
# Procedure layer: Step-by-step guidance
# Quality layer: Standards and validation

layered_instruction = """
**ROLE LAYER:**
You are a professional research analyst with domain expertise.

**RULE LAYER:**
- Always validate inputs before processing
- Follow systematic methodology
- Maintain objectivity and balance
- Document all sources and reasoning

**PROCEDURE LAYER:**
1. Analyze research requirements
2. Generate comprehensive search strategy
3. Execute searches systematically
4. Synthesize findings coherently
5. Validate results and conclusions

**QUALITY LAYER:**
- Minimum 5 high-quality sources per topic
- Balanced perspective with multiple viewpoints
- Clear attribution and source documentation
- Logical flow and coherent conclusions
"""
```

#### **2. Validation and Testing Instructions**
```python
# Instructions that include self-validation
self_validating_instruction = """
You are a research agent with built-in quality validation.

**CORE FUNCTIONALITY:**
[Primary instruction content here]

**SELF-VALIDATION CHECKLIST:**
Before completing any task, verify:
- [ ] All requirements have been addressed
- [ ] Output format matches specifications
- [ ] Sources are credible and relevant
- [ ] Analysis is comprehensive and balanced
- [ ] Conclusions are supported by evidence

**QUALITY GATES:**
- Gate 1: Input validation and requirement analysis
- Gate 2: Process execution and monitoring
- Gate 3: Output validation and quality check
- Gate 4: Final review and completion confirmation

**FAILURE HANDLING:**
If any validation fails:
1. Identify specific failure point
2. Determine corrective action needed
3. Implement correction
4. Re-validate from failure point
5. Continue only when validation passes
"""
```

---

## 📚 Common ADK Agent Best Practices Cheat Sheet

### **Advanced Decision Framework for Future AIs**

When designing ADK agents, use this comprehensive framework:

#### **1. Agent-as-Tool vs. Sub-Agent Decision Matrix**
```
                    | Use AgentTool | Use Sub-Agent
--------------------|---------------|---------------
Parent Processes Results | Yes      | No
Direct User Interaction  | No       | Yes  
One-time Routing        | No        | Yes
Ongoing Orchestration   | Yes       | No
User Control       | High          | Low
Conditional Use     | Yes           | No
Repeated Calls      | Yes           | No
Pipeline Step       | No            | Yes
Always Executes     | No            | Yes
```

#### **2. Callback vs. Session State Decision Matrix**
```
                    | Use Callbacks | Use Session State
--------------------|---------------|-------------------
State Transformation| Yes           | No
Complex Processing  | Yes           | No
Simple Key-Value    | No            | Yes
Source Tracking     | Yes           | No
Citation Processing | Yes           | No
```

#### **3. Structured vs. Generic Output Decision Matrix**
```
                    | Use Pydantic  | Use Generic
--------------------|---------------|---------------
Critical Decisions  | Yes           | No
Complex Entities    | Yes           | No
Simple Data Passing | No            | Yes
Session State       | No            | Yes
Callback Processing | No            | Yes
```

#### **4. Integration vs. Separation Decision Matrix**
```
                    | Integrate     | Separate
--------------------|---------------|---------------
Tight Coupling      | Yes           | No
Shared Context      | Yes           | No
Different Tools     | No            | Yes
Independent Exec    | No            | Yes
User Sees As One    | Yes           | No
```

#### **5. Instruction Complexity Decision Matrix**
```
                    | Rule-Based    | Generic
--------------------|---------------|---------------
Critical Behavior   | Yes           | No
Consistent Output   | Yes           | No
Error Prevention    | Yes           | No
Simple Tasks        | No            | Yes
Experimental        | No            | Yes
```

### **Anti-Pattern Alert System**

#### **🚨 RED FLAGS - Stop and Reconsider**
- **Multiple built-in tools** in same agent
- **More than 5 agents** for simple workflow
- **Generic instructions** for complex behavior
- **Over-modeling with Pydantic** for simple data
- **Complex nested model hierarchies**
- **Pydantic models for session state**
- **Over-separation** of tightly coupled functions
- **AgentTool middleman pattern** - parent just presents results without processing

#### **⚠️ YELLOW FLAGS - Review Design**
- **Deep agent hierarchies** (>3 levels)
- **Complex session state** management
- **No callbacks** for complex transformations
- **Extensive field validation** in Pydantic models
- **Models for data that just passes through**
- **Generic error handling**
- **Monolithic instructions**

#### **✅ GREEN FLAGS - Good Design**
- **Strategic agent-tool usage** - parent processes results, not just presents them
- **Direct routing patterns** - specialists interact directly with users
- **Callback-driven state management**
- **Simple dictionaries** for session state
- **Minimal Pydantic models** for critical decisions only
- **Rule-based instructions**
- **Integrated related functionality**

### **Implementation Quality Checklist**

#### **Before Implementation:**
- [ ] Chosen appropriate agent composition patterns
- [ ] Validated tool distribution follows ADK rules
- [ ] Identified only critical data that needs Pydantic models
- [ ] Created rule-based instructions for complex behavior
- [ ] Planned callback system for state management

#### **During Implementation:**
- [ ] Using AgentTool for conditional agent execution
- [ ] Implementing callbacks for complex state transformations
- [ ] Using simple dictionaries for session state
- [ ] Creating minimal Pydantic models only when needed
- [ ] Writing detailed, constraint-based instructions
- [ ] Integrating related functionality appropriately

#### **After Implementation:**
- [ ] Validated against anti-pattern warnings
- [ ] Avoided over-modeling with Pydantic
- [ ] Tested instruction effectiveness
- [ ] Verified session state simplicity
- [ ] Confirmed callback system reliability
- [ ] Reviewed architecture for optimization opportunities

This comprehensive framework ensures future AIs can design professional-quality ADK agents that avoid common pitfalls and implement sophisticated patterns correctly.

---

## 📋 Implementation Checklist Template

### **🔧 Agent Implementation Order**

After completing the workflow design, provide a systematic implementation checklist that follows the **execution flow** of the workflow. This checklist helps downstream AI agents build out each component systematically.

#### **Implementation Checklist Format:**
```markdown
## 🔧 Implementation Checklist

### **Build Order: Follow Execution Flow**

- [ ] **Build `agent_name`** (AgentType)
  - [ ] Sub-task 1 (callbacks, tools, configuration)
  - [ ] Sub-task 2 (dependencies, setup)

- [ ] **Build `next_agent`** (AgentType)
  - [ ] Sub-task 1
  - [ ] Sub-task 2

[Continue for all agents in execution order]

### **Final Integration:**
- [ ] Test complete workflow end-to-end
- [ ] Validate session state flow
- [ ] Confirm all callbacks and tools work
- [ ] Verify agent communication
```

#### **Guidelines for Implementation Order:**
1. **Follow execution flow** - build agents in the order they execute in the workflow
2. **Include all dependencies** - callbacks, tools, configuration as sub-tasks
3. **Root agent first** - start with the entry point agent
4. **Sequential flow** - follow how data flows through the system
5. **Sub-agents after parents** - build parent agents before their sub-agents when possible

#### **Sub-task Categories:**
- **Callbacks**: `before_agent_callback`, `after_agent_callback`, custom callbacks
- **Tools**: Built-in tools, function tools, agent tools, tool configuration
- **Configuration**: `output_key`, `model`, `instruction`, session state setup
- **Dependencies**: Other agents that must exist first, imports, setup
- **Validation**: Testing agent behavior, verifying outputs

### **Implementation Best Practices:**
- ✅ **Build incrementally** - complete each agent fully before moving to next
- ✅ **Test as you go** - validate each agent works before building dependents
- ✅ **Check off completed items** - track progress systematically
- ✅ **Follow execution order** - maintain logical workflow progression
- ❌ **Don't skip sub-tasks** - callbacks and tools are critical for proper function
