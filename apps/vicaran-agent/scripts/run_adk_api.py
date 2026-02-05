#!/usr/bin/env python3
"""
Platform-agnostic script to run ADK API server with .env.local configuration.
"""

import os
import subprocess
import sys
from pathlib import Path


def load_env_file(env_file: Path) -> dict[str, str]:
    """Load environment variables from a .env file."""
    env_vars: dict[str, str] = {}

    if not env_file.exists():
        print(f"Warning: {env_file} not found")
        return env_vars

    with open(env_file, encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()

            # Skip empty lines and comments
            if not line or line.startswith("#"):
                continue

            # Parse KEY=VALUE format
            if "=" not in line:
                print(f"Warning: Invalid line {line_num} in {env_file}: {line}")
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip()

            # Remove quotes if present
            if (value.startswith('"') and value.endswith('"')) or (
                value.startswith("'") and value.endswith("'")
            ):
                value = value[1:-1]

            env_vars[key] = value

    return env_vars


def main() -> None:
    """Main function to run ADK API server."""
    script_dir = Path(__file__).parent.parent  # Go up to competitor-analysis-agent/
    env_file = script_dir / ".env.local"

    # Load environment variables
    env_vars = load_env_file(env_file)

    # Get DATABASE_URL from environment
    database_url = env_vars.get("DATABASE_URL") or os.getenv("DATABASE_URL")
    if not database_url:
        print("Error: DATABASE_URL not found in .env.local or environment variables")
        sys.exit(1)

    # Prepare environment for subprocess
    env = os.environ.copy()
    env.update(env_vars)

    # Build command
    cmd = [
        "uv",
        "run",
        "adk",
        "api_server",
        f"--session_service_uri={database_url}",
        "--port=8000",
        "--reload",
        ".",
    ]

    # Allow overriding port and host via command line arguments
    if len(sys.argv) > 1:
        for arg in sys.argv[1:]:
            if arg.startswith("--"):
                cmd.append(arg)

    print("--- Starting ADK API server ---")

    try:
        # Run the command
        result = subprocess.run(cmd, cwd=script_dir, env=env, check=False)
        sys.exit(result.returncode)

    except KeyboardInterrupt:
        print("\nShutting down ADK API server...")
        sys.exit(0)
    except Exception as e:
        print(f"Error running ADK API server: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
