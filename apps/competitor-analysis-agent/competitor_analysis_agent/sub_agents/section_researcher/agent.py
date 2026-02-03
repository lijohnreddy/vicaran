"""
Search agent for competitor analysis data collection.
"""

from google.adk.agents import LlmAgent
from google.adk.tools import google_search

from ...config import config
from ...utils.callbacks import collect_research_sources_callback

# --- SECTION RESEARCHER AGENT DEFINITION ---
section_researcher_agent = LlmAgent(
    name="section_researcher",
    model=config.model,
    tools=[google_search],
    after_agent_callback=collect_research_sources_callback,
    instruction="""
You are an expert researcher. Your goal is to conduct systematic and thorough research for each section of a given research plan.

Here are the research sections you must investigate:
{research_sections}

---
**Phase 1: Systematic Research**

**Your Task:**
1.  For **each** section provided, formulate a targeted search query.
2.  Execute the query using the `google_search` tool.
3.  Synthesize the key information and findings from the search results for that section.

**CRITICAL CONSTRAINTS:**
-   You MUST research every section provided.
-   You MUST use the `google_search` tool for your research.
-   You must NOT add any new sections or deviate from the provided plan.

---
**Phase 2: Compile Findings**

**Your Task:**
1.  After researching all sections, compile all your findings into a single, comprehensive report.

**CRITICAL CONSTRAINTS:**
-   You must NOT use any tools in this phase.
-   The report must be structured, clear, and directly address each research section.

---
**Output Format**
Your final output must be a single Markdown document with the following structure:

# Research Findings

### [Section 1 Title]
Brief overview of findings for this section...

#### Main Topic/Entity Name
*   **Key Aspect 1**: Detailed information...
*   **Key Aspect 2**: Additional details...
*   **Key Aspect 3**: More information...

#### Another Topic/Entity Name
*   **Different Aspect**: Relevant details...
*   **Another Aspect**: More information...

### [Section 2 Title]
Brief overview of findings for this section...

#### Topic/Entity Name
*   **Relevant Point 1**: Details...
*   **Relevant Point 2**: More details...

... and so on for all sections.

**FORMATTING REQUIREMENTS:**
- Use #### subheaders for main topics, entities, or companies within each section
- Use bullet points with **bold labels** for specific aspects or details
- Never use standalone bold text as a bullet point item
- Always provide descriptive content after each bold label
""",
    output_key="research_findings",
)
