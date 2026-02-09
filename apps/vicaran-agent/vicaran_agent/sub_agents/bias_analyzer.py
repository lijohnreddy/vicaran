"""
Bias Analyzer agent - analyzes bias indicators across sources.
"""

from google.adk.agents import LlmAgent

from ..callbacks import rate_limit_delay
from ..config import config
from ..prompts import BIAS_ANALYZER_INSTRUCTION
from ..tools import callback_api_tool

bias_analyzer = LlmAgent(
    name="bias_analyzer",
    model=config.default_model,
    instruction=BIAS_ANALYZER_INSTRUCTION,
    tools=[callback_api_tool],
    before_agent_callback=rate_limit_delay,
    output_key="bias_analysis",
    description="Analyzes bias indicators across sources",
)
