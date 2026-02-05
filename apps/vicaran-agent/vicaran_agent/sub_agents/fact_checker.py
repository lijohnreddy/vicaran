"""
Fact Checker agent - verifies claims against source evidence.
"""

from google.adk.agents import LlmAgent

from ..callbacks import batch_save_fact_checks
from ..prompts import FACT_CHECKER_INSTRUCTION
from ..tools import callback_api_tool, tavily_search_tool

fact_checker = LlmAgent(
    name="fact_checker",
    model="gemini-2.5-pro",  # Using Pro model for critical reasoning task
    instruction=FACT_CHECKER_INSTRUCTION,
    tools=[tavily_search_tool, callback_api_tool],
    after_agent_callback=batch_save_fact_checks,
    output_key="fact_check_results",
    description="Verifies claims against source evidence",
)
