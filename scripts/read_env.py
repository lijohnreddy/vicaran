#!/usr/bin/env python3
"""
Cross-platform utility to read environment variables from .env files.

This script replaces Unix-specific grep commands with a Python solution
that works on Windows, Mac, and Linux.

Usage:
    # Show full line (like grep)
    python scripts/read_env.py apps/web/.env.local GOOGLE_CLOUD_PROJECT_ID
    Output: GOOGLE_CLOUD_PROJECT_ID=my-project-123

    # Show only value (like grep | cut -d'=' -f2)
    python scripts/read_env.py apps/web/.env.local GOOGLE_CLOUD_PROJECT_ID --value-only
    Output: my-project-123
"""

import sys
from pathlib import Path


def strip_quotes(value: str) -> str:
    """Remove surrounding quotes from a value if present.

    Handles both single quotes ('value') and double quotes ("value").

    Args:
        value: The string value to strip quotes from

    Returns:
        The value without surrounding quotes
    """
    value = value.strip()

    # Check if value is surrounded by quotes
    if len(value) >= 2:
        if (value.startswith('"') and value.endswith('"')) or \
           (value.startswith("'") and value.endswith("'")):
            return value[1:-1]

    return value


def read_env_variable(file_path: str, variable_name: str, value_only: bool = False) -> str | None:
    """Read a specific variable from an environment file.

    Args:
        file_path: Path to the .env file
        variable_name: Name of the environment variable to find
        value_only: If True, return only the value; if False, return the full line

    Returns:
        The full line or value if found, None otherwise

    Raises:
        FileNotFoundError: If the environment file doesn't exist
    """
    env_file = Path(file_path)

    if not env_file.exists():
        raise FileNotFoundError(f"Environment file not found: {file_path}")

    # Read the file and search for the variable
    with open(env_file, encoding='utf-8') as f:
        for line in f:
            line = line.strip()

            # Skip empty lines and comments
            if not line or line.startswith('#'):
                continue

            # Check if this line contains our variable
            if line.startswith(f"{variable_name}="):
                if value_only:
                    # Return only the value part (everything after '=')
                    # Strip quotes if present (handles "value", 'value', and value)
                    raw_value = line.split('=', 1)[1] if '=' in line else ""
                    return strip_quotes(raw_value)
                else:
                    # Return the full line (like grep)
                    return line

    # Variable not found
    return None


def main() -> int:
    """Main entry point for the script."""
    # Check arguments
    if len(sys.argv) < 3:
        print("Error: Missing required arguments", file=sys.stderr)
        print("\nUsage:", file=sys.stderr)
        print(f"  {sys.argv[0]} <file_path> <variable_name> [--value-only]", file=sys.stderr)
        print("\nExamples:", file=sys.stderr)
        print(f"  {sys.argv[0]} apps/web/.env.local GOOGLE_CLOUD_PROJECT_ID", file=sys.stderr)
        print(f"  {sys.argv[0]} apps/web/.env.local GOOGLE_CLOUD_PROJECT_ID --value-only", file=sys.stderr)
        return 1

    file_path = sys.argv[1]
    variable_name = sys.argv[2]
    value_only = "--value-only" in sys.argv or "-v" in sys.argv

    try:
        result = read_env_variable(file_path, variable_name, value_only)

        if result is None:
            print(f"Error: Variable '{variable_name}' not found in {file_path}", file=sys.stderr)
            return 1

        # Print the result
        print(result)
        return 0

    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1
    except Exception as e:
        print(f"Error: Unexpected error occurred: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
