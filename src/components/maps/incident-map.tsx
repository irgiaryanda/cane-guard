"use client";

import { useCallback, useEffect, memo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { Incident } from "@/lib/types";
import { CATEGORIES, STATUSES, CATEGORY_MARKER_COLORS, type StatusValue } from "@/lib/constants";
import type { IncidentMapProps } from "./map-props";

const ICONS = Object.fromEntries(
  Object.entries(CATEGORY_MARKER_COLORS).map(([category, color]) => [
    category,
    L.divIcon({
      className: "cane-marker",
      html: `<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:3px solid white;box-shadow:0 1px 5px #0006"><i style="display:block;width:8px;height:8px;background:white;border-radius:50%;margin:6px auto"></i></span>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -26],
    }),
  ])
) as Record<Incident["category"], L.DivIcon>;

const STATUS_COLORS: Record<StatusValue, string> = {
  OPEN: "#ef4444",
  ON_PROGRESS: "#f59e0b",
  CLOSED: "#22c55e",
};

const STATUS_TRANSITIONS: Partial<Record<StatusValue, StatusValue>> = {
  OPEN: "ON_PROGRESS",
  ON_PROGRESS: "CLOSED",
  CLOSED: "OPEN",
};

const STATUS_BUTTON_LABELS: Record<StatusValue, string> = {
  OPEN: "Mulai Proses",
  ON_PROGRESS: "Selesaikan",
  CLOSED: "Buka Kembali",
};

function FlyToTarget({ highlightId, incidents }: { highlightId: string; incidents: Incident[] }) {
  const map = useMap();
  const prevRef = useRef<string | null>(null);

  useEffect(() => {
    if (!highlightId || highlightId === prevRef.current) return;
    prevRef.current = highlightId;
    const target = incidents.find((i) => i.id === highlightId);
    if (!target) return;
    map.flyTo([target.latitude, target.longitude], 16, { animate: true });
  }, [highlightId, incidents, map]);

  return null;
}

function IncidentPopup({
  incident,
  onStatusChange,
}: {
  incident: Incident;
  onStatusChange?: (id: string, status: StatusValue) => void;
}) {
  const category = CATEGORIES.find((c) => c.value === incident.category);
  const status = STATUSES.find((s) => s.value === incident.status);
  const nextStatus = STATUS_TRANSITIONS[incident.status];
  const buttonLabel = STATUS_BUTTON_LABELS[incident.status];

  return (
    <div style={{ minWidth: 220, maxWidth: 280, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{category?.emoji}</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{category?.label}</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>
            {new Date(incident.created_at).toLocaleString("id-ID", {
              day: "numeric", month: "short", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      {incident.photo_url && (
        <img
          src={incident.photo_url}
          alt="Foto insiden"
          style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
        />
      )}

      <p style={{ fontSize: 13, color: "#374151", marginBottom: 6, lineHeight: 1.4 }}>
        {incident.description}
      </p>

      {(incident.reporter_name || incident.reporter_note) && (
        <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8, padding: "6px 8px", background: "#f9fafb", borderRadius: 4 }}>
          {incident.reporter_name && (
            <div><strong>Pelapor:</strong> {incident.reporter_name}</div>
          )}
          {incident.reporter_note && (
            <div style={{ marginTop: 2 }}><strong>Catatan:</strong> {incident.reporter_note}</div>
          )}
        </div>
      )}

      <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 8 }}>
        📍 {incident.latitude.toFixed(6)}, {incident.longitude.toFixed(6)}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#6b7280" }}>Status:</span>
          <span
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              color: "white",
              backgroundColor: STATUS_COLORS[incident.status],
            }}
          >
            {status?.label}
          </span>
        </div>
        {nextStatus && onStatusChange && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(incident.id, nextStatus);
            }}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              color: "white",
              backgroundColor: "#16a34a",
              border: "none",
              cursor: "pointer",
            }}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}

const MapMarkers = memo(function MapMarkers({
  incidents,
  onStatusChange,
}: {
  incidents: Incident[];
  onStatusChange?: (id: string, status: StatusValue) => void;
}) {
  return (
    <MarkerClusterGroup chunkedLoading>
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.latitude, incident.longitude]}
          icon={ICONS[incident.category]}
        >
          <Popup maxWidth={300}>
            <IncidentPopup incident={incident} onStatusChange={onStatusChange} />
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
});

export default function IncidentMap({
  incidents = [],
  center = [-2.5, 18],
  zoom = 5,
  className = "h-[600px] w-full",
  highlightId,
  onStatusChange,
}: IncidentMapProps) {
  const handlerRef = useRef(onStatusChange);
  handlerRef.current = onStatusChange;

  const stableStatusChange = useCallback(
    (id: string, status: StatusValue) => handlerRef.current?.(id, status),
    []
  );

  return (
    <MapContainer center={center} zoom={zoom} className={className} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {highlightId && <FlyToTarget highlightId={highlightId} incidents={incidents} />}
      <MapMarkers incidents={incidents} onStatusChange={stableStatusChange} />
    </MapContainer>
  );
}
