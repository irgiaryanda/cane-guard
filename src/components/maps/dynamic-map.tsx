"use client";

import dynamic from "next/dynamic";
import type { IncidentMapProps } from "./map-props";

const IncidentMap = dynamic<IncidentMapProps>(() => import("./incident-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg bg-muted">
      <p className="text-sm text-muted-foreground">Memuat peta...</p>
    </div>
  ),
});

export default IncidentMap;
