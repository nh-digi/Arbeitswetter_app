# Arbeitswetter App — Design Guidelines

## Status Color System

There are **4 Belastungsstufen** (heat stress levels). Each level has a dedicated set of tokens for different contexts. Never mix tokens across contexts.

### The 4 Levels

| Level | Label    | Meaning                        |
|-------|----------|--------------------------------|
| 1     | Gering   | Low stress, safe to work       |
| 2     | Mäßig    | Moderate, some precautions     |
| 3     | Stark    | High stress, restrict activity |
| 4     | Kritisch | Extreme, stop outdoor work     |

---

### Token Usage Rules

#### 1. Icon Circles (small filled circle with icon inside — list rows, legend)
Use the **tinted/lighter** variants so black icons stay legible. Icons are always **black** (`--neutral-black`).

| Level     | Token                    | Hex       |
|-----------|--------------------------|-----------|
| 1 Gering  | `--status-icon-ok`       | `#85D7A2` |
| 2 Mäßig   | `--status-warning`       | `#F8D74A` |
| 3 Stark   | `--status-strong`        | `#FEBB6A` |
| 4 Kritisch| `--status-critical-tint` | `#FF878A` |

**Rule:** Never use `--status-critical` (#E8193C) for icon circles. Too dark, harsh contrast.

#### 2. Ring Arc Segments (SVG clock arcs)
Use the **full saturated** colors — they need to be vivid against the light ring background.

| Level     | Token               | Hex       |
|-----------|---------------------|-----------|
| 2 Mäßig   | `--status-warning`  | `#F8D74A` |
| 3 Stark   | `--status-strong`   | `#FEBB6A` |
| 4 Kritisch| `--status-critical` | `#E8193C` |
| 1 Gering  | no segment          | —         |

#### 3. Alert Banner Background (full-width banner behind alert text)
Use the **-bg** tints — very light so text stays readable.

| Level     | Token                  | Hex       |
|-----------|------------------------|-----------|
| 1 Gering  | `--status-success-bg`  | `#ECFDF5` |
| 2 Mäßig   | `--status-warning-bg`  | `#FFEDD4` |
| 3 Stark   | `--status-strong-bg`   | `#FFF0E0` |
| 4 Kritisch| `--status-critical-bg` | `#FFEEEF` |

#### 4. Alert Icon Circle (icon circle inside the alert banner)
Alert banners use a **black background** — use softer/lighter variants for better contrast with the black icon inside.

| Level     | Token                    | Hex       | Note |
|-----------|--------------------------|-----------|------|
| 1 Gering  | `--status-success`       | `#10B981` | |
| 2 Mäßig   | `--status-warning`       | ``#F8D74A`` | |
| 3 Stark   | `--status-strong`        | `#FEBB6A` | |
| 4 Kritisch| `--status-critical-tint` | `#FF878A` | |

#### 5. Status Badge Dot (small inline dot next to a label)
Use full saturated colors — the dot is tiny, tint would be invisible.

| Level     | Token               |
|-----------|---------------------|
| 1 Gering  | `--status-success`  |
| 2 Mäßig   | `--status-warning`  |
| 3 Stark   | `--status-strong`   |
| 4 Kritisch| `--status-critical` |

---

### Typography in Status Contexts

- Status labels (Gering/Mäßig/Stark/Kritisch) always use `--neutral-950`. Never color the text to match the level color.
- Secondary/sublabel text uses `--neutral-500` or `--muted-foreground`.
- Alert title text: `--neutral-white` (alert bg is dark-tinted).
- Alert body text: `--neutral-100`.

---

## Icons

Use `@phosphor-icons/react` for weather/decorative icons. Use `lucide-react` for UI/action icons.

| Context         | Icon            |
|-----------------|-----------------|
| Gering circle   | `CheckCircle`   |
| Mäßig circle    | text `i` (bold) |
| Stark circle    | `AlertCircle`   |
| Kritisch circle | `AlertTriangle` |
| Settings        | `Edit3`         |
| Location        | `MapPin`        |

---

## Layout

- Use flexbox/grid. Avoid absolute positioning unless essential (e.g. SVG overlays).
- Bottom nav: max 4 items.
- Border radius follows `--radius` (0.5rem) or multiples thereof.
