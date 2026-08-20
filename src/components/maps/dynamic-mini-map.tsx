"use client";

import dynamic from "next/dynamic";
import type { MiniMapProps } from "./map-props";

const MiniMap = dynamic<MiniMapProps>(() => import("./mini-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[250px] items-center justify-center rounded-lg border bg-muted">
      <p className="text-xs text-muted-foreground">Memuat peta...</p>
    </div>
  ),
});

export default MiniMap;
