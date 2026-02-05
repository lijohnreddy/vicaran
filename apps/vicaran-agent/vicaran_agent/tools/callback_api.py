"""
Callback API tool for communicating with the Next.js backend.
Sends investigation data to the database via the agent-callback API endpoint.
"""

import os
from typing import Any

import httpx
from google.adk.tools import ToolContext


def callback_api_tool(
    callback_type: str,
    data: dict[str, Any],
    tool_context: ToolContext,
) -> dict[str, Any]:
    """Send data to the Next.js callback API for database persistence.

    Args:
        callback_type: Type of callback (SOURCE_FOUND, CLAIM_EXTRACTED, FACT_CHECKED,
                      BIAS_ANALYZED, TIMELINE_EVENT, INVESTIGATION_STARTED,
                      INVESTIGATION_COMPLETE, INVESTIGATION_PARTIAL, INVESTIGATION_FAILED)
        data: Structured data payload for the callback
        tool_context: ADK context for state access (ALWAYS LAST PARAMETER)

    Returns:
        API response with success status and created ID (source_id, claim_id, etc.)
    """
    # Get investigation_id from session state
    investigation_id = tool_context.state.get("investigation_id")
    if not investigation_id:
        return {"success": False, "error": "No investigation_id in session state"}

    api_url = os.getenv("CALLBACK_API_URL", "http://localhost:3000/api/agent-callback")
    api_secret = os.getenv("AGENT_SECRET", "")

    # API expects 'type' not 'callback_type'
    payload = {
        "type": callback_type,
        "investigation_id": investigation_id,
        "data": data,
    }

    # Use X-Agent-Secret header to match existing API
    headers = {
        "Content-Type": "application/json",
        "X-Agent-Secret": api_secret,
    }

    # DEBUG MODE - Enable with DEBUG_MODE=true in .env
    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        print(f"\n🚀 CALLBACK FIRED: {callback_type}")
        print(f"🆔 Investigation ID: {investigation_id}")
        print(f"📦 PAYLOAD: {str(data)[:200]}...")

    try:
        response = httpx.post(api_url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        result = response.json()

        if debug_mode:
            print(f"✅ RESPONSE: {result}")

        # API returns created IDs: source_id, claim_id, fact_check_id, event_id
        return {"success": True, **result}
    except httpx.HTTPStatusError as e:
        error_msg = f"HTTP {e.response.status_code}: {e.response.text[:200]}"
        if debug_mode:
            print(f"❌ HTTP ERROR: {error_msg}")
        return {"success": False, "error": error_msg}
    except Exception as e:
        if debug_mode:
            print(f"❌ ERROR: {str(e)}")
        return {"success": False, "error": str(e)}
