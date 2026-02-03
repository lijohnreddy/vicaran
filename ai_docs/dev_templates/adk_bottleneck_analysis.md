# ADK Bottleneck Analysis Template

> **Purpose:** This template helps analyze and diagnose performance bottlenecks, logic failures, and workflow issues in Google Agent Development Kit (ADK) agent systems. Use this when your ADK agent produces unexpected or poor results and you need to identify the root cause and solution.

---

## 🎯 Instructions for AI Agents Using This Template

### **Your Role**: ADK System Diagnostic Specialist
You are helping developers identify and fix bottlenecks in their ADK agent workflows. Your goal is to systematically analyze the agent execution flow, identify where things went wrong, and provide actionable solutions.

### **Critical Guidelines**:
- 🔍 **Follow the diagnostic workflow step-by-step** - Don't skip phases
- 🎯 **Focus on root causes** - Don't just treat symptoms
- 📊 **Trace data flow** - Follow how information flows between agents
- 🚨 **Identify cascade failures** - One agent's failure often impacts downstream agents
- ✅ **Provide specific, actionable recommendations** - Not just general advice
- 🔧 **Offer concrete implementation solutions** - Include code examples when helpful

---

## 📋 Phase 1: Data Collection

### Step 1: Request ADK Session Export Data

**📥 Ask the user to provide:**

> To analyze your ADK system bottlenecks, I need you to provide the following information:
> 
> **1. ADK Session Export Data**
> - Click the **Export** button in the top-right corner of your ADK web session
> - This will download a JSON file containing the entire conversation and agent states
> - Copy and paste the **final output** and **final state** from this JSON file
> 
> **2. Initial User Input**
> - Provide the exact initial prompt/input you gave to start the ADK session
> 
> **3. High-Level Workflow Documentation (if available)**
> - Any workflow diagrams, agent descriptions, or documentation about your ADK system
> - Task documents or planning materials you used to build the agents

### Step 2: Document Provided Information

<!-- AI Agent: Once user provides data, organize it here -->

**✅ Data Collection Checklist:**
- [ ] Final output from ADK session received
- [ ] Final state data from ADK session received  
- [ ] Initial user input documented
- [ ] Workflow documentation (if any) reviewed
- [ ] Agent system architecture understood

**📊 Session Overview:**
```
Initial Input: [Paste user's initial input here]

Final Output: [Paste final output here]

Final State Keys: [List the main state keys and their contents]

Agent Flow: [List the agents that were executed]
```

---

## 📋 Phase 2: Problem Identification

### Step 3: Gather User Perspective

**❓ Ask the user:**

> Now that I have your session data, I need to understand what went wrong from your perspective:
> 
> **Key Questions:**
> 1. **What specific results were you expecting?** (Be as detailed as possible)
> 2. **What actually happened that was wrong/unexpected?** 
> 3. **At what point did you notice the output was going in the wrong direction?**
> 4. **Were there any specific agents or steps that seemed to misunderstand your requirements?**
> 5. **What should have happened differently at each problematic step?**

### Step 4: Document Expected vs Actual Results

<!-- AI Agent: Fill this out based on user's feedback -->

**🎯 Expected Outcome:**
[Document what the user expected to happen]

**❌ Actual Outcome:**  
[Document what actually happened]

**🚨 Key Discrepancies:**
- [List specific differences between expected and actual results]

---

## 📋 Phase 3: Root Cause Analysis

### Step 5: Analyze Agent-by-Agent Execution Flow

<!-- AI Agent: This is your systematic analysis phase -->

**🔍 Agent Flow Analysis:**

#### Agent 1: [Root Agent Name]
- **Input Received:** [What this agent received]
- **Expected Processing:** [What it should have done]
- **Actual Processing:** [What it actually did] 
- **Output Generated:** [What it passed to next agent]
- **✅/❌ Assessment:** [Did this agent work correctly?]

