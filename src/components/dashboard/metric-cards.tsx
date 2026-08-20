"use client";

import { AlertTriangle, Flame, Clock3, CheckCircle2 } from "lucide-react";

interface MetricCardsProps {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}

function TotalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

const CARDS = [
  { key: "total" as const, title: "Total Insiden", Icon: TotalIcon, dotColor: "#3b82f6" },
  { key: "open" as const, title: "Belum Ditangani", Icon: FlameIcon, dotColor: "#f97316" },
  { key: "inProgress" as const, title: "Sedang Diproses", Icon: ClockIcon, dotColor: "#eab308" },
  { key: "closed" as const, title: "Selesai", Icon: CheckIcon, dotColor: "#22c55e" },
];

export default function MetricCards({ total, open, inProgress, closed }: MetricCardsProps) {
  const values: Record<string, number> = { total, open, inProgress, closed };

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {CARDS.map(({ key, title, Icon, dotColor }) => (
        <div
          key={key}
          className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">{title}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dotColor }} />
              <Icon />
            </span>
          </div>
          <div className="mt-3 text-3xl font-bold tracking-tight text-white">{values[key]}</div>
        </div>
      ))}
    </div>
  );
}
