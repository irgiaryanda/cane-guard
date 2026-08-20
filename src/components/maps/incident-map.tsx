"use client";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { Incident } from "@/lib/types";
import { CATEGORIES, CATEGORY_MARKER_COLORS } from "@/lib/constants";
import type { IncidentMapProps } from "./map-props";

function iconFor(category: Incident["category"]) {
  const color = CATEGORY_MARKER_COLORS[category];
  return L.divIcon({
    className: "cane-marker",
    html: `<span style="display:block;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:3px solid white;box-shadow:0 1px 5px #0006"><i style="display:block;width:8px;height:8px;background:white;border-radius:50%;margin:6px auto"></i></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
  });
}

export default function IncidentMap({
  incidents = [],
  center = [-2.5, 118],
  zoom = 5,
  className = "h-[600px] w-full",
}: IncidentMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} className={className} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {incidents.map((incident) => {
          const category = CATEGORIES.find((item) => item.value === incident.category);
          return (
            <Marker
              key={incident.id}
              position={[incident.latitude, incident.longitude]}
              icon={iconFor(incident.category)}
            >
              <Popup>
                <strong>{category?.emoji} {category?.label}</strong>
                <p>{incident.description}</p>
                <small>{new Date(incident.created_at).toLocaleString("id-ID")}</small>
                {incident.photo_url && <img src={incident.photo_url} alt="Foto incident" className="mt-2 max-h-32 w-full object-cover" />}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
