"use client";

import { useMemo, useState } from "react";
import { useIncidents } from "@/hooks/use-incidents";
import MetricCards from "@/components/dashboard/metric-cards";
import CategoryChart from "@/components/dashboard/category-chart";
import IncidentTable from "@/components/dashboard/incident-table";
import type { CategoryValue, StatusValue } from "@/lib/constants";
import { CATEGORIES, STATUSES } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <MetricCards {...stats} />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Data Insiden</CardTitle>
            <div className="flex flex-wrap gap-3 pt-2">
              <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as CategoryValue | "all")}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as StatusValue | "all")}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Memuat data...</div>
            ) : (
              <IncidentTable incidents={incidents} onStatusChange={refetch} />
            )}
          </CardContent>
        </Card>

        <CategoryChart data={categoryDist} />
      </div>
    </div>
  );
}
