"""
Claim Extractor agent - extracts and ranks claims from sources.
"""

from google.adk.agents import LlmAgent

from ..callbacks import batch_save_claims
from ..prompts import CLAIM_EXTRACTOR_INSTRUCTION
from ..tools import callback_api_tool, jina_reader_tool

claim_extractor = LlmAgent(
    name="claim_extractor",
    model="gemini-2.5-flash",
    instruction=CLAIM_EXTRACTOR_INSTRUCTION,
    tools=[jina_reader_tool, callback_api_tool],
    after_agent_callback=batch_save_claims,
    output_key="extracted_claims",
    description="Extracts and ranks claims from all sources",
)
