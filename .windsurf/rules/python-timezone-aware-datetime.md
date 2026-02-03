---
trigger: glob
description:
globs: *.py
---
# Python Timezone-Aware Datetime Required

## Context
Python's `datetime.utcnow()` method is deprecated as of Python 3.12 and will be removed in future versions. The deprecation warning states: "Use timezone-aware objects to represent datetimes in UTC; e.g. by calling .now(datetime.UTC)".

Using `datetime.utcnow()` creates naive datetime objects that don't include timezone information, leading to potential bugs and ambiguity. Modern Python code should use timezone-aware datetime objects for better reliability and future compatibility.

## Rule
**ALWAYS use timezone-aware datetime objects instead of deprecated UTC methods:**

1. **Never use** `datetime.utcnow()` - it's deprecated and will be removed
2. **Always use** `datetime.now(timezone.utc)` for UTC timestamps
3. **Import timezone** from the datetime module when needed
4. **Use timezone-aware objects** for all datetime operations

## Required Import
```python
from datetime import datetime, timezone
```

## Examples

### ❌ Bad (Deprecated datetime.utcnow())
```python
from datetime import datetime

# DEPRECATED - will cause warnings and be removed
created_at = datetime.utcnow()
updated_at = datetime.utcnow()
timestamp = datetime.utcnow()

# Also deprecated
import datetime
current_time = datetime.datetime.utcnow()
```

### ✅ Good (Modern timezone-aware datetime)
```python
from datetime import datetime, timezone

# Modern timezone-aware UTC datetime
created_at = datetime.now(timezone.utc)
updated_at = datetime.now(timezone.utc)
timestamp = datetime.now(timezone.utc)

# Also acceptable for specific timezones
from zoneinfo import ZoneInfo
local_time = datetime.now(ZoneInfo("America/New_York"))
```

## Common Usage Patterns

### Database Timestamps
```python
# ❌ Bad - deprecated
job = ProcessingJob(
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow()
)

# ✅ Good - timezone-aware
job = ProcessingJob(
    created_at=datetime.now(timezone.utc),
    updated_at=datetime.now(timezone.utc)
)
```

### Time Calculations
```python
from datetime import timedelta

# ❌ Bad - deprecated
cutoff_time = datetime.utcnow() - timedelta(minutes=5)

# ✅ Good - timezone-aware
cutoff_time = datetime.now(timezone.utc) - timedelta(minutes=5)
```

### Database Updates
```python
# ❌ Bad - deprecated
cursor.execute(
    "UPDATE table SET updated_at = %s WHERE id = %s",
    (datetime.utcnow(), record_id)
)

# ✅ Good - timezone-aware
cursor.execute(
    "UPDATE table SET updated_at = %s WHERE id = %s", 
    (datetime.now(timezone.utc), record_id)
)
```

### Logging and Monitoring
```python
# ❌ Bad - deprecated
logger.info("Event occurred", timestamp=datetime.utcnow().isoformat())

# ✅ Good - timezone-aware
logger.info("Event occurred", timestamp=datetime.now(timezone.utc).isoformat())
```

## Alternative Modern Approaches

### Using datetime.UTC (Python 3.11+)
```python
from datetime import datetime

# Modern alternative (Python 3.11+)
timestamp = datetime.now(datetime.UTC)
```

### For Local Time with Timezone
```python
from datetime import datetime
from zoneinfo import ZoneInfo

# Local time with explicit timezone
local_time = datetime.now(ZoneInfo("America/New_York"))
system_local = datetime.now()  # System local time (use sparingly)
```

## Migration Strategy

### Search and Replace Pattern
1. **Find**: `datetime.utcnow()`
2. **Replace**: `datetime.now(timezone.utc)`
3. **Add import**: Ensure `timezone` is imported from datetime

### Validation Commands
```bash
# Check for deprecated datetime usage
grep -r "datetime\.utcnow()" . --include="*.py"

# Check for missing timezone imports
grep -r "datetime\.now(timezone\.utc)" . --include="*.py" | \
xargs grep -L "from datetime import.*timezone"
```

## Why This Matters

### Technical Benefits
- **Future compatibility**: Prevents code breakage when deprecated methods are removed
- **Timezone clarity**: Explicit timezone information prevents ambiguity
- **Better debugging**: Timezone-aware objects provide clearer error messages
- **Standards compliance**: Follows modern Python datetime best practices

### Production Benefits
- **Prevents deployment warnings**: Eliminates deprecation warnings in logs
- **Consistent behavior**: Same behavior across different Python versions
- **Better monitoring**: Clearer timestamps in logs and metrics
- **Database compatibility**: Better integration with timezone-aware databases

## Common Migration Issues

### Import Updates Required
```python
# Before
from datetime import datetime

# After - add timezone import
from datetime import datetime, timezone
```

### Batch Updates in Large Files
```python
# Use find-and-replace tools for large files
# Pattern: datetime.utcnow()
# Replacement: datetime.now(timezone.utc)
```

## Integration with Existing Code

### Pydantic Models
```python
from datetime import datetime, timezone
from pydantic import BaseModel, Field

class ProcessingJob(BaseModel):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

### Database Service Patterns
```python
class DatabaseService:
    def create_record(self, data: dict) -> None:
        now = datetime.now(timezone.utc)
        data.update({
            'created_at': now,
            'updated_at': now
        })
        # Store in database
```

## Checklist for the Assistant
- [ ] Never suggest `datetime.utcnow()` in any Python code
- [ ] Always use `datetime.now(timezone.utc)` for UTC timestamps
- [ ] Include `timezone` import when using timezone-aware datetime
- [ ] Replace existing `datetime.utcnow()` instances when encountered
- [ ] Verify imports are updated when fixing deprecated usage
- [ ] Use timezone-aware patterns in all datetime operations
- [ ] Consider `datetime.UTC` for Python 3.11+ when appropriate

This ensures all datetime operations use modern, timezone-aware objects and prevents deprecated method usage that will cause warnings and eventual code breakage.
