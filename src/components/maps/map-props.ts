import type { LatLngExpression } from "leaflet";
import type { Incident } from "@/lib/types";

export interface IncidentMapProps {
  incidents?: Incident[];
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
}

export interface MiniMapProps {
  latitude: number | null;
  longitude: number | null;
  onPositionChange: (latitude: number, longitude: number) => void;
}
