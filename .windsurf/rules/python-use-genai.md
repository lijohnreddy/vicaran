---
trigger: glob
globs: *.py
---

# Use Google GenAI as Primary AI Package

## Context
Google has modernized their AI platform with the `google-genai` package as the primary interface for AI operations. The `google-genai` package provides:
- Modern, unified API for Google's AI models
- Better performance and reliability
- File upload/management capabilities
- Streamlined authentication
- Access to latest model features like Gemini 2.5 Flash

The `vertexai` package should **only** be used when `google-genai` cannot handle the specific use case, primarily for **multimodal embeddings**.

## Rule Priority (Use in Order)
1. **🥇 PRIMARY: `google-genai`** - Use for ALL AI operations when possible
2. **🥈 FALLBACK: `vertexai`** - Use ONLY for multimodal embeddings when genai can't handle them
3. **❌ NEVER: `google-cloud-aiplatform`** - Completely deprecated, never use

## Package Usage Guidelines

### ✅ Use `google-genai` For:
- **Text generation** (chat, completion, etc.)
- **Audio transcription** (upload audio files + transcribe)
- **Image analysis** (upload images + analyze)
- **Text embeddings** (when supported)
- **File processing** (any file upload + AI processing)
- **General AI model interactions**

### ⚠️ Use `vertexai` ONLY For:
- **Multimodal embeddings** (image + text embeddings combined)
- **Legacy embedding models** not yet supported by genai

### ❌ NEVER Use:
- `google-cloud-aiplatform` (completely deprecated)

## Correct Dependencies in pyproject.toml
```toml
[project.dependencies]
# ✅ Primary Google AI package (use this as much as possible)
"google-genai>=1.24.0"  # Modern Google AI API

# ⚠️ Only include vertexai if you need multimodal embeddings
"vertexai>=1.38.0"      # ONLY for multimodal embeddings

# ❌ NEVER use these deprecated packages
# "google-cloud-aiplatform"  # DEPRECATED - DO NOT USE
```

## Usage Examples

### ✅ PREFERRED: Google GenAI Pattern
```python
import google.genai as genai

# Initialize GenAI client
client = genai.Client(
    vertexai=True,  # Use Vertex AI backend for authentication
    project=PROJECT_ID,
    location=LOCATION
)

# Audio transcription
audio_file = client.files.upload(file=audio_path)
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=["Generate a transcript of the speech.", audio_file]
)

# Image analysis
image_file = client.files.upload(file=image_path)
response = client.models.generate_content(
    model="gemini-2.5-flash", 
    contents=["Describe this image in detail", image_file]
)

# Text generation
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=["Explain quantum computing"]
)

# Clean up uploaded files
client.files.delete(name=audio_file.name)
```

### ⚠️ FALLBACK: VertexAI for Multimodal Embeddings ONLY
```python
import vertexai
from vertexai.vision_models import MultiModalEmbeddingModel

# ONLY use for multimodal embeddings when genai can't handle them
vertexai.init(project=PROJECT_ID, location=LOCATION)
model = MultiModalEmbeddingModel.from_pretrained("multimodalembedding@001")

# Generate multimodal embedding (image + text)
embeddings = model.get_embeddings(
    image=image_obj,
    contextual_text="Description of the image",
    dimension=1408
)
```

### ❌ AVOID: Mixed Usage Anti-Pattern
```python
# DON'T do this - inconsistent API usage
import vertexai
from vertexai.generative_models import GenerativeModel

# BAD: Using vertexai for general generation when genai should be used
model = GenerativeModel("gemini-pro")
response = model.generate_content("Hello world")
```

## Migration Priority

### 1. Replace VertexAI Generative Operations
| ❌ Old (VertexAI) | ✅ New (GenAI) |
|---|---|
| `vertexai.init()` + `GenerativeModel()` | `genai.Client()` |
| `model.generate_content([Part.from_data(...), prompt])` | `client.models.generate_content(model, [prompt, uploaded_file])` |
| `Part.from_data(audio_data, mime_type)` | `client.files.upload(file=audio_path)` |

### 2. Keep VertexAI Only for Embeddings
- **Text embeddings**: Try `google-genai` first, fallback to `vertexai` if needed
- **Multimodal embeddings**: Keep using `vertexai.vision_models.MultiModalEmbeddingModel`

## Package Selection Decision Tree

```
┌─ Need AI functionality?
│
├─ Multimodal embeddings (image + text)?
│  └─ ✅ Use vertexai.vision_models.MultiModalEmbeddingModel
│
├─ Text generation/chat?
│  └─ ✅ Use google-genai client.models.generate_content
│
├─ Audio transcription?
│  └─ ✅ Use google-genai file upload + generate_content
│
├─ Image analysis?
│  └─ ✅ Use google-genai file upload + generate_content
│
├─ Text embeddings?
│  ├─ Try google-genai first
│  └─ Fallback to vertexai if not supported
│
└─ General AI model interaction?
   └─ ✅ Use google-genai
```

## File Management Best Practices

### Always Clean Up Uploaded Files
```python
# Good pattern - always clean up
uploaded_file = client.files.upload(file=file_path)
try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[prompt, uploaded_file]
    )
    return response.text
finally:
    # Always clean up uploaded files
    client.files.delete(name=uploaded_file.name)
```

## Authentication Patterns
Both packages support consistent authentication:
- **Google Cloud SDK**: `gcloud auth application-default login` (recommended for development)
- **Service Account**: Environment variable `GOOGLE_APPLICATION_CREDENTIALS`
- **Workload Identity**: For GKE/Cloud Run deployments

## Common Use Cases Mapping
| Use Case | Package | Example |
|---|---|---|
| **Audio transcription** | `google-genai` | File upload + generate_content |
| **Image analysis** | `google-genai` | File upload + generate_content |
| **Text generation** | `google-genai` | models.generate_content |
| **Chat/Conversation** | `google-genai` | models.generate_content |
| **Text embeddings** | `google-genai` (preferred) | models.embed_content |
| **Multimodal embeddings** | `vertexai` (only option) | MultiModalEmbeddingModel |

## Why This Approach Matters
- **Consistency**: Single API pattern for most AI operations
- **Modern Features**: Access to latest models like Gemini 2.5 Flash
- **File Management**: Built-in upload/delete capabilities
- **Future-Proof**: Google's recommended modern interface
- **Performance**: Optimized for current Google AI infrastructure
- **Simplicity**: Fewer dependencies and import patterns

## Checklist for the Assistant
- [ ] **ALWAYS try `google-genai` first** for any AI functionality
- [ ] Use `vertexai` ONLY for multimodal embeddings or when genai lacks support
- [ ] Never suggest `google-cloud-aiplatform` in new Python projects
- [ ] Use file upload pattern: `client.files.upload()` + `generate_content()`
- [ ] Always clean up uploaded files with `client.files.delete()`
- [ ] Use `genai.Client(vertexai=True)` for Vertex AI backend authentication
- [ ] Check if functionality exists in genai before falling back to vertexai
- [ ] Prefer `google-genai>=1.24.0` as primary dependency

This ensures maximum use of Google's modern GenAI package while keeping VertexAI only for specific use cases where it's truly needed.