"""
Data models for the competitor analysis agent system.
"""

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class ResearchRequest(BaseModel):
    """User request for competitor analysis."""

    target_market: str = Field(..., description="Target market or industry to analyze")
    research_depth: Literal["basic", "standard", "comprehensive"] = Field(
        default="standard", description="Depth of research required"
    )
    competitor_list: list[str] | None = Field(
        default=None, description="Specific competitors to analyze"
    )
    specific_focus: str | None = Field(
        default=None,
        description="Specific areas to focus on (e.g., 'pricing', 'features')",
    )
    max_competitors: int | None = Field(
        default=5, description="Maximum number of competitors to analyze"
    )
    include_swot: bool = Field(
        default=True, description="Include SWOT analysis in the report"
    )
    include_pricing: bool = Field(
        default=True, description="Include pricing matrix in the report"
    )


class CompetitorData(BaseModel):
    """Data structure for individual competitor information."""

    name: str = Field(..., description="Company name")
    website: str = Field(..., description="Primary website URL")
    description: str = Field(..., description="Company description")
    market_position: str = Field(..., description="Market position and positioning")
    key_features: list[str] = Field(
        default_factory=list, description="Key product/service features"
    )
    pricing_model: str = Field(..., description="Pricing strategy and model")
    target_customers: list[str] = Field(
        default_factory=list, description="Target customer segments"
    )
    strengths: list[str] = Field(
        default_factory=list, description="Competitive strengths"
    )
    weaknesses: list[str] = Field(
        default_factory=list, description="Identified weaknesses"
    )
    recent_news: list[str] = Field(
        default_factory=list, description="Recent company news and updates"
    )
    funding_info: str | None = Field(
        default=None, description="Funding information if available"
    )
    employee_count: str | None = Field(
        default=None, description="Company size information"
    )


class MarketAnalysis(BaseModel):
    """Market size and analysis data."""

    market_size: str = Field(..., description="Total addressable market size")
    growth_rate: str = Field(..., description="Market growth rate")
    key_trends: list[str] = Field(default_factory=list, description="Key market trends")
    market_segments: list[str] = Field(
        default_factory=list, description="Market segments"
    )
    market_drivers: list[str] = Field(
        default_factory=list, description="Key market drivers"
    )
    market_challenges: list[str] = Field(
        default_factory=list, description="Market challenges and barriers"
    )


class ResearchOutline(BaseModel):
    """Structured research plan from Section Planner."""

    target_market: str = Field(..., description="Target market being analyzed")
    research_depth: str = Field(..., description="Depth of research")
    competitor_list: list[str] = Field(
        default_factory=list, description="List of competitors to analyze"
    )
    research_sections: list[str] = Field(
        default_factory=list, description="Research sections to complete"
    )
    timeline_days: int = Field(default=7, description="Timeline for research")
    sections: list[str] = Field(
        default_factory=list, description="Research sections to complete"
    )
    research_questions: list[str] = Field(
        default_factory=list, description="Key research questions to answer"
    )
    search_queries: list[str] = Field(
        default_factory=list, description="Initial search queries to execute"
    )
    expected_deliverables: list[str] = Field(
        default_factory=list, description="Expected research outputs"
    )


class ValidationResult(BaseModel):
    """Result from data validation agent."""

    is_complete: bool = Field(..., description="Whether the data is complete")
    missing_data: list[str] = Field(
        default_factory=list, description="Missing data elements"
    )
    quality_score: float = Field(default=0.0, description="Data quality score (0-1)")
    recommendations: list[str] = Field(
        default_factory=list, description="Recommendations for improvement"
    )
    # Legacy fields for backward compatibility
    is_valid: bool = Field(
        default=True, description="Whether the data is valid and complete"
    )
    missing_fields: list[str] = Field(
        default_factory=list, description="Missing required fields"
    )
    data_quality_issues: list[str] = Field(
        default_factory=list, description="Data quality issues found"
    )
    completeness_score: float = Field(
        default=0.0, description="Completeness score (0-1)"
    )


