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
    latitude: lat ?? "", longitude: lng ?? "", radius: "10", category: "all", status: "all",
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
    <div className="px-4 py-6 lg:px-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4">
        <ChevronLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Link>
      <h1 className="mb-4 text-2xl font-bold text-white">Peta Insiden</h1>
      <GisSearch onFilterChange={setGisFilters} totalResults={filteredIncidents.length} />
      {loading ? (
        <div className="flex h-[600px] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60">
          <p className="text-sm text-zinc-500">Memuat data insiden...</p>
        </div>
      ) : (
        <IncidentMap
          incidents={filteredIncidents}
          center={center}
          highlightId={highlightId}
          onStatusChange={handleStatusChange}
          className="h-[600px] w-full rounded-xl"
        />
      )}
    </div>
  );
}

export default function DashboardMapPage() {
  return (
    <Suspense fallback={
      <div className="px-4 py-6 lg:px-6">
        <h1 className="mb-4 text-2xl font-bold text-white">Peta Insiden</h1>
        <div className="flex h-[600px] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60">
          <p className="text-sm text-zinc-500">Memuat peta...</p>
        </div>
      </div>
    }>
      <MapContent />
    </Suspense>
  );
}
