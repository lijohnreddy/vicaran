---
trigger: glob
globs: *.py
---

# Never Use `# type: ignore[attr-defined]` Comments

## Context
The `# type: ignore[attr-defined]` comment is used to suppress type checker warnings when accessing attributes that the type checker cannot resolve. This is almost always a sign of an underlying issue that should be fixed rather than suppressed. These comments:

- Hide real import or attribute access problems
- Mask potential runtime errors and bugs
- Reduce code maintainability and type safety
- Make code harder to understand and refactor
- Bypass the protective benefits of static type checking

Most `attr-defined` errors can be resolved through proper imports, explicit type annotations, or installing appropriate type stubs.

## Rule
1. **Never use** `# type: ignore[attr-defined]` comments to suppress attribute access warnings.
2. **Always fix** the underlying issue causing the attribute access error.
3. **Use specific imports** instead of broad package imports that cause attribute resolution issues.
4. **Install type stubs** for third-party libraries when available.
5. **Use explicit type annotations** and casting when dealing with dynamic attributes.

## Examples

### Import Issues (Most Common)
| ❌ Bad (Suppressing) | ✅ Good (Proper Import) |
|---|---|
| `from google.cloud import storage  # type: ignore[attr-defined]` | `from google.cloud.storage import Client as StorageClient` |
| `from sqlalchemy import create_engine  # type: ignore[attr-defined]` | `from sqlalchemy.engine import create_engine` |
| `import requests  # type: ignore[attr-defined]` | `import requests` + `pip install types-requests` |

### Dynamic Attribute Access
| ❌ Bad (Suppressing) | ✅ Good (Proper Typing) |
|---|---|
| `obj.dynamic_attr  # type: ignore[attr-defined]` | `getattr(obj, 'dynamic_attr', default_value)` |
| `config.unknown_key  # type: ignore[attr-defined]` | `config.get('unknown_key')` or proper TypedDict |

### Third-Party Library Issues
| ❌ Bad (Suppressing) | ✅ Good (Proper Handling) |
|---|---|
| `client.method()  # type: ignore[attr-defined]` | Install type stubs or use explicit casting |
| `from untyped_lib import func  # type: ignore[attr-defined]` | `pip install types-untyped-lib` |

## Common Solutions for `attr-defined` Errors

### 1. Fix Import Paths
```python
# ❌ Bad - Broad import causing attr-defined error
from google.cloud import storage  # type: ignore[attr-defined]
client = storage.Client()

# ✅ Good - Specific import
from google.cloud.storage import Client as StorageClient
client = StorageClient()
```

### 2. Install Type Stubs
```bash
# Common type stubs for popular libraries
pip install types-requests
pip install types-redis
pip install types-psycopg2
pip install types-PyMySQL
```

### 3. Use Explicit Type Annotations
```python
# ❌ Bad - Suppressing dynamic attribute access
result = api_response.data  # type: ignore[attr-defined]

# ✅ Good - Explicit handling
from typing import Any, cast
result = cast(dict[str, Any], api_response.data)
# or
result = getattr(api_response, 'data', {})
```

### 4. Proper Configuration Objects
```python
# ❌ Bad - Suppressing unknown attributes
config.database_url  # type: ignore[attr-defined]

# ✅ Good - TypedDict or proper class
from typing import TypedDict

class Config(TypedDict):
    database_url: str
    api_key: str

config: Config = load_config()
database_url = config['database_url']
```

### 5. Handle Optional Attributes
```python
# ❌ Bad - Suppressing optional attribute
obj.optional_attr  # type: ignore[attr-defined]

# ✅ Good - Safe attribute access
optional_value = getattr(obj, 'optional_attr', None)
if hasattr(obj, 'optional_attr'):
    value = obj.optional_attr
```

## Library-Specific Solutions

### Google Cloud Libraries
```python
# ❌ Bad
from google.cloud import storage  # type: ignore[attr-defined]
from google.cloud import firestore  # type: ignore[attr-defined]

# ✅ Good
from google.cloud.storage import Client as StorageClient
from google.cloud.firestore import Client as FirestoreClient
```

### SQLAlchemy
```python
# ❌ Bad
from sqlalchemy import create_engine  # type: ignore[attr-defined]

# ✅ Good
from sqlalchemy.engine import create_engine
```

### Requests and HTTP Libraries
```python
# ❌ Bad
import requests  # type: ignore[attr-defined]

# ✅ Good
import requests
# + pip install types-requests
```

## Detection and Prevention

### 1. Search for Existing Issues
```bash
# Find all attr-defined suppressions
rg "# type: ignore\[attr-defined\]"
```

### 2. Run Type Checking
```bash
# Check for attr-defined errors
mypy --show-error-codes your_file.py
pyright your_file.py
```

### 3. Install Missing Type Stubs
```bash
# Common type stub packages
pip install types-requests types-redis types-psycopg2
```

## Migration Steps

### 1. Identify All Suppressions
Find all `# type: ignore[attr-defined]` comments in the codebase.

### 2. Analyze Each Case
For each suppression, determine the root cause:
- Import path issue
- Missing type stubs
- Dynamic attribute access
- Third-party library without types

### 3. Apply Appropriate Fix
- Fix import paths to be more specific
- Install type stubs for third-party libraries
- Use explicit type annotations or casting
- Implement proper configuration classes

### 4. Test and Verify
Run type checking to ensure the fix resolves the issue without introducing new errors.

## Checklist for the Assistant
- [ ] Never suggest `# type: ignore[attr-defined]` comments in any code.
- [ ] Always investigate the root cause of attribute access errors.
- [ ] Use specific imports instead of broad package imports.
- [ ] Install appropriate type stubs for third-party libraries.
- [ ] Use explicit type annotations and safe attribute access patterns.
- [ ] Recommend proper configuration classes and TypedDict for dynamic data.
- [ ] Verify that type checking passes after applying fixes.

This ensures code maintains strong type safety and leverages the full benefits of static type checking without suppressing legitimate attribute access warnings.