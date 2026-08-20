"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useIncidents, updateIncidentStatus } from "@/hooks/use-incidents";
import IncidentMap from "@/components/maps/dynamic-map";
import GisSearch, { filterIncidentsByRadius, type GisFilters } from "@/components/maps/gis-search";
import type { StatusValue } from "@/lib/constants";

function MapContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("id") ?? undefined;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const { data: allIncidents, loading, refetch } = useIncidents();
  const [gisFilters, setGisFilters] = useState<GisFilters>({
    latitude: lat ?? "",
    longitude: lng ?? "",
    radius: "10",
    category: "all",
    status: "all",
  });

  const filteredIncidents = useMemo(
    () => filterIncidentsByRadius(allIncidents, gisFilters),
    [allIncidents, gisFilters]
  );

  const handleStatusChange = useCallback(async (id: string, status: StatusValue) => {
    await updateIncidentStatus(id, status);
    refetch();
  }, [refetch]);

  const center = lat && lng ? [parseFloat(lat), parseFloat(lng)] as [number, number] : undefined;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
      </div>
      <h1 className="mb-4 text-2xl font-bold">Peta Insiden</h1>

      <GisSearch onFilterChange={setGisFilters} totalResults={filteredIncidents.length} />

      {loading ? (
        <div className="flex h-[600px] items-center justify-center rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Memuat data insiden...</p>
        </div>
      ) : (
        <IncidentMap
          incidents={filteredIncidents}
          center={center}
          highlightId={highlightId}
          onStatusChange={handleStatusChange}
          className="h-[600px] w-full rounded-lg"
        />
      )}
    </div>
  );
}

export default function DashboardMapPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Peta Insiden</h1>
        <div className="flex h-[600px] items-center justify-center rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Memuat peta...</p>
        </div>
      </div>
    }>
      <MapContent />
    </Suspense>
  );
}
