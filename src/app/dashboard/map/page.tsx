"use client";

import { useIncidents } from "@/hooks/use-incidents";
import IncidentMap from "@/components/maps/dynamic-map";

export default function DashboardMapPage() {
  const { data: incidents, loading } = useIncidents();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Peta Insiden</h1>
      {loading ? (
        <div className="flex h-[600px] items-center justify-center rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Memuat data insiden...</p>
        </div>
      ) : (
        <IncidentMap incidents={incidents} className="h-[600px] w-full rounded-lg" />
      )}
    </div>
  );
}
