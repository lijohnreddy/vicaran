"""
Tavily Search tool for web search during investigations.
"""

import os
from typing import TypedDict

import httpx
from google.adk.tools import ToolContext


class SearchResult(TypedDict):
    title: str
    url: str
    content: str
    score: float


class SearchResponse(TypedDict):
    success: bool
    answer: str
    results: list[SearchResult]
    query: str
    error: str | None


def tavily_search_tool(
    query: str,
    tool_context: ToolContext,
    max_results: int = 10,
) -> dict:
    """Search the web using Tavily API for investigation sources.

    Args:
        query: Search query string
        tool_context: ADK context for state access (ALWAYS LAST PARAMETER)
        max_results: Maximum number of results to return (default: 10)

    Returns:
        Search results with titles, URLs, and snippets
    """
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return {
            "success": False,
            "error": "TAVILY_API_KEY not configured",
            "answer": "",
            "results": [],
            "query": query,
        }

    api_url = "https://api.tavily.com/search"

    payload = {
        "api_key": api_key,
        "query": query,
        "search_depth": "advanced",
        "include_answer": True,
        "include_raw_content": False,
        "max_results": max_results,
    }

    debug_mode = os.getenv("DEBUG_MODE", "false").lower() == "true"
    if debug_mode:
        print(f"\n🔍 TAVILY SEARCH: {query}")

    try:
        response = httpx.post(api_url, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()

        # Extract relevant fields
        results: list[SearchResult] = []
        for item in result.get("results", []):
            results.append(
                {
                    "title": item.get("title", ""),
                    "url": item.get("url", ""),
                    "content": item.get("content", "")[:500],  # Limit content size
                    "score": item.get("score", 0),
                }
            )

        if debug_mode:
            print(f"✅ Found {len(results)} results")

        return {
            "success": True,
            "answer": result.get("answer", ""),
            "results": results,
            "query": query,
            "error": None,
        }
    except Exception as e:
        if debug_mode:
            print(f"❌ TAVILY ERROR: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "results": [],
            "answer": "",
            "query": query,
        }
