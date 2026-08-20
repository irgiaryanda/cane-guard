"use client";

import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GpsButtonProps {
  loading: boolean;
  onClick: () => void;
}

export default function GpsButton({ loading, onClick }: GpsButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={loading} className="gap-2">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
      {loading ? "Mengambil Lokasi..." : "Ambil Lokasi GPS"}
    </Button>
  );
}
