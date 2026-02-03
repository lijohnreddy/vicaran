"""
Data processing tools for cleaning and validation of research data.
"""

from ..models import CompetitorData, ValidationResult


def clean_search_results(raw_results: list[dict[str, str]]) -> list[dict[str, str]]:
    """
    Clean and normalize search results.

    Args:
        raw_results: Raw search results from web search

    Returns:
        Cleaned and normalized search results
    """

    cleaned_results = []

    for result in raw_results:
        # Basic cleaning: remove empty fields, normalize URLs
        cleaned_result = {
            "title": result.get("title", "").strip(),
            "url": result.get("url", "").strip(),
            "snippet": result.get("snippet", "").strip(),
        }

        # Only include results with all required fields
        if all(cleaned_result.values()):
            cleaned_results.append(cleaned_result)

    return cleaned_results


def extract_competitor_data(raw_data: dict[str, str]) -> CompetitorData:
    """
    Extract and structure competitor data from raw search results.

    Args:
        raw_data: Raw competitor data from search

    Returns:
        Structured CompetitorData object
    """

    return CompetitorData(
        name=raw_data.get("name", ""),
        website=raw_data.get("website", ""),
        description=raw_data.get("description", ""),
        market_position=raw_data.get("market_position", ""),
        key_features=(
            raw_data.get("key_features", "").split(",")
            if raw_data.get("key_features")
            else []
        ),
        pricing_model=raw_data.get("pricing_model", ""),
        target_customers=(
            raw_data.get("target_customers", "").split(",")
            if raw_data.get("target_customers")
            else []
        ),
        strengths=(
            raw_data.get("strengths", "").split(",")
            if raw_data.get("strengths")
            else []
        ),
        weaknesses=(
            raw_data.get("weaknesses", "").split(",")
            if raw_data.get("weaknesses")
            else []
        ),
        recent_news=[],
        funding_info=raw_data.get("funding_info"),
        employee_count=raw_data.get("employee_count"),
    )


def validate_data_completeness(
    data: dict[str, str], required_fields: list[str]
) -> ValidationResult:
    """
    Validate that required data fields are present and complete.

    Args:
        data: Data to validate
        required_fields: List of required field names

    Returns:
        ValidationResult with completeness assessment
    """

    missing_fields = []
    data_quality_issues = []

    # Check for missing required fields
    for field in required_fields:
        if field not in data or not data[field]:
            missing_fields.append(field)

    # Check for data quality issues
    for field, value in data.items():
        if isinstance(value, str) and len(value.strip()) == 0:
            data_quality_issues.append(f"Empty value for field: {field}")
        elif isinstance(value, str) and len(value) < 10:
            data_quality_issues.append(f"Very short content for field: {field}")

    # Calculate completeness score
    total_fields = len(required_fields)
    complete_fields = total_fields - len(missing_fields)
    completeness_score = complete_fields / total_fields if total_fields > 0 else 0.0

    return ValidationResult(
        is_complete=len(missing_fields) == 0,
        missing_data=missing_fields,
        quality_score=completeness_score,
        recommendations=[f"Fill in missing field: {field}" for field in missing_fields],
    )


def merge_data_sources(sources: list[dict[str, str]]) -> dict[str, str]:
    """
    Merge data from multiple sources into a single comprehensive dataset.

    Args:
        sources: List of data dictionaries from different sources

    Returns:
        Merged data dictionary
    """

    merged_data = {}

    for source in sources:
        for key, value in source.items():
            if key not in merged_data:
                merged_data[key] = value
            elif not merged_data[key] and value:
                # Replace empty values with non-empty ones
                merged_data[key] = value

    return merged_data


def deduplicate_results(results: list[dict[str, str]]) -> list[dict[str, str]]:
    """
    Remove duplicate results based on URL or title similarity.

    Args:
        results: List of search results

    Returns:
        Deduplicated list of results
    """

    seen_urls = set()
    seen_titles = set()
    deduplicated = []

    for result in results:
        url = result.get("url", "")
        title = result.get("title", "")

        # Skip if we've seen this URL or very similar title
        if url in seen_urls or title in seen_titles:
            continue

        seen_urls.add(url)
        seen_titles.add(title)
        deduplicated.append(result)

    return deduplicated
