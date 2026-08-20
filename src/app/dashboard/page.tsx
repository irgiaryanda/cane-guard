"use client";

import { useMemo, useState } from "react";
import { useIncidents } from "@/hooks/use-incidents";
import MetricCards from "@/components/dashboard/metric-cards";
import CategoryChart from "@/components/dashboard/category-chart";
import IncidentTable from "@/components/dashboard/incident-table";
import type { CategoryValue, StatusValue } from "@/lib/constants";
import { CATEGORIES, STATUSES } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DashboardPage() {
  const [filterCategory, setFilterCategory] = useState<CategoryValue | "all">("all");
  const [filterStatus, setFilterStatus] = useState<StatusValue | "all">("all");

  const filters = useMemo(() => {
    const f: Record<string, string> = {};
    if (filterCategory !== "all") f.category = filterCategory;
    if (filterStatus !== "all") f.status = filterStatus;
    return f;
  }, [filterCategory, filterStatus]);

  const { data: incidents, loading, refetch } = useIncidents(filters);

  const stats = useMemo(() => ({
    total: incidents.length,
    open: incidents.filter((i) => i.status === "OPEN").length,
    inProgress: incidents.filter((i) => i.status === "ON_PROGRESS").length,
    closed: incidents.filter((i) => i.status === "CLOSED").length,
  }), [incidents]);

  const categoryDist = useMemo(() => {
    const dist: Record<CategoryValue, number> = { FIRE: 0, PEST: 0, DISEASE: 0, FLOODING: 0, OTHER: 0 };
    incidents.forEach((i) => { dist[i.category]++; });
    return dist;
  }, [incidents]);

  return (
    <div className="px-4 py-6 lg:px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Ringkasan insiden dan status terkini</p>
      </div>

      <MetricCards {...stats} />

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">Data Insiden</h2>
            <div className="flex flex-wrap gap-2">
              <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as CategoryValue | "all")}>
                <SelectTrigger className="h-8 w-[160px] border-zinc-700 bg-zinc-800 text-xs text-zinc-300"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as StatusValue | "all")}>
                <SelectTrigger className="h-8 w-[140px] border-zinc-700 bg-zinc-800 text-xs text-zinc-300"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="all">Semua Status</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="py-12 text-center text-zinc-500">Memuat data...</div>
            ) : (
              <IncidentTable incidents={incidents} onStatusChange={refetch} />
            )}
          </div>
        </div>

        <CategoryChart data={categoryDist} />
      </div>
    </div>
  );
}