#### Agent 2: [Second Agent Name]  
- **Input Received:** [What this agent received]
- **Expected Processing:** [What it should have done]
- **Actual Processing:** [What it actually did]
- **Output Generated:** [What it passed to next agent]
- **✅/❌ Assessment:** [Did this agent work correctly?]

<!-- Continue for each agent in the workflow -->

### Step 6: Identify Cascade Effects

**🌊 Cascade Failure Analysis:**
- **Root Failure Point:** [Which agent first went wrong]
- **Downstream Impact:** [How this failure affected subsequent agents]
- **Amplification Effects:** [How errors got worse through the chain]

### Step 7: Examine Agent Implementation Code

**🔍 Code Review Process:**

<!-- AI Agent: Use codebase_search and read_file to examine the problematic agents -->

**Agents to Examine:**
- [ ] Root agent implementation
- [ ] Any agent identified as problematic in flow analysis
- [ ] Agents that should have caught/corrected the errors

**🚨 CRITICAL: Check Agent Delegation Pattern**
Before diving deep, check this common issue:
- [ ] Is there a `sub_agents=[next_agent]` relationship defined?
- [ ] Is the agent using `AgentTool(next_agent)` incorrectly for delegation?
- [ ] Do the instructions **tell the agent to delegate** to the next agent (as action, not announcement)?
- [ ] Does the agent stop after completing work instead of delegating?
- [ ] Are the delegation instructions clear about WHEN to delegate?

**Code Analysis Findings:**
```
Agent: [name]
File: [path]
Issues Found:
- [Specific code issues]
- [Missing validations]
- [Incorrect logic]
- [Delegation pattern problems]

Agent: [name] 
File: [path]
Issues Found:
- [Specific code issues]
```

---

## 📋 Phase 4: Solution Development

### Step 8: Categorize Problems

**🏷️ Problem Categories:**

**Input Understanding Issues:**
- [ ] Agent misunderstood user requirements
- [ ] Missing clarifying questions in root agent
- [ ] Incorrect business model/use case recognition

**Data Flow Problems:**
- [ ] State keys not properly passed between agents
- [ ] Data transformation errors
- [ ] Missing required information in agent handoffs

**Logic/Algorithm Issues:** 
- [ ] Incorrect processing logic in specific agents
- [ ] Missing validation steps
- [ ] Poor error handling

**Search/Research Problems:**
- [ ] Incorrect search queries
- [ ] Wrong data sources targeted
- [ ] Inadequate result filtering/validation

**Output Quality Issues:**
- [ ] Poor result formatting
- [ ] Missing key information
- [ ] Incorrect conclusions drawn

### Step 9: Develop Specific Recommendations

**🔧 Recommended Solutions:**

#### High-Priority Fixes (Root Causes)
1. **[Problem Category]**: [Specific Issue]
   - **Root Cause:** [Why this happened]
   - **Recommended Fix:** [Specific solution]
   - **Implementation:** [How to implement]
   - **Files to Modify:** [Specific file paths]

2. **[Problem Category]**: [Specific Issue]
   - **Root Cause:** [Why this happened]  
   - **Recommended Fix:** [Specific solution]
   - **Implementation:** [How to implement]
   - **Files to Modify:** [Specific file paths]

#### Medium-Priority Improvements
[List additional improvements that would prevent similar issues]

#### Prevention Strategies  
[Recommend systematic changes to prevent these types of bottlenecks in the future]

---

## 📋 Phase 5: Action Planning

### Step 10: Present Analysis Report

**📊 Bottleneck Analysis Report:**

> ## 🔍 ADK System Bottleneck Analysis Results
> 
> **Root Cause Identified:** [Primary issue that caused the problems]
> 
> **Key Findings:**
> - [Main finding 1]
> - [Main finding 2] 
> - [Main finding 3]
> 
> **Recommended Solution Approach:** [Your recommended strategy]
> 
> **Expected Impact:** [How these fixes will improve the system]
> 
> **Implementation Complexity:** [Low/Medium/High - estimate effort required]

### Step 11: Gather Feedback and Next Steps

**❓ Ask the user:**

