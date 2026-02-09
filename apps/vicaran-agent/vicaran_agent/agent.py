"""
Root agent for the Vicaran investigation system.
"""

from google.adk.agents import LlmAgent, SequentialAgent

from .callbacks import initialize_investigation_state, pipeline_started_callback
from .config import config
from .prompts import ORCHESTRATOR_INSTRUCTION
from .sub_agents import (
    bias_analyzer,
    claim_extractor,
    fact_checker,
    source_finder,
    summary_writer,
    timeline_builder,
)
from .tools import analyze_source_tool, callback_api_tool

# =============================================================================
# INVESTIGATION PIPELINE
# =============================================================================

# The investigation pipeline executes sub-agents in sequence
# Each agent reads from session state and writes to its output_key
investigation_pipeline = SequentialAgent(
    name="investigation_pipeline",
    sub_agents=[
        source_finder,  # Discovers sources → discovered_sources
        claim_extractor,  # Extracts claims → extracted_claims
        fact_checker,  # Verifies claims → fact_check_results
        bias_analyzer,  # Analyzes bias → bias_analysis
        timeline_builder,  # Builds timeline → timeline_events (skipped in Quick mode)
        summary_writer,  # Generates summary → investigation_summary
    ],
    description="Sequential pipeline executing the investigation workflow stages",
    # Deterministic status update - fires when pipeline starts (not LLM-dependent)
    before_agent_callback=pipeline_started_callback,
)

# =============================================================================
# ROOT ORCHESTRATOR
# =============================================================================

investigation_orchestrator = LlmAgent(
    name="investigation_orchestrator",
    model=config.default_model,
    instruction=ORCHESTRATOR_INSTRUCTION,
    sub_agents=[investigation_pipeline],
    tools=[analyze_source_tool, callback_api_tool],
    before_agent_callback=initialize_investigation_state,
    output_key="investigation_plan",
    description="Vicaran investigation orchestrator - analyzes sources, generates plans, and delegates to pipeline",
)

# =============================================================================
# EXPORT FOR ADK SYSTEM
# =============================================================================

root_agent = investigation_orchestrator
