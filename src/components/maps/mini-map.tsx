"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import type { MiniMapProps } from "./map-props";

function FlyTo({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  const initialRef = useRef(true);

  useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    map.flyTo([latitude, longitude], 15, { animate: false });
  }, [latitude, longitude, map]);

  return null;
}

const MARKER_ICON = L.divIcon({
  className: "mini-marker",
  html: "<span style='display:block;width:24px;height:24px;border-radius:50%;background:#16a34a;border:3px solid white;box-shadow:0 1px 3px rgba(0,0,0,.3)'></span>",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function MiniMap({ latitude, longitude, onPositionChange }: MiniMapProps) {
  const initialPosition: LatLngExpression = [latitude ?? -2.5, longitude ?? 118];

  return (
    <MapContainer
      center={initialPosition}
      zoom={latitude ? 15 : 5}
      className="h-[250px] w-full rounded-lg"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MiniMapClickHandler onPositionChange={onPositionChange} />
      {latitude !== null && longitude !== null && (
        <>
          <FlyTo latitude={latitude} longitude={longitude} />
          <Marker
            position={[latitude, longitude]}
            icon={MARKER_ICON}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const point = event.target.getLatLng();
                onPositionChange(point.lat, point.lng);
              },
            }}
          />
        </>
      )}
    </MapContainer>
  );
}

function MiniMapClickHandler({ onPositionChange }: Pick<MiniMapProps, "onPositionChange">) {
  const handlerRef = useRef(onPositionChange);
  handlerRef.current = onPositionChange;

  const map = useMap();

  useEffect(() => {
    const handleClick = (e: { latlng: { lat: number; lng: number } }) => {
      handlerRef.current(e.latlng.lat, e.latlng.lng);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map]);

  return null;
}
