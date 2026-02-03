"""
Research Pipeline agent that executes the complete competitor analysis workflow.
"""

from google.adk.agents import SequentialAgent

from ..iterative_refinement_loop.agent import iterative_refinement_loop
from ..report_composer.agent import report_composer_agent
from ..section_planner.agent import section_planner_agent
from ..section_researcher.agent import section_researcher_agent

# --- RESEARCH PIPELINE AGENT ---
research_pipeline = SequentialAgent(
    name="research_pipeline",
    description="Executes approved research plans through structured workflow: section planning → data collection → quality assurance → report generation",
    sub_agents=[
        section_planner_agent,  # 1. Breaks down research plan into executable sections
        section_researcher_agent,  # 2. Executes research using google_search with source tracking
        iterative_refinement_loop,  # 3. Quality assurance through iterative improvement loop
        report_composer_agent,  # 4. Generates final comprehensive report with citations
    ],
)
