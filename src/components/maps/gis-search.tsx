"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, X } from "lucide-react";
import type { Incident } from "@/lib/types";
import type { CategoryValue, StatusValue } from "@/lib/constants";
import { CATEGORIES, STATUSES } from "@/lib/constants";

interface GisSearchProps {
  onFilterChange: (filters: GisFilters) => void;
  totalResults: number;
}

export interface GisFilters {
  latitude: string;
  longitude: string;
  radius: string;
  category: CategoryValue | "all";
  status: StatusValue | "all";
}

const RADIUS_OPTIONS = [
  { value: "1", label: "1 km" },
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" },
  { value: "100", label: "100 km" },
];

export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function filterIncidentsByRadius(
  incidents: Incident[],
  filters: GisFilters
): Incident[] {
  const lat = parseFloat(filters.latitude);
  const lng = parseFloat(filters.longitude);
  const radius = parseFloat(filters.radius);

  let results = incidents;

  // Radius filter
  if (!isNaN(lat) && !isNaN(lng) && !isNaN(radius) && radius > 0) {
    results = results.filter((incident) => {
      const dist = haversineDistance(lat, lng, incident.latitude, incident.longitude);
      return dist <= radius;
    });
  }

  // Category filter
  if (filters.category !== "all") {
    results = results.filter((i) => i.category === filters.category);
  }

  // Status filter
  if (filters.status !== "all") {
    results = results.filter((i) => i.status === filters.status);
  }

  return results;
}

export default function GisSearch({ onFilterChange, totalResults }: GisSearchProps) {
  const [filters, setFilters] = useState<GisFilters>({
    latitude: "",
    longitude: "",
    radius: "10",
    category: "all",
    status: "all",
  });

  function updateFilter(key: keyof GisFilters, value: string | null) {
    if (value === null) return;
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  }

  function handleGetCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateFilter("latitude", pos.coords.latitude.toFixed(6));
        updateFilter("longitude", pos.coords.longitude.toFixed(6));
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleClear() {
    const empty: GisFilters = {
      latitude: "",
      longitude: "",
      radius: "10",
      category: "all",
      status: "all",
    };
    setFilters(empty);
    onFilterChange(empty);
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Search className="h-4 w-4" />
          Pencarian Koordinat & Radius
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {/* Latitude */}
          <div className="space-y-1">
            <Label className="text-xs">Latitude</Label>
            <Input
              type="number"
              step="any"
              placeholder="-2.500000"
              value={filters.latitude}
              onChange={(e) => updateFilter("latitude", e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Longitude */}
          <div className="space-y-1">
            <Label className="text-xs">Longitude</Label>
            <Input
              type="number"
              step="any"
              placeholder="118.000000"
              value={filters.longitude}
              onChange={(e) => updateFilter("longitude", e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          {/* Radius */}
          <div className="space-y-1">
            <Label className="text-xs">Radius</Label>
            <Select value={filters.radius} onValueChange={(v) => updateFilter("radius", v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RADIUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label className="text-xs">Kategori</Label>
            <Select value={filters.category} onValueChange={(v) => updateFilter("category", v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.emoji} {c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label className="text-xs">Status</Label>
            <Select value={filters.status} onValueChange={(v) => updateFilter("status", v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={handleGetCurrentLocation}
            >
              <MapPin className="h-3 w-3" />
              Lokasi Saya
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-xs text-muted-foreground">
          {totalResults} insiden ditemukan
          {filters.latitude && filters.longitude && filters.radius && (
            <> dalam radius {filters.radius} km</>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
