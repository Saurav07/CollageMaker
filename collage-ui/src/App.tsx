// src/App.tsx
// Simple Collage Layout Helper without external libraries
// @ts-nocheck
import { useState, useMemo } from "react";

const layoutPresets: Record<number, { layout: number[]; label: string }[]> = {
  2: [
    { layout: [2], label: "1 row, 2 images" },
    { layout: [1, 1], label: "2 rows, 1+1" },
  ],
  3: [
    { layout: [3], label: "1 row, 3 images" },
    { layout: [1, 2], label: "2 rows, 1+2" },
  ],
  4: [
    { layout: [2, 2], label: "2 rows, 2+2" },
    { layout: [1, 3], label: "2 rows, 1+3" },
  ],
  5: [
    { layout: [2, 3], label: "2 rows, 2+3" },
    { layout: [1, 2, 2], label: "3 rows, 1+2+2" },
  ],
  6: [
    { layout: [3, 3], label: "2 rows, 3+3" },
    { layout: [2, 2, 2], label: "3 rows, 2+2+2" },
  ],
  7: [
    { layout: [3, 4], label: "2 rows, 3+4" },
    { layout: [2, 3, 2], label: "3 rows, 2+3+2" },
  ],
  8: [
    { layout: [4, 4], label: "2 rows, 4+4" },
    { layout: [3, 3, 2], label: "3 rows, 3+3+2" },
  ],
  9: [
    { layout: [3, 3, 3], label: "3 rows, 3+3+3" },
    { layout: [4, 3, 2], label: "3 rows, 4+3+2" },
  ],
};

function getLayoutsForCount(count: number) {
  const n = Number(count);
  if (!n || n < 2) return [];
  if (layoutPresets[n]) return layoutPresets[n];

  const firstRow = Math.floor(n / 2);
  const rows = n <= 4 ? [n] : [firstRow, n - firstRow];

  return [{ layout: rows, label: `${rows.length} rows: ${rows.join(" + ")}` }];
}

function App() {
  const [imageCount, setImageCount] = useState<number | "">(7);
  const [selectedCount, setSelectedCount] = useState(7);

  const layouts = useMemo(
    () => getLayoutsForCount(selectedCount),
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
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <header style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
            Collage Layout Helper
          </h1>
          <p style={{ opacity: 0.8 }}>
            Enter number of images and preview different collage layouts for a
            widescreen slide. Use these as references and rebuild in PowerPoint.
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
              max={12}
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
            Predefined layouts for 2–9 images. Others use a generic pattern.
          </span>
        </form>

        {layouts.length === 0 ? (
          <p>No layouts defined. Try 2–9 images.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {layouts.map((config, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: "12px",
                  padding: "12px",
                  background: "#020617",
                  border: "1px solid #1f2937",
                  boxShadow:
                    "0 10px 25px rgba(15,23,42,0.9), 0 0 0 1px rgba(15,23,42,0.8)",
                }}
              >
                <div
                  style={{
                    marginBottom: "8px",
                    fontSize: "13px",
                  }}
                >
                  <strong>{config.label}</strong>{" "}
                  <span style={{ opacity: 0.6 }}>
                    (layout: [{config.layout.join(", ")}])
                  </span>
                </div>

                {/* Layout preview using simple boxes */}
                <div
                  style={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#020617",
                    padding: "6px",
                    border: "1px solid #111827",
                  }}
                >
                  {config.layout.map((cols, rowIdx) => (
                    <div
                      key={rowIdx}
                      style={{
                        display: "flex",
                        gap: "4px",
                        marginBottom:
                          rowIdx === config.layout.length - 1 ? 0 : 4,
                        height: 52,
                      }}
                    >
                      {Array.from({ length: cols }).map((_, colIdx) => (
                        <div
                          key={colIdx}
                          style={{
                            flex: 1,
                            borderRadius: "4px",
                            border: "1px solid #4b5563",
                            background:
                              "linear-gradient(135deg, #111827, #020617)",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    opacity: 0.7,
                  }}
                >
                  Recreate this pattern in PPT using a 16:9 slide and{" "}
                  {selectedCount} image placeholders.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
