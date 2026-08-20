"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Flame, Clock, CheckCircle2 } from "lucide-react";

interface MetricCardsProps {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}

export default function MetricCards({ total, open, inProgress, closed }: MetricCardsProps) {
  const cards = [
    { title: "Total Insiden", value: total, icon: AlertTriangle, color: "text-blue-600" },
    { title: "Belum Ditangani", value: open, icon: Flame, color: "text-red-600" },
    { title: "Sedang Diproses", value: inProgress, icon: Clock, color: "text-amber-600" },
    { title: "Selesai", value: closed, icon: CheckCircle2, color: "text-green-600" },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
