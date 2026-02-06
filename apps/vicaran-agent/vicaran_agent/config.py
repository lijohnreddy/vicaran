"""
Configuration management for the Vicaran investigation agent.
"""

from typing import Any

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class VicearanConfig(BaseSettings):
    """Configuration for the Vicaran investigation agent system."""

    model_config = SettingsConfigDict(
        env_file=[".env", ".env.local"],
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Google Cloud Configuration
    google_cloud_project: str = Field(default="", description="Google Cloud project ID")
    google_cloud_location: str = Field(
        default="us-central1", description="Google Cloud location"
    )

    # API Configuration
    callback_api_url: str = Field(
        default="http://localhost:3000/api/agent-callback",
        description="URL for callback API",
    )
    agent_secret: str = Field(default="", description="Secret for API authentication")

    # Agent Configuration
    agent_name: str = Field(default="vicaran_agent", description="Agent name")
    default_model: str = Field(
        default="gemini-2.5-flash", description="Default AI model"
    )
    reasoning_model: str = Field(
        default="gemini-2.5-pro", description="Model for complex reasoning tasks"
    )

    # Investigation Limits
    quick_mode_source_limit: int = Field(
        default=15, description="Max sources in Quick mode"
    )
    detailed_mode_source_limit: int = Field(
        default=30, description="Max sources in Detailed mode"
    )

    # Debug
    debug_mode: bool = Field(default=False, description="Enable debug logging")

    def validate_required_settings(self) -> dict[str, Any]:
        """Validate configuration and return status."""
        missing: list[str] = []
        warnings: list[str] = []

        # Warnings for optional but recommended settings
        if not self.google_cloud_project:
            warnings.append(
                "GOOGLE_CLOUD_PROJECT not set - Google Cloud features may not work"
            )
        if not self.agent_secret:
            warnings.append("AGENT_SECRET not set - API authentication disabled")

        return {
            "valid": len(missing) == 0,
            "missing": missing,
            "warnings": warnings,
            "config": {
                "agent_name": self.agent_name,
                "default_model": self.default_model,
            },
        }


# Global configuration instance
config = VicearanConfig()
