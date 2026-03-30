# Knowledge Graph Page Design

## Summary

An interactive knowledge graph visualization page (`knowledge-graph.html`) for the Papers knowledge base. Uses D3.js force-directed graph with a dark sci-fi visual style to visualize relationships between articles organized by directory/category.

## Requirements

- **Target audience**: Both personal knowledge review and visitor exploration
- **Visualization**: D3.js v7 force-directed graph (Canvas rendering)
- **Relationship model**: Directory/category-based clustering
- **Visual style**: Dark sci-fi theme (#0a0e17 background, glowing nodes, particle effects)
- **Data source**: Existing `knowledge-base-data.js` (no new build step)

## Architecture

Single standalone HTML page, consistent with existing site architecture (no build framework). D3.js loaded via CDN. Reads `knowledgeBaseData` from `knowledge-base-data.js`.

## Page Layout

Full-screen canvas with three overlay layers:

1. **Base layer - Canvas**: D3 force simulation rendering, fills viewport
2. **Top toolbar**: Page title, home button, category filter chips, search input
3. **Side detail panel**: Slides in from right on node click, shows article metadata + "Read" button linking to `viewer.html`

## Node System

- **Category nodes (large)**: One per directory/category. Large circle with radial gradient + glow effect + category label. Unique color per category.
- **Article nodes (small)**: One per article. Small circle, color inherited from parent category. Hover shows title tooltip.
- **Edges**: Articles connect to their parent category. Semi-transparent gradient lines.

## Interactions

| Action | Result |
|--------|--------|
| Drag node | Physics simulation updates in real-time |
| Scroll wheel | Zoom in/out |
| Drag background | Pan the view |
| Click category node | Highlight all articles in category, dim others |
| Click article node | Open detail panel on right |
| Hover node | Enlarge + tooltip with name |
| Search input | Matching nodes glow/pulse, others dim |

## Visual Style

- **Background**: `#0a0e17` with optional subtle star particles
- **Nodes**: Radial gradients + outer glow (Canvas shadow)
- **Category palette**: Unique color per category, derived from existing `categoryIcons` config
- **Edges**: Low-opacity gradient lines
- **Entry animation**: Nodes expand outward from center on page load

## Data Flow

```
knowledge-base-data.js (existing, auto-generated)
    ↓ read knowledgeBaseData
knowledge-graph.html JS
    ↓ parse categories → category nodes
    ↓ parse articles → article nodes + edges
D3.js force simulation
    ↓ Canvas render loop
User interactions (drag, click, search, filter)
```

## Navigation Integration

- Add knowledge graph link to `navigation.html` and `index.html`
- Knowledge graph page has back-to-navigation button in toolbar

## Technical Decisions

- **D3.js v7 via CDN**: Zero build complexity, matches existing architecture
- **Canvas over SVG**: Better performance for 200+ nodes
- **No new build step**: Reuses existing `knowledge-base-data.js`
- **Standalone HTML**: Single file with embedded CSS/JS, consistent with other pages
