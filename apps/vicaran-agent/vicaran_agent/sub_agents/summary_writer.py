"""
Summary Writer agent - generates final investigation summary.
"""

from google.adk.agents import LlmAgent

from ..callbacks import save_final_summary
from ..prompts import SUMMARY_WRITER_INSTRUCTION
from ..tools import callback_api_tool

summary_writer = LlmAgent(
    name="summary_writer",
    model="gemini-2.5-pro",  # Using Pro model for high-quality writing
    instruction=SUMMARY_WRITER_INSTRUCTION,
    tools=[callback_api_tool],
    after_agent_callback=save_final_summary,
    output_key="investigation_summary",
    description="Generates final investigation summary with citations",
)
