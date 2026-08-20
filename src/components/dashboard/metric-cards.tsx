"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Flame, Clock3, CheckCircle2 } from "lucide-react";

interface MetricCardsProps {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}

const cards = [
  { key: "total", title: "Total Insiden", icon: AlertTriangle, iconColor: "#2563eb", accent: "#2563eb" },
  { key: "open", title: "Belum Ditangani", icon: Flame, iconColor: "#dc2626", accent: "#dc2626" },
  { key: "inProgress", title: "Sedang Diproses", icon: Clock3, iconColor: "#d97706", accent: "#d97706" },
  { key: "closed", title: "Selesai", icon: CheckCircle2, iconColor: "#059669", accent: "#059669" },
] as const;

export default function MetricCards({ total, open, inProgress, closed }: MetricCardsProps) {
  const values = { total, open, inProgress, closed };

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.key}
            className="relative overflow-hidden border-0 bg-white shadow-sm"
          >
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundColor: card.accent }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
              <CardTitle className="text-xs font-semibold text-slate-500 sm:text-sm">
                {card.title}
              </CardTitle>
              <Icon
                className="h-5 w-5"
                style={{ color: card.iconColor }}
                strokeWidth={2.2}
              />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-slate-900">
                {values[card.key]}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
