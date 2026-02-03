"""
Iterative refinement loop for quality assurance through iterative improvement.
"""

from google.adk.agents import LoopAgent

from ...config import config
from ..enhanced_search_executor.agent import enhanced_search_executor_agent
from ..escalation_checker.agent import escalation_checker
from ..research_evaluator.agent import research_evaluator_agent

# --- ITERATIVE REFINEMENT LOOP AGENT ---
iterative_refinement_loop = LoopAgent(
    name="iterative_refinement_loop",
    description="Quality assurance through iterative improvement: evaluation → enhancement → escalation check",
    max_iterations=config.max_iterations,
    sub_agents=[
        research_evaluator_agent,  # 1. Evaluates research quality and identifies gaps
        escalation_checker,  # 2. Controls loop termination based on quality criteria
        enhanced_search_executor_agent,  # 3. Performs deeper research ONLY if loop continues
    ],
)
