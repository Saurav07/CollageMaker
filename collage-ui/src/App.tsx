// collage-ui/src/App.tsx
// Pure layout suggester: no external libs, no styling rules
// @ts-nocheck
import { useState, useMemo } from "react";

type LayoutRow = {
  height: number;      // relative height of this row
  widths: number[];    // relative widths of boxes in this row
};

type LayoutDef = {
  id: string;
  numImages: number;
  label: string;
  style: "HERO" | "MOSAIC" | "GRID" | "BRAND" | "EDITORIAL" | "OTHER";
  rows: LayoutRow[];
};

// ------- HAND-CRAFTED LAYOUT LIBRARY (more creative, mixed sizes) -------

const allLayouts: LayoutDef[] = [
  // ---------- 5 images ----------
  {
    id: "5-HERO-T-1",
    numImages: 5,
    label: "Hero top, 4 small bottom",
    style: "HERO",
    rows: [
      { height: 3, widths: [1] }, // big band
      { height: 2, widths: [1, 1, 1, 1] },
    ],
  },
  {
    id: "5-MOSAIC-L-1",
    numImages: 5,
    label: "Mosaic, stronger left",
    style: "MOSAIC",
    rows: [
      { height: 3, widths: [2, 1, 1] }, // wide + 2 small
      { height: 2, widths: [1, 1] },
    ],
  },
  {
    id: "5-COLUMN-1",
    numImages: 5,
    label: "Middle focus + support",
    style: "GRID",
    rows: [
      { height: 2, widths: [1, 2, 1] },
      { height: 2, widths: [1, 1] },
    ],
  },
  {
    id: "5-BRAND-L-1",
    numImages: 5,
    label: "Left strip + 4 gallery tiles",
    style: "BRAND",
    rows: [
      { height: 3, widths: [1, 2, 1] },
      { height: 2, widths: [2, 1] },
    ],
  },

  // ---------- 6 images ----------
  {
    id: "6-HERO-L-1",
    numImages: 6,
    label: "Hero left, 2x3 grid on right",
    style: "HERO",
    rows: [
      { height: 3, widths: [2, 1, 1] },
      { height: 2, widths: [2, 1, 1] },
    ],
  },
  {
    id: "6-HERO-T-1",
    numImages: 6,
    label: "Wide hero band + 5 small",
    style: "HERO",
    rows: [
      { height: 3, widths: [1] },
      { height: 2, widths: [1, 1, 1, 1, 1] },
    ],
  },
  {
    id: "6-MOSAIC-1",
    numImages: 6,
    label: "Staggered mosaic",
    style: "MOSAIC",
    rows: [
      { height: 2, widths: [1, 1, 2] },
      { height: 3, widths: [2, 1, 1] },
    ],
  },
  {
    id: "6-GRID-ADV-1",
    numImages: 6,
    label: "Balanced grid with center weight",
    style: "GRID",
    rows: [
      { height: 2, widths: [1, 1, 1] },
      { height: 2, widths: [1, 2, 1] },
    ],
  },

  // ---------- 7 images ----------
  {
    id: "7-HERO-L-1",
    numImages: 7,
    label: "Hero left, stacked gallery",
    style: "HERO",
    rows: [
      { height: 3, widths: [2, 1, 1] },
      { height: 2, widths: [2, 1, 1, 1] },
    ],
  },
  {
    id: "7-HERO-T-1",
    numImages: 7,
    label: "Top hero band + 2 rows below",
    style: "HERO",
    rows: [
      { height: 3, widths: [1] },
      { height: 2, widths: [1, 1, 1] },
      { height: 2, widths: [1, 1, 1] },
    ],
  },
  {
    id: "7-MOSAIC-1",
    numImages: 7,
    label: "Bottom hero, 4-tile band above",
    style: "MOSAIC",
    rows: [
      { height: 2, widths: [1, 1, 1, 1] },
      { height: 3, widths: [2, 1, 1] },
    ],
  },
  {
    id: "7-CENTER-FOCUS-1",
    numImages: 7,
    label: "Center emphasis, surround tiles",
    style: "GRID",
    rows: [
      { height: 2, widths: [1, 2, 1] },
      { height: 2, widths: [1, 1, 1, 1] },
    ],
  },

  // ---------- 8 images ----------
  {
    id: "8-HERO-L-1",
    numImages: 8,
    label: "Hero left, dense gallery right",
    style: "HERO",
    rows: [
      { height: 3, widths: [2, 1, 1] },
      { height: 2, widths: [2, 1, 1, 1, 1] },
    ],
  },
  {
    id: "8-HERO-T-1",
    numImages: 8,
    label: "Hero band + 4 + 3 tiles",
    style: "HERO",
    rows: [
      { height: 3, widths: [1] },
      { height: 2, widths: [1, 1, 1, 1] },
      { height: 2, widths: [1, 1, 1] },
    ],
  },
  {
    id: "8-MOSAIC-1",
    numImages: 8,
    label: "Staggered mosaic, varied widths",
    style: "MOSAIC",
    rows: [
      { height: 2, widths: [1, 1, 2, 1] },
      { height: 3, widths: [2, 1, 1, 1] },
    ],
  },
  {
    id: "8-GRID-ADV-1",
    numImages: 8,
    label: "4-tile band + 3-tile row",
    style: "GRID",
    rows: [
      { height: 2, widths: [1, 1, 1, 1] },
      { height: 2, widths: [1, 2, 1] },
    ],
  },
];

