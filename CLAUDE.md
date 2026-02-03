# Project Overview
This is a Google Agent Development Kit (ADK) SaaS template featuring:
- Next.js 15 web application for chat interface
- Google ADK-powered competitor analysis agent system
- Real-time streaming chat with agent responses
- Multi-agent architecture with specialized sub-agents
- Session state management and workflow orchestration

# Technology Stack
## Frontend (apps/web)
- Framework: Next.js 15 with App Router
- Language: TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Database: Supabase + Drizzle ORM
- Authentication: Supabase Auth
- Chat Interface: Real-time streaming with agent progress tracking

## Backend (apps/competitor-analysis-agent)
- Framework: Google Agent Development Kit (ADK)
- Language: Python 3.10+ with uv package management
- Agent Types: LlmAgent, SequentialAgent, ParallelAgent, LoopAgent
- Models: Gemini 2.5 Flash/Pro for LLM reasoning
- Tools: Built-in tools (google_search, code_execution), function tools
- Deployment: Google Cloud Agent Engine with AgentOps monitoring
- Session Management: InMemorySessionService with session state flow

# Development Commands
```bash
# Root-level commands (recommended)
npm run install      # Install dependencies for both apps
npm run dev          # Start both frontend and API development servers
npm run dev:frontend # Start frontend development server only
npm run dev:api      # Start API development server only
npm run adk:web      # Start ADK web interface

# Per-app commands (if needed)
cd apps/web
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # Type checking

# ADK agent system
cd apps/competitor-analysis-agent
uv run app.py        # Start agent server
uv run python -m competitor_analysis_agent  # Alternative execution
```

# Code Style & Conventions
## Frontend (Next.js/TypeScript)
- Use TypeScript strict mode with complete type annotations
- Prefer functional components with hooks
- Use server actions for data mutations
- Follow shadcn/ui component patterns
- Always run `npm run typecheck` after changes

## Backend (ADK/Python)
- Use type hints and Pydantic models
- Follow ADK patterns: LlmAgent, SequentialAgent, ParallelAgent, LoopAgent
- Session state communication via `output_key` and `{placeholder}` patterns
- Built-in tools: one per agent maximum (google_search, code_execution)
- Function tools: multiple allowed per agent
- Always export agents with `root_agent = my_agent` pattern

# Project Structure
- `apps/web/` - Next.js frontend with real-time chat interface
- `apps/competitor-analysis-agent/` - ADK agent system with multi-agent workflow
  - `agent.py` - Root agent (orchestrator)
  - `sub_agents/` - Specialized agents for different tasks
  - `agent_engine_app.py` - ADK application runner
- `ai_docs/` - AI-generated documentation and task tracking
- `ai_docs/templates/` - Task templates (task_template.md, python_task_template.md, adk_task_template.md)

# ADK-Specific Patterns
- Root agent acts as human consultant - gathers context and delegates
- Session state flows through agents via `output_key` -> `{placeholder}` pattern
- Agent hierarchy: Root -> SequentialAgent -> specialized sub-agents
- Quality loops use LoopAgent with Action-Critic-Checker pattern
- Universal design principles - avoid domain-specific hardcoding

# Important Notes
- Agent responses stream through SSE to frontend
- Session state management critical for agent-to-agent communication
- Follow workflow documents for session state key naming
- Use Google Cloud authentication for Vertex AI/Gemini models
- All agents must export as `root_agent` for ADK system discovery

# Coding Standards & Best Practices

## TypeScript/Next.js Rules
- **Type Safety**: Never use `any` type - use specific types, `Union` types, or `TypedDict`
- **Next.js 15**: `params` and `searchParams` are Promises - always `await` them before use
- **Server/Client Separation**: Never mix server-only imports (`next/headers`, `@/lib/supabase/server`) with client-safe utilities
- **shadcn/ui**: Always prefer shadcn components over custom UI - check existing `@/components/ui/` first
- **Client Components**: Use `'use client'` directive when needed, but avoid async client components
- **Return Types**: Explicit return types required for all functions
- **Drizzle ORM**: Use type-safe operators (`eq`, `inArray`, `and`, `or`) instead of raw SQL

## Python/ADK Rules  
- **Type Annotations**: Complete type annotations required for all variables, functions, and parameters
- **No `Any` Type**: Use specific types from libraries (e.g., `from google.genai.types import File`)
- **Package Management**: Always use `uv` commands, never `pip install` directly
- **Google AI**: Primary: `google-genai>=1.24.0`, Fallback: `vertexai>=1.38.0` (embeddings only)
- **Dependencies**: Add to `pyproject.toml` then run `uv sync`, use dependency groups (`dev`, `test`, `lint`)
- **Modern Syntax**: Use Python 3.10+ syntax (`dict[str, int]`, `list[str]`, `str | None`)
- **Exception Chaining**: Use `raise ... from e` for proper exception chaining
- **Function Returns**: Always provide return type annotations, including `-> None`

## Database & Infrastructure
- **Drizzle Migrations**: Create down migrations before running `npm run db:migrate`
- **Environment**: Use `@/lib/config` over `os.getenv()` for configuration
- **Authentication**: Use Google Cloud SDK authentication patterns
- **File Management**: Always clean up uploaded files with `client.files.delete()`

## Code Quality Standards
- **No ESLint Disables**: Fix issues instead of disabling rules
- **No Type Ignores**: Address type issues properly instead of ignoring
- **Early Returns**: Use early returns to reduce nesting
- **Async/Await**: Use async/await patterns over Promise chains
- **Commenting**: Minimal comments - code should be self-documenting
- **Line Length**: Python 88 chars, TypeScript follow project standards
- **Clean Imports**: Remove unused imports, use proper import grouping
