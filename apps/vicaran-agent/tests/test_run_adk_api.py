#!/usr/bin/env python3
"""
Tests for the ADK API startup script.
"""

import socket

# Import the function from the script
import sys
from pathlib import Path

import pytest

# Add scripts directory to path
scripts_dir = Path(__file__).parent.parent / "scripts"
sys.path.insert(0, str(scripts_dir))

from run_adk_api import check_port_available, load_env_file


class TestCheckPortAvailable:
    """Tests for the check_port_available function."""

    def test_check_port_available_returns_true_for_free_port(self) -> None:
        """Test that check_port_available returns True when port is free."""
        # Use a random high port that's unlikely to be in use
        result = check_port_available("127.0.0.1", 59999)
        assert result is True

    def test_check_port_available_returns_false_for_bound_port(self) -> None:
        """Test that check_port_available returns False when port is already bound."""
        # Bind a socket first, then check if the function detects it
        test_port = 59998
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(("127.0.0.1", test_port))

        try:
            result = check_port_available("127.0.0.1", test_port)
            assert result is False
        finally:
            sock.close()

    def test_check_port_available_returns_true_after_port_released(self) -> None:
        """Test that port is detected as available after being released."""
        test_port = 59997
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(("127.0.0.1", test_port))

        # Port should be in use
        assert check_port_available("127.0.0.1", test_port) is False

        # Release the port
        sock.close()

        # Port should now be available
        assert check_port_available("127.0.0.1", test_port) is True


class TestLoadEnvFile:
    """Tests for the load_env_file function."""

    def test_load_env_file_returns_empty_dict_for_missing_file(
        self, tmp_path: Path
    ) -> None:
        """Test that load_env_file returns empty dict for non-existent file."""
        result = load_env_file(tmp_path / "nonexistent.env")
        assert result == {}

    def test_load_env_file_parses_simple_key_value(self, tmp_path: Path) -> None:
        """Test parsing simple KEY=VALUE format."""
        env_file = tmp_path / ".env.test"
        env_file.write_text("KEY1=value1\nKEY2=value2\n")

        result = load_env_file(env_file)

        assert result == {"KEY1": "value1", "KEY2": "value2"}

    def test_load_env_file_strips_quotes(self, tmp_path: Path) -> None:
        """Test that quotes are stripped from values."""
        env_file = tmp_path / ".env.test"
        env_file.write_text("KEY1=\"value1\"\nKEY2='value2'\n")

        result = load_env_file(env_file)

        assert result == {"KEY1": "value1", "KEY2": "value2"}

    def test_load_env_file_skips_comments_and_empty_lines(self, tmp_path: Path) -> None:
        """Test that comments and empty lines are skipped."""
        env_file = tmp_path / ".env.test"
        env_file.write_text(
            "# Comment\n\nKEY1=value1\n# Another comment\nKEY2=value2\n"
        )

        result = load_env_file(env_file)

        assert result == {"KEY1": "value1", "KEY2": "value2"}


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
