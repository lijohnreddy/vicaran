"""
Bias Analyzer agent - analyzes bias indicators across sources.
"""

from google.adk.agents import LlmAgent

from ..prompts import BIAS_ANALYZER_INSTRUCTION
from ..tools import callback_api_tool

bias_analyzer = LlmAgent(
    name="bias_analyzer",
    model="gemini-2.5-flash",
    instruction=BIAS_ANALYZER_INSTRUCTION,
    tools=[callback_api_tool],
    output_key="bias_analysis",
    description="Analyzes bias indicators across sources",
)
