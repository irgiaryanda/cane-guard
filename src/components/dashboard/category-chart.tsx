"use client";

import { CATEGORIES, CATEGORY_MARKER_COLORS, type CategoryValue } from "@/lib/constants";

interface CategoryChartProps {
  data: Record<CategoryValue, number>;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      <h3 className="text-sm font-semibold text-white">Distribusi Kategori</h3>
      <div className="mt-4 space-y-3">
        {CATEGORIES.map((cat) => {
          const count = data[cat.value] ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={cat.value} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{cat.emoji} {cat.label}</span>
                <span className="font-mono text-zinc-500">{count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: CATEGORY_MARKER_COLORS[cat.value] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
