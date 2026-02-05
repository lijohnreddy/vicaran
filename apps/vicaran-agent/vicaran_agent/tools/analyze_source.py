"""
Analyze source tool for processing user-provided URLs during plan generation.
"""

import os
from typing import Any
from urllib.parse import urlparse

import httpx
from google.adk.tools import ToolContext


# Blocked content indicators (shared with jina_reader)
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

# Domain-based credibility lookup (for MVP)
TRUSTED_DOMAINS = {
    # Tier 1: Major wire services and established outlets
    "reuters.com": 5,
    "apnews.com": 5,
    "bbc.com": 5,
    "bbc.co.uk": 5,
    # Tier 2: Major newspapers
    "nytimes.com": 4,
    "washingtonpost.com": 4,
    "theguardian.com": 4,
    "wsj.com": 4,
    # Tier 3: Cable news and general outlets
    "cnn.com": 3,
    "foxnews.com": 3,
    "msnbc.com": 3,
    "nbcnews.com": 3,
    # Government and official sources
    "gov": 4,  # Any .gov domain
    "epa.gov": 5,
    "fda.gov": 5,
    "cdc.gov": 5,
}


def is_blocked_content(content: str) -> bool:
    """Check if content indicates a blocked/failed fetch."""
    if not content or len(content.strip()) < 200:
        return True
    content_lower = content.lower()[:500]
    return any(indicator in content_lower for indicator in BLOCKED_CONTENT_INDICATORS)


def get_credibility_score(domain: str) -> int:
    """Get credibility score for a domain (1-5 scale)."""
    # Check exact match first
    if domain in TRUSTED_DOMAINS:
        return TRUSTED_DOMAINS[domain]

    # Check for .gov domains
    if domain.endswith(".gov"):
        return 4

    # Check for educational domains
    if domain.endswith(".edu"):
        return 4

    # Default for unknown domains
    return 3


def analyze_source_tool(
    url: str,
    tool_context: ToolContext,
) -> dict[str, Any]:
    """Analyze a user-provided URL before plan generation.

    Fetches content via Jina Reader, checks for blocked content,
    and provides domain-based credibility scoring.

    Args:
        url: User-provided URL to analyze
        tool_context: ADK context for state access (ALWAYS LAST PARAMETER)

    Returns:
        Source analysis dict with URL, domain, credibility, and content
    """
    domain = urlparse(url).netloc

    # Fetch content via Jina Reader (no API key needed)
    jina_url = f"https://r.jina.ai/{url}"

    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        print(f"\n🔎 ANALYZE SOURCE: {url}")

    try:
        response = httpx.get(jina_url, timeout=30)
        content = response.text[:5000]  # Limit for LLM

        # Check for blocked/error content
        if is_blocked_content(content):
            if debug_mode:
                print(f"⚠️ Content blocked or unavailable")
            return {
                "url": url,
                "domain": domain,
                "is_reachable": False,
                "error": "Content blocked or unavailable",
                "credibility_score": 0,
                "is_user_provided": True,
                "content": "",
            }

        credibility = get_credibility_score(domain)

        if debug_mode:
            print(f"✅ Analyzed ({credibility}/5 credibility)")

        return {
            "url": url,
            "title": "",  # Will be extracted from content by LLM
            "domain": domain,
            "credibility_score": credibility,
            "is_user_provided": True,
            "is_reachable": True,
            "content": content,  # For LLM to summarize
        }
    except Exception as e:
        if debug_mode:
            print(f"❌ ANALYZE ERROR: {str(e)}")
        return {
            "url": url,
            "domain": domain,
            "is_reachable": False,
            "error": str(e),
            "credibility_score": 0,
            "is_user_provided": True,
            "content": "",
        }
