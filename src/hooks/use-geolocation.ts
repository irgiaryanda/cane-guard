"use client";

import { useState, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
  });

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "Geolocation tidak didukung" }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
        });
      },
      (err) => {
        let msg = "Gagal mengambil lokasi";
        if (err.code === 1) msg = "Izin lokasi ditolak";
        else if (err.code === 2) msg = "Lokasi tidak tersedia";
        else if (err.code === 3) msg = "Permintaan lokasi habis waktu";
        setState((s) => ({ ...s, loading: false, error: msg }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  const setPosition = useCallback((lat: number, lng: number) => {
    setState((s) => ({ ...s, latitude: lat, longitude: lng, error: null }));
  }, []);

  return { ...state, fetchLocation, setPosition };
}
