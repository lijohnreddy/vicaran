"""
Jina Reader tool for extracting content from URLs.
"""

import os
from typing import Any
from urllib.parse import urlparse

import httpx
from google.adk.tools import ToolContext


# Blocked content indicators
BLOCKED_CONTENT_INDICATORS = [
    "403 forbidden",
    "access denied",
    "please enable javascript",
    "captcha",
    "rate limit",
    "cloudflare",
    "robot check",
    "too many requests",
    "blocked",
    "unavailable",
    "404 not found",
]


def is_blocked_content(content: str) -> bool:
    """Check if content indicates a blocked/failed fetch."""
    if not content or len(content.strip()) < 200:
        return True
    content_lower = content.lower()[:500]  # Check first 500 chars
    return any(indicator in content_lower for indicator in BLOCKED_CONTENT_INDICATORS)


def jina_reader_tool(
    url: str,
    tool_context: ToolContext,
) -> dict[str, Any]:
    """Fetch and extract content from a URL using Jina Reader.

    Args:
        url: URL to fetch content from
        tool_context: ADK context for state access (ALWAYS LAST PARAMETER)

    Returns:
        Extracted content with metadata
    """
    domain = urlparse(url).netloc

    # Jina Reader endpoint (no API key needed for basic usage)
    jina_url = f"https://r.jina.ai/{url}"

    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        print(f"\n📖 JINA READER: {url}")

    try:
        response = httpx.get(jina_url, timeout=30)
        content = response.text[:5000]  # Limit for LLM processing

        # Check for blocked/error content
        if is_blocked_content(content):
            if debug_mode:
                print(f"⚠️ Content blocked or unavailable")
            return {
                "success": False,
                "url": url,
                "domain": domain,
                "is_reachable": False,
                "error": "Content blocked or unavailable",
                "content": "",
            }

        if debug_mode:
            print(f"✅ Fetched {len(content)} chars")

        return {
            "success": True,
            "url": url,
            "domain": domain,
            "is_reachable": True,
            "content": content,
        }
    except Exception as e:
        if debug_mode:
            print(f"❌ JINA ERROR: {str(e)}")
        return {
            "success": False,
            "url": url,
            "domain": domain,
            "is_reachable": False,
            "error": str(e),
            "content": "",
        }
