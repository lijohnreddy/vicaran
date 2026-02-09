"""
Timeline Builder agent - constructs chronological timeline from sources.
Skipped in Quick Search mode.
"""

from google.adk.agents import LlmAgent

from ..config import config
from ..prompts import TIMELINE_BUILDER_INSTRUCTION
from ..tools import callback_api_tool

timeline_builder = LlmAgent(
    name="timeline_builder",
    model=config.default_model,
    instruction=TIMELINE_BUILDER_INSTRUCTION,
    tools=[callback_api_tool],
    output_key="timeline_events",
    description="Constructs chronological timeline from sources (skipped in Quick mode)",
)