> **Questions for you:**
> 1. Does this analysis align with your observations of what went wrong?
> 2. Are there any aspects of the problem I missed or misunderstood?
> 3. Do you have any questions about the recommended solutions?
> 4. Are there any constraints or preferences for how you'd like to implement the fixes?

**🚀 Next Steps:**
> **I believe I found the root issue/bottleneck that needs to be addressed.**
>
> If this analysis looks good and you're ready to implement the fixes, I can help you create a comprehensive **ADK Task Template** that will:
> - Detail the specific code changes needed for each identified bottleneck
> - Provide step-by-step implementation procedures for agent modifications  
> - Include testing and validation steps to ensure fixes work properly
> - Ensure all solutions align with ADK best practices and patterns
> - Break down complex fixes into manageable implementation phases
> 
> **Can I create a new `adk_task_template.md` for you to fix this issue?**

---

## 🎯 Success Criteria

### **Analysis Complete When:**
- [ ] Root cause clearly identified and documented
- [ ] Agent-by-agent execution flow analyzed
- [ ] Specific code issues pinpointed with file locations
- [ ] Actionable recommendations provided with implementation details
- [ ] User understands the problems and agrees with the solution approach
- [ ] Clear next steps established (either questions answered or ADK task creation initiated)

### **Quality Indicators:**
- **Specificity**: Recommendations include exact file paths and code changes
- **Traceability**: Clear connection from symptoms → root cause → solution  
- **Actionability**: User can immediately begin implementing fixes
- **Comprehensiveness**: All major bottlenecks identified, not just the most obvious ones

---

## 🚨 Common ADK Bottleneck Patterns

### **Pattern 1: Business Model Recognition Failure**
- **Symptoms**: Generic results, wrong competitors identified, irrelevant research
- **Root Cause**: Root agent doesn't understand specific business model/use case
- **Solution**: Add business model classification logic and clarifying questions

### **Pattern 2: State Key Cascade Failures** 
- **Symptoms**: Agents working with incomplete data, downstream errors
- **Root Cause**: State keys not properly defined or passed between agents
- **Solution**: Implement comprehensive state dependency mapping

### **Pattern 3: Search Strategy Misalignment**
- **Symptoms**: Wrong data sources, irrelevant results, missing key information  
- **Root Cause**: Search queries don't match actual user requirements
- **Solution**: Improve query generation logic and result validation

### **Pattern 4: Validation Loop Failures**
- **Symptoms**: Poor quality results that should have been caught and improved
- **Root Cause**: Insufficient quality checks or refinement processes
- **Solution**: Implement robust validation and iterative improvement workflows

### **Pattern 5: Agent Scope Confusion**
- **Symptoms**: Agents doing too much or too little, redundant processing
- **Root Cause**: Unclear agent responsibilities and boundaries
- **Solution**: Clarify agent roles and implement proper workflow orchestration

### **Pattern 6: Agent Delegation vs Tool Call Confusion**
- **Symptoms**: Agent stops after completing work instead of delegating to next agent
- **Root Cause**: Confusion between `AgentTool()` (returns results) vs delegation (hands off conversation)
- **Common Error**: Using `AgentTool(next_agent)` when you want delegation, OR thinking `sub_agents` makes delegation automatic
- **Solution**: 
  - **Use `AgentTool(agent)`** when you want agent to do work and return results
  - **For delegation**: Use `sub_agents=[agent]` AND **instruct agent to delegate** (action, not announcement)
  - **CRITICAL**: Agent must be told to delegate - ADK handles the handoff mechanism automatically

### **Pattern 7: Citation System Failures**
- **Symptoms**: Reports missing citations, or showing raw source names in text (e.g., "fullstackdeeplearning.com")
- **Root Cause**: LLM not using proper citation tag format, so callback doesn't trigger
- **Common Errors**: 
  - Generic citation instructions instead of explicit format requirements
  - Missing `{sources}` data in report composer instructions
  - LLM adds source names directly in text instead of using tags
