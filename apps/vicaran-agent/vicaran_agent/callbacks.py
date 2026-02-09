"""
Callback implementations for the Vicaran investigation workflow.
All callbacks follow ADK CallbackContext patterns.
"""

import re
import uuid
from typing import Any
from urllib.parse import urlparse, urlunparse

from google.adk.agents.callback_context import CallbackContext

from .config import config
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

    Extracts investigation_id and mode from user messages in session events.
    Called as before_agent_callback on the orchestrator.
    """
    session = callback_context._invocation_context.session
    session_state = session.state
    
    # Extract user messages from session events (ADK stores messages here, not in user_prompt)
    user_prompt = ""
    for event in reversed(session.events or []):
        # Look for user role in event content
        if hasattr(event, 'content') and event.content:
            if hasattr(event.content, 'role') and event.content.role == 'user':
                # Extract text from parts
                if hasattr(event.content, 'parts'):
                    for part in event.content.parts:
                        if hasattr(part, 'text') and part.text:
                            user_prompt = part.text
                            break
        if user_prompt:
            break
    
    # Fallback to state-based user_prompt if events don't have it
    if not user_prompt:
        user_prompt = session_state.get("user_prompt", "")
    
    # Also check investigation_brief from initial state
    investigation_brief = session_state.get("investigation_brief", "")

    if config.debug_mode:
        print(f"\n🔍 DEBUG: Extracting investigation ID")
        print(f"   user_prompt (from events): '{user_prompt[:100]}...'")
        print(f"   investigation_brief (from state): '{investigation_brief[:100] if investigation_brief else 'None'}...'")

    # Extract investigation_id from prompt (format: "Investigation ID: uuid")
    id_match = re.search(r"Investigation ID:\s*([a-f0-9-]+)", user_prompt, re.IGNORECASE)
    if id_match:
        session_state["investigation_id"] = id_match.group(1)
        if config.debug_mode:
            print(f"   ✅ Extracted investigation_id: {id_match.group(1)}")
    else:
        # No mock ID - log error and use empty ID (callbacks will skip)
        print("❌ ERROR: No investigation_id found in user message. Callbacks will be skipped.")
        if config.debug_mode:
            print(f"   user_prompt was: '{user_prompt[:200]}...'")
        session_state["investigation_id"] = ""

    # Extract mode from prompt or state
    mode = session_state.get("investigation_mode", "quick")
    if "detailed" in user_prompt.lower():
        mode = "detailed"

    # Extract title from prompt (format: "Title: XYZ")
    title_match = re.search(r"Title:\s*(.+?)(?:\n|$)", user_prompt)
    title = title_match.group(1).strip() if title_match else ""

    # Extract brief from prompt (format: "**Investigation Brief:**\nXYZ")
    brief_match = re.search(
        r"\*\*Investigation Brief:\*\*\s*(.+?)(?:\n\n|$)", user_prompt, re.DOTALL
    )
    brief = brief_match.group(1).strip() if brief_match else ""

    # Fallback to existing session state (set during ADK session creation)
    if not brief:
        brief = session_state.get("investigation_brief", "")
    if not title:
        title = brief[:50] if brief else "Untitled Investigation"

    investigation_id = session_state.get("investigation_id", "")

    # Initialize with mode-specific defaults
    session_state["investigation_mode"] = mode
    session_state["investigation_config"] = {
        "investigation_id": investigation_id,
        "mode": mode,
        "title": title,
        "brief": brief,
        "skip_timeline": mode == "quick",
        "source_limit": 15 if mode == "quick" else 30,
        "bias_level": "overall" if mode == "quick" else "per_source",
    }
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
    # Accumulated structured data for downstream agents
    session_state["sources_accumulated"] = []
    session_state["claims_accumulated"] = []

    if config.debug_mode:
        print(f"\n\U0001f680 INVESTIGATION INITIALIZED")
        print(f"\U0001f194 ID: {session_state.get('investigation_id', 'Not found')}")
        print(f"\U0001f4cb Mode: {mode}")
        print(f"\U0001f4dd Title: {title}")
        print(f"\U0001f4c4 Brief: {brief[:100]}..." if len(brief) > 100 else f"\U0001f4c4 Brief: {brief}")


# =============================================================================
# PIPELINE START CALLBACK
# =============================================================================


def pipeline_started_callback(callback_context: CallbackContext) -> None:
    """Fire INVESTIGATION_STARTED when the investigation pipeline begins.

    This is called as before_agent_callback on investigation_pipeline.
    It deterministically updates the investigation status to 'in_progress'
    without relying on LLM to call the callback tool.
    """
    investigation_id = callback_context.state.get("investigation_id")
    if not investigation_id:
        if config.debug_mode:
            print("\u26a0\ufe0f PIPELINE START: No investigation_id, skipping callback")
        return

    # The callback_api_tool expects a ToolContext, but we have CallbackContext
    # Make direct HTTP call instead (same logic as the tool)
    import httpx

    api_url = config.callback_api_url
    api_secret = config.agent_secret

    payload = {
        "type": "INVESTIGATION_STARTED",
        "investigation_id": investigation_id,
        "data": {},
    }

    headers = {
        "Content-Type": "application/json",
        "X-Agent-Secret": api_secret,
    }

    if config.debug_mode:
        print(f"\n\U0001f680 PIPELINE STARTED CALLBACK FIRED")
        print(f"\U0001f194 Investigation ID: {investigation_id}")

    try:
        response = httpx.post(api_url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        if config.debug_mode:
            print(f"\u2705 Status updated to 'in_progress'")
    except Exception as e:
        if config.debug_mode:
            print(f"\u274c CALLBACK ERROR: {str(e)}")


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

    if config.debug_mode:
        source_count = len(callback_context.state.get("source_id_map", []))
        print(f"\n\U0001f4e6 BATCH SAVE SOURCES: {source_count} sources in map")


def batch_save_claims(callback_context: CallbackContext) -> None:
    """After claim_extractor completes, store claim IDs for fact_checker.

    Note: Claims are saved via direct callback_api_tool calls during agent execution.
    This callback ensures claim_id_map is available for fact_checker.
    """
    if "claim_id_map" not in callback_context.state:
        callback_context.state["claim_id_map"] = []

    if config.debug_mode:
        claim_count = len(callback_context.state.get("claim_id_map", []))
        print(f"\n\U0001f4e6 BATCH SAVE CLAIMS: {claim_count} claims in map")



def save_final_summary(callback_context: CallbackContext) -> None:
    """After summary_writer completes, save the investigation summary.

    This makes a direct HTTP call to trigger INVESTIGATION_COMPLETE,
    following the same pattern as pipeline_started_callback.
    The summary is read from session state (via output_key), avoiding
    JSON parsing issues with large strings.
    """
    investigation_summary = callback_context.state.get("investigation_summary", "")
    investigation_id = callback_context.state.get("investigation_id")

    if not investigation_id or not investigation_summary:
        return

    # Check for completion marker
    if "[INVESTIGATION_COMPLETE]" not in investigation_summary:
        return  # Not complete yet

    # Extract overall bias score from summary (format: "Overall bias score: X.XX/10")
    overall_bias_score = None
    bias_match = re.search(r"Overall bias score:\s*([\d.]+)/10", investigation_summary, re.IGNORECASE)
    if bias_match:
        try:
            # Convert from 0-10 scale to 0-5 scale (as expected by API schema)
            score_10 = float(bias_match.group(1))
            overall_bias_score = score_10 / 2  # Convert 0-10 to 0-5 scale
        except ValueError:
            pass

    if config.debug_mode:
        print(f"\n🎉 INVESTIGATION COMPLETE: Saving summary")
        print(f"   📊 Extracted bias score: {overall_bias_score} (0-5 scale)")

    # Make direct HTTP call (same pattern as pipeline_started_callback)
    import httpx

    api_url = config.callback_api_url
    api_secret = config.agent_secret

    payload = {
        "type": "INVESTIGATION_COMPLETE",
        "investigation_id": investigation_id,
        "data": {
            "summary": investigation_summary,
            "overall_bias_score": overall_bias_score,
        },
    }

    headers = {
        "Content-Type": "application/json",
        "X-Agent-Secret": api_secret,
    }

    try:
        response = httpx.post(api_url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        if config.debug_mode:
            print(f"\u2705 Summary saved to database")
    except Exception as e:
        if config.debug_mode:
            print(f"\u274c Failed to save summary: {e}")


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
            if config.debug_mode:
                print(f"\n\u26a0\ufe0f PIPELINE PARTIAL: Insufficient data")
