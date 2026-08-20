"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import type { MiniMapProps } from "./map-props";

function ClickHandler({ onPositionChange }: Pick<MiniMapProps, "onPositionChange">) {
  useMapEvents({ click: (event) => onPositionChange(event.latlng.lat, event.latlng.lng) });
  return null;
}

export default function MiniMap({ latitude, longitude, onPositionChange }: MiniMapProps) {
  const position: LatLngExpression = [latitude ?? -2.5, longitude ?? 118];
  const icon = L.divIcon({ className: "mini-marker", html: "<span style='display:block;width:24px;height:24px;border-radius:50%;background:#16a34a;border:3px solid white'></span>", iconSize: [24, 24], iconAnchor: [12, 12] });
  return (
    <MapContainer center={position} zoom={latitude ? 15 : 5} className="h-[250px] w-full rounded-lg" scrollWheelZoom>
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler onPositionChange={onPositionChange} />
      {latitude !== null && longitude !== null && <Marker position={[latitude, longitude]} icon={icon} draggable eventHandlers={{ dragend: (event) => { const point = event.target.getLatLng(); onPositionChange(point.lat, point.lng); } }} />}
    </MapContainer>
  );
}