class EscalationDecision(BaseModel):
    """Decision from escalation checker agent."""

    needs_enhanced_search: bool = Field(
        ..., description="Whether enhanced search is needed"
    )
    search_priority: str = Field(..., description="Priority level for enhanced search")
    additional_queries: list[str] = Field(
        default_factory=list, description="Additional search queries needed"
    )
    # Legacy fields for backward compatibility
    should_escalate: bool = Field(
        default=False, description="Whether to escalate to enhanced search"
    )
    escalation_reason: str = Field(
        default="", description="Reason for escalation or not escalating"
    )
    priority_areas: list[str] = Field(
        default_factory=list, description="Priority areas for enhanced search"
    )
    search_strategies: list[str] = Field(
        default_factory=list, description="Recommended search strategies"
    )


class CompetitorAnalysisResult(BaseModel):
    """Complete competitor analysis result."""

    market_analysis: str = Field(..., description="Market analysis summary")
    competitor_profiles: list[CompetitorData] = Field(
        default_factory=list, description="Competitor profiles"
    )
    pricing_matrix: dict[str, Any] = Field(
        default_factory=dict, description="Pricing comparison matrix"
    )
    swot_analysis: dict[str, Any] = Field(
        default_factory=dict, description="SWOT analysis"
    )
    recommendations: list[str] = Field(
        default_factory=list, description="Strategic recommendations"
    )
    data_sources: list[str] = Field(
        default_factory=list, description="Data sources used"
    )
    generated_at: str = Field(..., description="Generation timestamp")

    # Legacy fields for backward compatibility
    target_market: str = Field(default="", description="Analyzed target market")
    research_timestamp: datetime | None = Field(
        default=None, description="When analysis was conducted"
    )
    research_depth: str = Field(
        default="standard", description="Depth of research conducted"
    )
    top_competitors: list[CompetitorData] = Field(
        default_factory=list, description="Top competitors analyzed"
    )
    feature_matrix: dict[str, list[str]] = Field(
        default_factory=dict, description="Feature comparison matrix"
    )
    competitive_positioning: dict[str, str] = Field(
        default_factory=dict, description="Competitive positioning map"
    )
    opportunities: list[str] = Field(
        default_factory=list, description="Identified market opportunities"
    )
    threats: list[str] = Field(
        default_factory=list, description="Identified market threats"
    )
    confidence_score: float = Field(
        default=0.0, description="Confidence score of the analysis (0-1)"
    )
    limitations: list[str] = Field(
        default_factory=list, description="Known limitations of the analysis"
    )


class SessionState(BaseModel):
    """Session state for agent communication."""

    # Research context
    research_request: ResearchRequest | None = Field(
        default=None, description="Original research request"
    )
    research_outline: ResearchOutline | None = Field(
        default=None, description="Research outline from Section Planner"
    )

    # Search results
    search_results: dict[str, Any] = Field(
        default_factory=dict, description="Search results from search agent"
    )

    # Collected data
    raw_search_results: list[dict] = Field(
        default_factory=list, description="Raw search results"
    )
    processed_data: dict[str, Any] = Field(
        default_factory=dict, description="Processed research data"
    )

    # Validation and refinement
    validation_results: list[ValidationResult] = Field(
        default_factory=list, description="Data validation results"
    )
    escalation_decisions: list[EscalationDecision] = Field(
        default_factory=list, description="Escalation decisions"
    )

    # Final results
    analysis_result: CompetitorAnalysisResult | None = Field(
        default=None, description="Final analysis result"
    )

    # Metadata
    current_iteration: int = Field(default=0, description="Current loop iteration")
    agent_history: list[str] = Field(
        default_factory=list, description="History of agent executions"
    )
    progress_log: list[str] = Field(
        default_factory=list, description="Progress log messages"
    )
    error_log: list[str] = Field(default_factory=list, description="Error log")
