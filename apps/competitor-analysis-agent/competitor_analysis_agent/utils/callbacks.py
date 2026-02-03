"""
Shared callback functions for the competitor analysis agent system.
"""

import logging
import re
from datetime import datetime, timezone

from google.adk.agents.callback_context import CallbackContext
from google.adk.models.llm_response import LlmResponse
from google.genai import types as genai_types


def prep_state_callback(callback_context: CallbackContext) -> None:
    """
    Prepares session state with essential information before agent execution.

    This callback ensures that current date and research period are always available
    for any agent that needs them (especially report_composer).

    Args:
        callback_context (CallbackContext): ADK callback context containing session and state access
    """
    current_date = datetime.now(timezone.utc)

    # Inject formatted date strings into session state
    callback_context.state["current_date"] = current_date.strftime("%B %d, %Y")
    callback_context.state["research_period"] = (
        f"{current_date.strftime('%B')} {current_date.year}"
    )


def collect_research_sources_callback(callback_context: CallbackContext) -> None:
    """
    Collects and organizes web-based research sources and their supported claims from agent events.

    This callback processes ADK session events to extract grounding metadata from google_search
    operations, creating structured source tracking with short IDs for citation generation.
    Based on the proven Gemini fullstack implementation pattern for source collection.

    Args:
        callback_context (CallbackContext): ADK callback context containing session and state access
    """
    session = callback_context._invocation_context.session
    url_to_short_id = callback_context.state.get("url_to_short_id", {})
    sources = callback_context.state.get("sources", {})
    id_counter = len(url_to_short_id) + 1

    # Process all session events to find grounding metadata from google_search operations
    for event in session.events:
        # Skip events without grounding metadata
        if not (event.grounding_metadata and event.grounding_metadata.grounding_chunks):
            continue

        # Extract web sources from grounding chunks
        for chunk in event.grounding_metadata.grounding_chunks:
            if not chunk.web:
                continue

            url = chunk.web.uri
            title = (
                chunk.web.title
                if chunk.web.title != chunk.web.domain
                else chunk.web.domain
            )

            # Create new source entry if URL not already tracked
            if url not in url_to_short_id:
                short_id = f"src-{id_counter}"
                url_to_short_id[url] = short_id
                sources[short_id] = {
                    "id": short_id,
                    "title": title,
                    "url": url,
                    "domain": chunk.web.domain,
                    "supportedClaims": [],  # For future enhancement with claim attribution
                }
                id_counter += 1

    # Save updated source tracking to session state for report composer access
    callback_context.state["url_to_short_id"] = url_to_short_id
    callback_context.state["sources"] = sources


def citation_model_callback(
    callback_context: CallbackContext, llm_response: LlmResponse
) -> LlmResponse | None:
    """
    Replaces citation tags with Markdown links directly in the model response.

    This after_model_callback processes the LLM response text and converts tags like
    `<cite source="src-N"/>` into hyperlinks using source information from session state.

    Args:
        callback_context (CallbackContext): ADK callback context with session and state access
        llm_response (LlmResponse): The LLM response to process

    Returns:
        LlmResponse | None: Modified response with citations replaced, or None for original
    """
    agent_name = callback_context.agent_name
    logging.info(f"[Citation Model] Processing citations for agent: {agent_name}")

    # Only process report_composer responses
    if agent_name != "report_composer":
        return None

    # Extract text content from response
    if not (llm_response.content and llm_response.content.parts):
        logging.warning("[Citation Model] No content parts found in LLM response")
        return None

    # Get text content
    text_content = ""
    for part in llm_response.content.parts:
        if part.text:
            text_content = part.text
            break
        elif part.function_call:
            logging.debug("[Citation Model] Skipping function call response")
            return None

    if not text_content.strip():
        return None

    # Get sources from session state
    sources = callback_context.state.get("sources", {})

    # Replace citation tags with markdown links
    def tag_replacer(match: re.Match) -> str:
        short_id = match.group(1)
        if not (source_info := sources.get(short_id)):
            logging.warning(f"Invalid citation tag found and removed: {match.group(0)}")
            return ""
        display_text = source_info.get("title", source_info.get("domain", short_id))
        return f" [{display_text}]({source_info['url']})"

    processed_text = re.sub(
        r'<cite\s+source\s*=\s*["\']?\s*(src-\d+)\s*["\']?\s*/>',
        tag_replacer,
        text_content,
    )

    # Fix spacing around punctuation
    processed_text = re.sub(r"\s+([.,;:])", r"\1", processed_text)

    # Create modified response if text was changed
    if processed_text != text_content:
        logging.info(
            "[Citation Model] Citations processed, returning modified response"
        )
        try:
            modified_parts = [genai_types.Part(text=processed_text)]

            modified_response = LlmResponse(
                content=genai_types.Content(role="model", parts=modified_parts),
                grounding_metadata=llm_response.grounding_metadata,
            )

            return modified_response
        except Exception as e:
            logging.error(f"[Citation Model] Error creating modified response: {e}")
            return None

    logging.info("[Citation Model] No citations found, using original response")
    return None
