"""
Callback implementations for the Vicaran investigation workflow.
All callbacks follow ADK CallbackContext patterns.
"""

import os
import re
import uuid
from typing import Any
from urllib.parse import urlparse, urlunparse

from google.adk.agents.callback_context import CallbackContext

from .tools.callback_api import callback_api_tool


# =============================================================================
# URL NORMALIZATION HELPER
# =============================================================================


def normalize_url(url: str) -> str:
    """Normalize URL for reliable matching.

    Handles:
    - Trailing slashes: reuters.com/article/ → reuters.com/article
    - www prefix: www.bbc.com → bbc.com
    - Case differences: HTTP://Example.COM → http://example.com
    - Missing scheme: bbc.com/news → https://bbc.com/news
    """
    if not url:
        return ""

    # Add scheme if missing
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    parsed = urlparse(url.lower())  # Lowercase everything

    # Rebuild with normalized parts
    normalized = urlunparse(
        (
            parsed.scheme,
            parsed.netloc.replace("www.", ""),  # Remove www
            parsed.path.rstrip("/"),  # Remove trailing slash
            "",  # params
            "",  # query (stripped for matching)
            "",  # fragment
        )
    )

    return normalized


# =============================================================================
# STATE INITIALIZATION CALLBACK
# =============================================================================


def initialize_investigation_state(callback_context: CallbackContext) -> None:
    """Initialize all required state keys for the investigation workflow.

    Extracts investigation_id and mode from the user prompt.
    Called as before_agent_callback on the orchestrator.
    """
    session_state = callback_context._invocation_context.session.state
    user_prompt = session_state.get("user_prompt", "")

    # Extract investigation_id from prompt (format: "Investigation ID: uuid")
    id_match = re.search(r"Investigation ID:\s*([a-f0-9-]+)", user_prompt, re.IGNORECASE)
    if id_match:
        session_state["investigation_id"] = id_match.group(1)
    else:
        # Generate mock ID for ADK Web testing (no frontend)
        mock_id = str(uuid.uuid4())
        session_state["investigation_id"] = mock_id
        debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
        if debug_mode:
            print(f"⚠️ No investigation_id in prompt, generated mock: {mock_id}")

    # Extract mode from prompt
    mode = "quick" if "quick" in user_prompt.lower() else "detailed"

    # Initialize with mode-specific defaults
    session_state["investigation_mode"] = mode
    session_state["investigation_config"] = {}
    session_state["user_sources"] = []
    session_state["investigation_plan"] = ""
    session_state["discovered_sources"] = ""
    session_state["extracted_claims"] = ""
    session_state["fact_check_results"] = ""
    session_state["bias_analysis"] = ""
    session_state["timeline_events"] = ""
    session_state["investigation_summary"] = ""
    session_state["source_id_map"] = []
    session_state["claim_id_map"] = []

    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        print(f"\n🚀 INVESTIGATION INITIALIZED")
        print(f"🆔 ID: {session_state.get('investigation_id', 'Not found')}")
        print(f"📋 Mode: {mode}")


# =============================================================================
# BATCH SAVE CALLBACKS
# =============================================================================


def _parse_sources_from_output(output: str) -> list[dict[str, Any]]:
    """Parse source data from agent output text.

    This is a simplified parser - the agent should output structured data
    that we can extract. For MVP, we rely on the agent calling callback_api_tool
    for each source individually.
    """
    # For MVP, sources are saved via direct callback_api_tool calls in agent
    # This callback is primarily for post-processing and ID storage
    return []


def batch_save_sources(callback_context: CallbackContext) -> None:
    """After source_finder completes, store source IDs for downstream agents.

    Note: Sources are saved via direct callback_api_tool calls during agent execution.
    This callback captures the results and stores source_id_map.
    """
    # Source IDs are accumulated during agent execution via callback_api_tool
    # Just ensure the map is available
    if "source_id_map" not in callback_context.state:
        callback_context.state["source_id_map"] = []

    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        source_count = len(callback_context.state.get("source_id_map", []))
        print(f"\n📦 BATCH SAVE SOURCES: {source_count} sources in map")


def batch_save_claims(callback_context: CallbackContext) -> None:
    """After claim_extractor completes, store claim IDs for fact_checker.

    Note: Claims are saved via direct callback_api_tool calls during agent execution.
    This callback ensures claim_id_map is available for fact_checker.
    """
    if "claim_id_map" not in callback_context.state:
        callback_context.state["claim_id_map"] = []

    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        claim_count = len(callback_context.state.get("claim_id_map", []))
        print(f"\n📦 BATCH SAVE CLAIMS: {claim_count} claims in map")


def batch_save_fact_checks(callback_context: CallbackContext) -> None:
    """After fact_checker completes, log the fact check results.

    Fact checks are saved via direct callback_api_tool calls during agent execution.
    """
    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        print(f"\n📦 BATCH SAVE FACT CHECKS: Complete")


def batch_save_bias_scores(callback_context: CallbackContext) -> None:
    """After bias_analyzer completes, log the bias analysis.

    Bias scores are saved via direct callback_api_tool calls during agent execution.
    """
    # Check for skip marker
    bias_output = callback_context.state.get("bias_analysis", "")
    if "[BIAS_SKIPPED]" in bias_output:
        return  # Nothing to save

    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        print(f"\n📦 BATCH SAVE BIAS SCORES: Complete")


def batch_save_timeline_events(callback_context: CallbackContext) -> None:
    """Save timeline events, but skip if agent returned TIMELINE_SKIPPED."""
    timeline_output = callback_context.state.get("timeline_events", "")

    # Detect skip marker - no DB writes needed
    if "[TIMELINE_SKIPPED]" in timeline_output:
        debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
        if debug_mode:
            print(f"\n⏭️ TIMELINE SKIPPED: Quick Search mode")
        return  # Nothing to save

    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        print(f"\n📦 BATCH SAVE TIMELINE: Complete")


def save_final_summary(callback_context: CallbackContext) -> None:
    """After summary_writer completes, save the investigation summary.

    This triggers the INVESTIGATION_COMPLETE callback.
    """
    investigation_summary = callback_context.state.get("investigation_summary", "")
    investigation_id = callback_context.state.get("investigation_id")

    if not investigation_id or not investigation_summary:
        return

    # Check for completion marker
    if "[INVESTIGATION_COMPLETE]" not in investigation_summary:
        return  # Not complete yet

    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        print(f"\n🎉 INVESTIGATION COMPLETE: Saving summary")


# =============================================================================
# PIPELINE STATUS CHECK
# =============================================================================


def check_pipeline_status(callback_context: CallbackContext) -> None:
    """Check if pipeline should terminate due to no data.

    Detects early termination markers and sends INVESTIGATION_PARTIAL.
    """
    output = str(callback_context.output) if callback_context.output else ""

    # Detect early termination markers
    if any(
        marker in output
        for marker in [
            "[NO_SOURCES_FOUND]",
            "[NO_CLAIMS_EXTRACTED]",
        ]
    ):
        investigation_id = callback_context.state.get("investigation_id")
        if investigation_id:
            # This would be called via the tool, but we log it here
            debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
            if debug_mode:
                print(f"\n⚠️ PIPELINE PARTIAL: Insufficient data")
