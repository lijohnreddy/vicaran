"""
Data models for the Vicaran investigation agent system.
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

# =============================================================================
# INVESTIGATION REQUEST MODELS
# =============================================================================


class InvestigationRequest(BaseModel):
    """User request for investigation."""

    topic: str = Field(..., description="Topic or claim to investigate")
    mode: Literal["quick", "detailed"] = Field(
        default="quick", description="Investigation mode"
    )
    user_sources: list[str] = Field(
        default_factory=list, description="User-provided source URLs"
    )
    focus_areas: list[str] | None = Field(
        default=None, description="Specific areas to focus on"
    )


class InvestigationConfig(BaseModel):
    """Configuration for an investigation run."""

    investigation_id: str = Field(..., description="Unique investigation ID")
    mode: Literal["quick", "detailed"] = Field(
        default="quick", description="Investigation mode"
    )
    skip_timeline: bool = Field(
        default=True, description="Skip timeline construction (Quick mode)"
    )
    bias_level: Literal["overall", "per_source"] = Field(
        default="overall", description="Bias analysis level"
    )
    source_limit: int = Field(default=15, description="Maximum sources to analyze")


# =============================================================================
# SOURCE MODELS
# =============================================================================


class Source(BaseModel):
    """Discovered source from investigation."""

    url: str = Field(..., description="Source URL")
    title: str = Field(..., description="Source title")
    summary: str = Field(..., description="Source summary (max 500 chars)")
    credibility_score: int = Field(
        default=3, ge=1, le=5, description="Credibility score (1-5 stars)"
    )
    key_claims: list[str] = Field(
        default_factory=list, description="Key claims from this source"
    )
    domain: str = Field(default="", description="Source domain")
    is_reachable: bool = Field(default=True, description="Whether content was fetched")
    source_id: str | None = Field(default=None, description="Database ID after save")


# =============================================================================
# CLAIM MODELS
# =============================================================================


class Claim(BaseModel):
    """Extracted claim from sources."""

    claim_text: str = Field(..., description="The claim text")
    source_ids: list[str] = Field(
        default_factory=list, description="Source IDs supporting this claim"
    )
    importance_score: float = Field(
        default=0.5, ge=0.0, le=1.0, description="Importance score (0-1)"
    )
    claim_id: str | None = Field(default=None, description="Database ID after save")


class FactCheck(BaseModel):
    """Fact check result for a claim."""

    claim_id: str = Field(..., description="ID of the claim being verified")
    verdict: Literal["VERIFIED", "PARTIALLY_TRUE", "FALSE", "UNVERIFIED"] = Field(
        ..., description="Verification verdict"
    )
    evidence_summary: str = Field(..., description="Summary of supporting evidence")
    confidence_score: float = Field(
        default=0.5, ge=0.0, le=1.0, description="Confidence in verdict"
    )
    fact_check_id: str | None = Field(
        default=None, description="Database ID after save"
    )


# =============================================================================
# BIAS ANALYSIS MODELS
# =============================================================================


class BiasAnalysis(BaseModel):
    """Bias analysis result."""

    score: float = Field(..., ge=0.0, le=10.0, description="Overall bias score (0-10)")
    interpretation: str = Field(..., description="Bias interpretation")
    pro_count: int = Field(default=0, description="Number of pro-topic sources")
    neutral_count: int = Field(default=0, description="Number of neutral sources")
    critical_count: int = Field(default=0, description="Number of critical sources")
    recommendation: str = Field(default="", description="Recommendation for balance")
    bias_id: str | None = Field(default=None, description="Database ID after save")


# =============================================================================
# TIMELINE MODELS
# =============================================================================


class TimelineEvent(BaseModel):
    """Event in investigation timeline."""

    event_date: str = Field(..., description="Event date (ISO format YYYY-MM-DD)")
    event_text: str = Field(..., description="Event description (max 200 chars)")
    source_ids: list[str] = Field(
        default_factory=list, description="Source IDs mentioning this event"
    )
    event_id: str | None = Field(default=None, description="Database ID after save")


# =============================================================================
# SESSION STATE MODEL
# =============================================================================


class InvestigationSessionState(BaseModel):
    """Session state for agent communication."""

    # Investigation context
    investigation_id: str = Field(..., description="Investigation ID")
    investigation_config: InvestigationConfig | None = Field(
        default=None, description="Investigation configuration"
    )
    investigation_plan: str = Field(
        default="", description="Generated investigation plan"
    )

    # Agent outputs (stored via output_key)
    discovered_sources: str = Field(default="", description="Source finder output")
    extracted_claims: str = Field(default="", description="Claim extractor output")
    fact_check_results: str = Field(default="", description="Fact checker output")
    bias_analysis: str = Field(default="", description="Bias analyzer output")
    timeline_events: str = Field(default="", description="Timeline builder output")
    investigation_summary: str = Field(default="", description="Summary writer output")

    # ID maps for cross-agent reference
    source_id_map: list[dict] = Field(
        default_factory=list, description="Map of saved source IDs"
    )
    claim_id_map: list[dict] = Field(
        default_factory=list, description="Map of saved claim IDs"
    )

    # Metadata
    created_at: datetime = Field(
        default_factory=datetime.now, description="Session creation time"
    )
