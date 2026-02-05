"""
Custom types for the competitor analysis agent.
"""

from typing import Literal

from pydantic import BaseModel, Field


class Feedback(BaseModel):
    """
    Feedback model for user interactions.
    """

    feedback_id: str = Field(..., description="Unique ID for the feedback")
    rating: Literal["positive", "negative"] = Field(
        ..., description="User feedback rating"
    )
    comment: str | None = Field(default=None, description="User comment")
