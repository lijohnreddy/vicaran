"""
Summary Writer agent - generates final investigation summary.
"""

from google.adk.agents import LlmAgent

from ..callbacks import save_final_summary
from ..config import config
from ..prompts import SUMMARY_WRITER_INSTRUCTION

summary_writer = LlmAgent(
    name="summary_writer",
    model=config.default_model,
    instruction=SUMMARY_WRITER_INSTRUCTION,
    # No tools needed - callback handles persistence
    after_agent_callback=save_final_summary,
    output_key="investigation_summary",
    description="Generates final investigation summary with citations",
)