- **Solution**:
  - **Explicit citation instructions**: "The only correct format is: `<cite source="src-ID_NUMBER" />`"
  - **Provide sources data**: Include `{sources}` in report composer input
  - **Show examples**: Demonstrate exact tag format with concrete examples
  - **Mandate compliance**: Use "NEVER" and "ALWAYS" language for format requirements

### **Pattern 8: State Reference Interpolation Failures**
- **Symptoms**: Agent crashes during prompt interpolation, `KeyError` on state access, template rendering errors
- **Root Cause**: Prompts reference state keys (e.g., `{research_context}`, `{user_requirements}`) that were never declared through tool calls or agent outputs
- **Common Error**: Using `{state_key}` in instructions without ensuring the key exists via `output_key` or tool call
- **Solution**: 
  - **Audit all state references**: Check every `{variable}` in agent instructions
  - **Ensure state key creation**: Use `output_key="key_name"` or tool calls to populate state
  - **Add validation**: Check state keys exist before interpolation
  - **Example Fix**: If using `{research_findings}`, ensure previous agent has `output_key="research_findings"`

### **Pattern 9: Structured Output Implementation Issues**
- **Symptoms**: Inconsistent output formats, JSON parsing errors, poor result structure, manual string parsing
- **Root Cause**: Not using ADK's `output_schema` parameter for enforcing structured responses
- **Common Error**: Relying on instructions alone to get structured output instead of schema enforcement
- **Solution**: 
  - **Use Pydantic models**: Create `BaseModel` classes for expected output structure
  - **Set `output_schema`**: Use `output_schema=YourModel` parameter in `LlmAgent`
  - **Combine with `output_key`**: Save structured results to state for next agents
  - **Example Implementation**:
    ```python
    from typing import Literal
    from pydantic import BaseModel, Field
    
    class CompetitorAnalysis(BaseModel):
        company_name: str = Field(description="Competitor company name")
        market_position: str = Field(description="Market position analysis")
        threat_level: Literal["low", "medium", "high"] = Field(description="Threat assessment")
    
    agent = LlmAgent(
        output_schema=CompetitorAnalysis,  # Enforces JSON structure
        output_key="competitor_data"       # Saves to state["competitor_data"]
    )
    ```

### **Pattern 10: Agent Responsibility Overload**
- **Symptoms**: Agents taking too long, complex multi-step logic, multiple failure points, inconsistent results
- **Root Cause**: Single agent responsible for too many tasks (>2 tool calls or complex workflows)
- **Common Error**: Creating "super agents" that do everything instead of focused pipeline agents
- **Solution**: 
  - **Pipeline Principle**: Each agent should do input → processing → output (max 1-2 tool calls)
  - **Break down complex agents**: Split multi-step processes into separate agents
  - **Single Responsibility**: One agent = one clear purpose
  - **Example Breakdown**:
    - ❌ **Bad**: One agent that researches + analyzes + formats + validates results
    - ✅ **Good**: ResearchAgent → AnalysisAgent → FormatterAgent → ValidatorAgent
  - **Tool Call Limit**: If agent needs >2 tool calls, consider splitting into multiple agents

---

## 📚 Additional Resources

### **When to Use This Template:**
- ✅ ADK agent produces unexpected or low-quality results
- ✅ Workflow seems to work but delivers wrong outcomes
- ✅ Agents are executing but missing the mark on requirements  
- ✅ Need systematic diagnosis rather than random troubleshooting
- ✅ Want to prevent similar issues in future agent development

### **When NOT to Use This Template:**
- ❌ Simple bugs or syntax errors (use regular debugging)
- ❌ Agent system not executing at all (technical deployment issues)
- ❌ Performance optimization (speed/memory issues)
- ❌ Feature requests or new functionality (use ADK task template)

### **Related Templates:**
- [`adk_task_template.md`](./adk_task_template.md) - For implementing fixes identified in bottleneck analysis
- [`agent_orchestrator.md`](./agent_orchestrator.md) - For designing new agent workflows
- [`task_template.md`](./task_template.md) - For general development tasks 
