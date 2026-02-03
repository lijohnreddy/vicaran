---
trigger: glob
globs: *.py
---

# Avoid Any Type in Python Code

## Context
The `Any` type in Python typing defeats the purpose of type checking by allowing any type without validation. Using `Any` reduces type safety, prevents IDEs from providing accurate autocompletion, and can mask potential bugs. Specific types should be used instead to maintain code quality and catch type-related errors during development.

## Rule
1. **Never use** `Any` type in function parameters, return types, or variable annotations.
2. **Use specific types** instead:
   - For dictionaries: `Dict[str, str]`, `Dict[str, int]`, `Dict[str, Union[str, int, float]]`
   - For complex data: Create `TypedDict` or Pydantic models
   - For JSON-like data: `Union[str, int, float, bool, None]` or `Dict[str, Union[str, int, float]]`
   - For Pydantic model contexts: `Optional[str]` or specific context types
3. **Create TypedDict** for complex dictionary structures to maintain type safety.
4. **Use Union types** for parameters that can accept multiple specific types.

## Examples

### ❌ Bad (Using Any)
```python
from typing import Any, Dict

def process_data(data: Dict[str, Any]) -> Any:
    return data["result"]

def handle_metadata(metadata: Dict[str, Any]) -> None:
    pass

class Config:
    settings: Dict[str, Any] = {}
```

### ✅ Good (Using Specific Types)
```python
from typing import Dict, Union, TypedDict, Optional

class ProcessingResult(TypedDict):
    file_path: str
    content_type: str
    supported: bool
    error: Optional[str]

def process_data(data: Dict[str, Union[str, int, float]]) -> ProcessingResult:
    return ProcessingResult(
        file_path=data["path"],
        content_type=data["type"],
        supported=True,
        error=None
    )

def handle_metadata(metadata: Dict[str, str]) -> None:
    pass

class Config:
    settings: Dict[str, str] = {}
```

### ✅ Good (Pydantic Model Context)
```python
from typing import Optional
from pydantic import BaseModel

class MyModel(BaseModel):
    name: str
    
    def model_post_init(self, __context: Optional[str] = None) -> None:
        # Process the model after initialization
        pass
```

## Type-Safe Alternatives

| Instead of | Use |
|------------|-----|
| `Dict[str, Any]` | `Dict[str, Union[str, int, float]]` or `TypedDict` |
| `List[Any]` | `List[str]`, `List[int]`, or `List[Union[str, int]]` |
| `Optional[Any]` | `Optional[str]`, `Optional[int]`, etc. |
| `Callable[..., Any]` | `Callable[[int, str], bool]` (specific signature) |
| `Any` for JSON data | `Union[str, int, float, bool, None]` |

## Best Practices
1. **Start specific**: Begin with the most specific type possible
2. **Use Union for multiple types**: `Union[str, int]` instead of `Any`
3. **Create custom types**: Define `TypedDict` or Pydantic models for complex structures
4. **Document complex types**: Add comments explaining the expected structure
5. **Consider generic types**: Use `TypeVar` for truly generic functions

## Exceptions
The only acceptable use of `Any` is in:
- Legacy code migration (temporary, with TODO comments)
- Third-party library stubs (when types are unknown)
- Dynamic programming with `getattr`/`setattr` (use sparingly)

## Checklist for the Assistant
- [ ] Never suggest `Any` type in new code
- [ ] Replace `Any` with specific types when refactoring
- [ ] Create `TypedDict` for complex dictionary structures
- [ ] Use `Union` types for parameters accepting multiple types
- [ ] Add type annotations to all functions and variables
- [ ] Prefer Pydantic models over `Dict[str, Any]` for data structures

This ensures type safety, better IDE support, and catches potential bugs during development rather than runtime.