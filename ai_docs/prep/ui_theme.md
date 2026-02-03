# UI Theme - Vicaran

## Theme Decision

Using the existing competitor-analysis app theme (bright cyan/AI blue) for Vicaran hackathon build.

---

## Color System (HSL)

### Light Mode
| Variable | HSL | Description |
|----------|-----|-------------|
| `--primary` | 200 100% 60% | Bright cyan/AI blue |
| `--background` | 0 0% 100% | Pure white |
| `--foreground` | 240 10% 3.9% | Near black |
| `--card` | 0 0% 100% | White |
| `--muted` | 240 4.8% 95.9% | Light gray |
| `--border` | 240 5.9% 90% | Subtle gray |
| `--destructive` | 0 84.2% 60.2% | Red |

### Dark Mode
| Variable | HSL | Description |
|----------|-----|-------------|
| `--primary` | 200 100% 60% | Same bright cyan |
| `--background` | 0 0% 3% | True black |
| `--foreground` | 0 0% 98% | Near white |
| `--card` | 0 0% 3.9% | Very dark gray |
| `--muted` | 0 0% 14.9% | Dark gray |
| `--border` | 0 0% 14.9% | Dark border |

---

## Typography

| Use | Font Family |
|-----|-------------|
| Body/UI | Lexend Deca |
| Code | JetBrains Mono |

---

## Brand Colors (Extended)

| Provider | Color |
|----------|-------|
| Gemini Blue | #4A80F5 |
| Gemini Purple | #8A65E9 |
| Gemini Pink | #E061C3 |

---

## Chat Colors

| Element | Light | Dark |
|---------|-------|------|
| User Background | --muted | 0 0% 14.9% |
| Assistant Background | --primary | --primary |

---

## Files

- **CSS Variables:** `apps/web/app/globals.css`
- **Tailwind Config:** `apps/web/tailwind.config.ts`
- **Logo:** `apps/web/public/logo.png`