// --------- HELPERS ---------

function layoutsForCount(count: number): LayoutDef[] {
  const exact = allLayouts.filter((l) => l.numImages === count);
  if (exact.length > 0) return exact;

  // Fallback: simple grid (boring but safe)
  const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(count))));
  const rowsNeeded = Math.ceil(count / cols);
  const rows: LayoutRow[] = [];
  let remaining = count;

  for (let r = 0; r < rowsNeeded; r++) {
    const inThisRow = Math.min(cols, remaining);
    rows.push({
      height: 1,
      widths: Array.from({ length: inThisRow }, () => 1),
    });
    remaining -= inThisRow;
  }

  return [
    {
      id: `${count}-AUTO-GRID`,
      numImages: count,
      label: "Auto grid (fallback)",
      style: "OTHER",
      rows,
    },
  ];
}

function describeLayout(layout: LayoutDef): string {
  const rowCounts = layout.rows.map((r) => r.widths.length).join(" / ");
  return `Rows: ${layout.rows.length} • Images per row: ${rowCounts}`;
}

// --------- REACT COMPONENT ---------

function App() {
  const [imageCount, setImageCount] = useState<number | "">(7);
  const [selectedCount, setSelectedCount] = useState(7);

  const layouts = useMemo(
    () => layoutsForCount(selectedCount),
    [selectedCount]
  );

  const handleShowLayouts = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageCount || Number(imageCount) < 2) return;
    setSelectedCount(Number(imageCount));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#0f172a",
        color: "#e5e7eb",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <header style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
            Collage Layout Helper
          </h1>
          <p style={{ opacity: 0.8, maxWidth: "720px" }}>
            Enter the number of images and explore different ways to arrange
            them on a 16:9 slide. Each card shows a structural layout only
            (blocks). Designers can rebuild these in PowerPoint or Figma with
            any rounding, shadows, or ratios they like.
          </p>
        </header>

        <form
          onSubmit={handleShowLayouts}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <label>
            Number of images:{" "}
            <input
              type="number"
              min={2}
              max={16}
              value={imageCount}
              onChange={(e) =>
                setImageCount(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              style={{
                width: "80px",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #4b5563",
                background: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              background:
                "linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #6366f1 100%)",
              color: "#020617",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Show layouts
          </button>
          <span style={{ fontSize: "12px", opacity: 0.7 }}>
            Custom creative layouts for 5–8 images. Others use an auto grid.
          </span>
        </form>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
          }}
        >
          {layouts.map((layout, idx) => {
            const totalRowHeight = layout.rows.reduce(
              (sum, r) => sum + r.height,
              0
            );

            return (
              <div
                key={layout.id ?? idx}
                style={{
                  borderRadius: "12px",
                  padding: "12px",
                  background: "#020617",
                  border: "1px solid #1f2937",
                }}
              >
                <div
                  style={{
                    marginBottom: "6px",
                    fontSize: "13px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <strong>{layout.label}</strong>
                  <span style={{ opacity: 0.6, fontSize: "12px" }}>
                    {layout.style} • {describeLayout(layout)}
                  </span>
                </div>

                {/* 16:9 layout preview using pure boxes */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    background: "#020617",
                    border: "1px solid #111827",
                    padding: "4px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {layout.rows.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      style={{
                        display: "flex",
                        flex: row.height / totalRowHeight,
                        gap: "4px",
                      }}
                    >
                      {row.widths.map((w, cIdx) => (
                        <div
                          key={cIdx}
                          style={{
                            flex: w,
                            border: "1px solid #4b5563",
                            background:
                              "linear-gradient(135deg, #111827, #020617)",
                            boxSizing: "border-box",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "12px",
                    opacity: 0.75,
                    lineHeight: 1.4,
                  }}
                >
                  Use this as a wireframe: each box = 1 image. Designers can
                  adjust exact sizes, ratios, rounding, and shadows manually in
                  PPT while keeping this structure.
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;