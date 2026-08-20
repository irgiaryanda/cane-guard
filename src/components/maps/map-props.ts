import type { LatLngExpression } from "leaflet";
import type { Incident } from "@/lib/types";
import type { StatusValue } from "@/lib/constants";

export interface IncidentMapProps {
  incidents?: Incident[];
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
  highlightId?: string;
  onStatusChange?: (id: string, status: StatusValue) => void;
}

export interface MiniMapProps {
  latitude: number | null;
  longitude: number | null;
  onPositionChange: (latitude: number, longitude: number) => void;
}
