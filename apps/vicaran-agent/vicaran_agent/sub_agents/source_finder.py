"""
Source Finder agent - discovers additional sources via web search.
"""

from google.adk.agents import LlmAgent

from ..callbacks import batch_save_sources
from ..prompts import SOURCE_FINDER_INSTRUCTION
from ..tools import callback_api_tool, jina_reader_tool, tavily_search_tool

source_finder = LlmAgent(
    name="source_finder",
    model="gemini-2.5-flash",
    instruction=SOURCE_FINDER_INSTRUCTION,
    tools=[tavily_search_tool, jina_reader_tool, callback_api_tool],
    after_agent_callback=batch_save_sources,
    output_key="discovered_sources",
    description="Discovers additional sources via web search based on investigation brief",
)
