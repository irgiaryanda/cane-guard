"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES, CATEGORY_COLORS, type CategoryValue } from "@/lib/constants";

interface CategoryChartProps {
  data: Record<CategoryValue, number>;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Distribusi Kategori</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {CATEGORIES.map((cat) => {
          const count = data[cat.value] ?? 0;
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={cat.value} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{cat.emoji} {cat.label}</span>
                <span className="font-mono text-muted-foreground">{count}</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat.value] }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
