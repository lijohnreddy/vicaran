---
trigger: glob
globs: *.py
---

---
trigger: glob
description:
globs: *.py
---
# Python Import Collections.abc Types - Use collections.abc Instead of typing

## Context
Python 3.9+ made built-in collection types generic (PEP 585), deprecating many generic types from the `typing` module. Modern Python code should import generic types like `AsyncGenerator`, `Generator`, `Iterator`, `Coroutine`, etc. from their respective standard library modules instead of `typing`.

Using the old `typing` imports causes linting warnings and goes against modern Python standards. Tools like Ruff (UP035) enforce this pattern for better future compatibility.

**Common Error Messages:**
- `Import from 'collections.abc' instead: 'AsyncGenerator'`
- `Import from 'collections.abc' instead: 'Generator'`
- `Import from 'collections.abc' instead: 'Iterator'`

## Rule
**ALWAYS import generic types from their standard library modules, not from typing:**

1. **Use `collections.abc`** for abstract base classes and generators
2. **Use `typing`** only for types not available elsewhere (Any, Literal, Protocol, etc.)
3. **Follow PEP 585** standards for modern Python type annotations
4. **Update existing imports** when encountered in legacy code

## Import Mappings

### collections.abc Imports
| ❌ Deprecated (typing) | ✅ Modern (collections.abc) |
|---|---|
| `from typing import AsyncGenerator` | `from collections.abc import AsyncGenerator` |
| `from typing import Generator` | `from collections.abc import Generator` |
| `from typing import Iterator` | `from collections.abc import Iterator` |
| `from typing import Iterable` | `from collections.abc import Iterable` |
| `from typing import Coroutine` | `from collections.abc import Coroutine` |
| `from typing import Callable` | `from collections.abc import Callable` |
| `from typing import Mapping` | `from collections.abc import Mapping` |
| `from typing import MutableMapping` | `from collections.abc import MutableMapping` |
| `from typing import Sequence` | `from collections.abc import Sequence` |
| `from typing import MutableSequence` | `from collections.abc import MutableSequence` |

### Keep in typing Module
These should still be imported from `typing`:
- `Any` - for truly unknown types
- `Literal` - for literal value types
- `Protocol` - for structural typing
- `TypeVar` - for generic programming
- `Generic` - for generic classes
- `Union` (though prefer `|` syntax in Python 3.10+)
- `Optional` (though prefer `| None` syntax in Python 3.10+)

## Examples

### ❌ Bad (Legacy typing imports)
```python
from typing import Any, AsyncGenerator, Generator, Iterator, Callable
from datetime import datetime

# Using deprecated imports
async def process_data() -> AsyncGenerator[str, None]:
    yield "data"

def transform_items(items: Iterator[str]) -> Generator[str, None, None]:
    for item in items:
        yield item.upper()

def process_with_callback(callback: Callable[[str], None]) -> None:
    callback("done")
```

### ✅ Good (Modern standard library imports)
```python
from collections.abc import AsyncGenerator, Generator, Iterator, Callable
from typing import Any
from datetime import datetime

# Using modern imports
async def process_data() -> AsyncGenerator[str, None]:
    yield "data"

def transform_items(items: Iterator[str]) -> Generator[str, None, None]:
    for item in items:
        yield item.upper()

def process_with_callback(callback: Callable[[str], None]) -> None:
    callback("done")
```

### Mixed Import Example
```python
# ✅ Good - Mix of collections.abc and typing as appropriate
from collections.abc import AsyncGenerator, Callable, Iterator
from typing import Any, Literal, Protocol
from datetime import datetime

ContentType = Literal["text", "image", "audio"]

class ProcessorProtocol(Protocol):
    def process(self, data: Any) -> str: ...

async def stream_process(
    items: Iterator[str], 
    processor: ProcessorProtocol,
    content_type: ContentType = "text"
) -> AsyncGenerator[str, None]:
    for item in items:
        result = processor.process(item)
        yield f"{content_type}: {result}"
```

## Function Signatures
```python
# ✅ Modern async generator function
from collections.abc import AsyncGenerator

async def run_agent_stream(
    self, request: RunRequest
) -> AsyncGenerator[str, None]:
    """Stream events using Server-Sent Events format."""
    try:
        async for event in self._runner.run_stream(
            session_id=request.session_id,
            user_input=request.user_input,
            max_turns=request.max_turns,
        ):
            yield f"data: {event.model_dump_json()}\n\n"
    except Exception as e:
        yield f"data: {{'error': '{str(e)}'}}\n\n"
```

## Migration Strategy

### 1. Identify Legacy Imports
```bash
# Find files using deprecated typing imports
grep -r "from typing import.*AsyncGenerator" . --include="*.py"
grep -r "from typing import.*Generator" . --include="*.py"
grep -r "from typing import.*Iterator" . --include="*.py"
```

### 2. Update Import Statements
```python
# Before (legacy)
from typing import Any, AsyncGenerator, Iterator, Callable

# After (modern)
from collections.abc import AsyncGenerator, Iterator, Callable
from typing import Any
```

### 3. Validate with Ruff
```bash
# Check for import issues
uv run --group lint ruff check --select UP035 .

# Auto-fix where possible
uv run --group lint ruff check --fix --select UP035 .
```

## Ruff Configuration
Ensure your `pyproject.toml` enforces this rule:
```toml
[tool.ruff.lint]
select = [
    "UP035",  # Import from typing is deprecated
    # ... other rules
]

# Auto-fix these imports
fixable = ["UP035"]
```

## Benefits of Modern Imports

### Performance
- **Reduced import overhead** - fewer modules loaded
- **Better runtime performance** - direct standard library access
- **Smaller memory footprint** - no unnecessary typing module loading

### Code Quality
- **Future compatibility** - aligned with Python evolution
- **Better IDE support** - more accurate type checking
- **Cleaner dependencies** - explicit about what's used from where
- **Standards compliance** - follows PEP 585 recommendations

## Real-World Example
```python
# ✅ Correct pattern from the fixed code
from collections.abc import AsyncGenerator
from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException
from google.adk.runners import Runner
from google.adk.sessions import DatabaseSessionService

class AdkAgentRunner:
    async def run_agent_stream(
        self, request: RunRequest
    ) -> AsyncGenerator[str, None]:
        """Stream events using Server-Sent Events format."""
        # Implementation here
        yield "data: event\n\n"
```

## Checklist for the Assistant
- [ ] Never import `AsyncGenerator`, `Generator`, `Iterator` from `typing`
- [ ] Always import generic collection types from `collections.abc`
- [ ] Keep `Any`, `Literal`, `Protocol`, `TypeVar` in `typing` module
- [ ] Update legacy imports when encountered in existing code
- [ ] Separate imports clearly: `collections.abc` first, then `typing`
- [ ] Use auto-fix tools like Ruff to catch and fix these issues
- [ ] Verify imports are correct after making changes

This ensures modern Python typing practices and prevents deprecation warnings from using outdated import patterns.
