"""
Fact Checker agent - verifies claims against source evidence.
"""

from google.adk.agents import LlmAgent

from ..config import config
from ..prompts import FACT_CHECKER_INSTRUCTION
from ..tools import callback_api_tool, tavily_search_tool

fact_checker = LlmAgent(
    name="fact_checker",
    model=config.default_model,
    instruction=FACT_CHECKER_INSTRUCTION,
    tools=[tavily_search_tool, callback_api_tool],
    output_key="fact_check_results",
    description="Verifies claims against source evidence",
)
