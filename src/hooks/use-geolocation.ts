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
      setState((current) => ({
        ...current,
        loading: false,
        error: "Geolocation tidak didukung oleh browser ini",
      }));
      return;
    }

    setState((current) => ({ ...current, loading: true, error: null }));

    const success = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        loading: false,
        error: null,
      });
    };

    const fallback = () => {
      navigator.geolocation.getCurrentPosition(
        success,
        (error) => {
          let message = "Gagal mengambil lokasi";
          if (error.code === 1) message = "Izin lokasi ditolak";
          if (error.code === 2) message = "Lokasi tidak tersedia";
          if (error.code === 3) message = "Lokasi tidak ditemukan. Pastikan GPS aktif lalu coba lagi.";
          setState((current) => ({ ...current, loading: false, error: message }));
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 300000 }
      );
    };

    navigator.geolocation.getCurrentPosition(success, fallback, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  }, []);

  const setPosition = useCallback((latitude: number, longitude: number) => {
    setState((current) => ({
      ...current,
      latitude,
      longitude,
      accuracy: null,
      error: null,
    }));
  }, []);

  return { ...state, fetchLocation, setPosition };
}
