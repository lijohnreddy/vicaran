"""
Configuration management for the competitor analysis agent.
"""

from typing import Any

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class CompetitorAnalysisConfig(BaseSettings):
    """Configuration for the competitor analysis agent system."""

    model_config = SettingsConfigDict(
        env_file=[".env", ".env.local"],  # Load both files
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Google Cloud Configuration
    google_cloud_project: str = Field(default="", description="Google Cloud project ID")
    google_cloud_location: str = Field(
        default="us-central1", description="Google Cloud location"
    )

    # Database Configuration
    database_url: str = Field(default="", description="PostgreSQL database URL")

    # Agent Configuration
    agent_name: str = Field(
        default="competitor_analysis_agent", description="Agent name"
    )
    model: str = Field(default="gemini-2.5-flash", description="AI model to use")

    # Research Configuration
    max_iterations: int = 3  # Maximum iterations for validation loops

    def get_database_url(self) -> str:
        """Get PostgreSQL database URL from configuration."""
        if not self.database_url:
            raise ValueError(
                "DATABASE_URL environment variable is required. "
                "Please set it to your PostgreSQL connection string."
            )
        return self.database_url

    def validate_required_settings(self) -> dict[str, Any]:
        """Validate configuration and return status."""
        missing: list[str] = []
        warnings: list[str] = []

        # Required settings
        if not self.database_url:
            missing.append("DATABASE_URL")

        # Warnings for optional but recommended settings
        if not self.google_cloud_project:
            warnings.append(
                "GOOGLE_CLOUD_PROJECT not set - Google Cloud features may not work"
            )

        return {
            "valid": len(missing) == 0,
            "missing": missing,
            "warnings": warnings,
            "config": {
                "agent_name": self.agent_name,
                "model": self.model,
            },
        }

    def fail_fast_validation(self) -> None:
        """Validate required configuration and fail immediately if missing."""
        validation_result = self.validate_required_settings()

        if not validation_result["valid"]:
            missing_vars = validation_result["missing"]
            error_msg = (
                f"CRITICAL: Missing required environment variables: {', '.join(missing_vars)}\n\n"
                "These values are required for the ADK agent to function:\n"
            )

            for var in missing_vars:
                if var == "DATABASE_URL":
                    error_msg += f"  • {var}: PostgreSQL connection string\n"
                else:
                    error_msg += f"  • {var}: Required configuration value\n"

            error_msg += (
                "\nPlease set these environment variables and restart the service."
            )
            raise ValueError(error_msg)


# Global configuration instance
config = CompetitorAnalysisConfig()

# Validate on import
config.fail_fast_validation()
