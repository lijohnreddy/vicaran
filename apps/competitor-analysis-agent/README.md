# Competitor Analysis Agent

A comprehensive Google Agent Development Kit (ADK) multi-agent system for competitive intelligence and market research.

## Overview

This agent system follows a structured workflow to analyze competitors and market conditions:

1. **Interactive Planner** - Processes user requirements and research depth
2. **Section Planner** - Creates structured research outline  
3. **Section Researcher** - Executes web searches and data collection
4. **Loop Agent** - Iterative refinement with validation and enhanced search
5. **Report Composer** - Generates professional markdown reports

## Agent Architecture

```
Root Agent (CompetitorAnalysisAgent)
├── Interactive Planner (LlmAgent)
├── Section Planner (LlmAgent)
├── Section Researcher (LlmAgent)
├── Loop Agent (LoopAgent)
│   ├── Data Validator (LlmAgent)
│   ├── Escalation Checker (LlmAgent)
│   └── Enhanced Search Executor (LlmAgent)
└── Report Composer (LlmAgent)
```

## Setup

### Prerequisites

- Python 3.10+
- Google Cloud SDK configured
- UV package manager

### Installation

1. **Install dependencies:**
   ```bash
   cd apps/competitor-analysis-agent
   uv sync
   ```

2. **Configure environment:**
   ```bash
   cp env.template .env.local
   # Edit .env.local with your configuration
   ```

3. **Set up Google Cloud authentication:**
   ```bash
   gcloud auth application-default login
   ```

## Usage

### Run the Agent

```bash
# Run the agent locally
adk run .

# Deploy to Google Cloud Agent Engine
python agent_engine_app.py
```

### Example Usage

```python
# Example research request
research_request = {
    "target_market": "AI-powered project management tools",
    "research_depth": "standard",
    "specific_focus": "pricing and features"
}
```

## Development

### Code Quality

```bash
# Run linting
uv run ruff check .

# Auto-fix issues
uv run ruff check --fix .

# Run type checking
uv run mypy .

# Format code
uv run black .
```

### Testing

```bash
# Run tests
uv run --group test pytest

# Run with coverage
uv run --group test pytest --cov=competitor_analysis_agent
```

## Configuration

Key environment variables:

- `GOOGLE_CLOUD_PROJECT` - Your Google Cloud project ID
- `MODEL` - AI model to use (default: gemini-2.5-flash)
- `GOOGLE_SEARCH_API_KEY` - Google Search API key
- `MAX_ITERATIONS` - Maximum loop iterations for refinement

## License

Copyright © 2024 ShipKit 
