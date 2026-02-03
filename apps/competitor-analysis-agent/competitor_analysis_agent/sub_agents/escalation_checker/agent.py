"""
Custom escalation checker agent for controlling loop termination based on quality criteria.
"""

from collections.abc import AsyncGenerator

from google.adk.agents import BaseAgent
from google.adk.agents.invocation_context import InvocationContext
from google.adk.events import Event, EventActions


class EscalationChecker(BaseAgent):
    """Custom agent for controlling loop termination based on quality criteria."""

    def __init__(self, name: str):
        super().__init__(name=name)

    async def _run_async_impl(
        self, ctx: InvocationContext
    ) -> AsyncGenerator[Event, None]:
        """Check if research quality meets standards and control loop escalation."""
        evaluation = ctx.session.state.get("evaluation_result")

        # Check termination conditions based on evaluation grade
        should_escalate = False
        escalation_reason = ""

        if evaluation and evaluation.get("grade") == "pass":
            should_escalate = True
            escalation_reason = "Research quality standards met"
        else:
            escalation_reason = "Continuing refinement loop for quality improvement"

        if should_escalate:
            # Log escalation reason
            ctx.session.state["escalation_reason"] = escalation_reason

            # Escalate to exit loop
            yield Event(
                author=self.name,
                actions=EventActions(escalate=True),
            )
        else:
            # Continue loop - LoopAgent will handle max_iterations automatically
            yield Event(
                author=self.name,
            )


# Create the escalation checker instance
escalation_checker = EscalationChecker(name="escalation_checker")
