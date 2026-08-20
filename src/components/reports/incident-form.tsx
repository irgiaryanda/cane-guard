"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, type CategoryValue } from "@/lib/constants";
import type { IncidentInsert } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Loader2 } from "lucide-react";
import GpsButton from "./gps-button";
import PhotoCapture from "./photo-capture";
import DynamicMiniMap from "@/components/maps/dynamic-mini-map";
import { useGeolocation } from "@/hooks/use-geolocation";

export default function IncidentForm() {
  const router = useRouter();
  const { latitude, longitude, loading: gpsLoading, error: gpsError, fetchLocation, setPosition } = useGeolocation();

  const [category, setCategory] = useState<CategoryValue | "">("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterNote, setReporterNote] = useState("");
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handlePhotoComplete(path: string, url: string) {
    setPhotoPath(path);
    setPhotoUrl(url);
  }

  function handleClearPhoto() {
    setPhotoPath(null);
    setPhotoUrl(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!category) { setFormError("Pilih kategori insiden"); return; }
    if (!description.trim()) { setFormError("Deskripsi harus diisi"); return; }
    if (latitude === null || longitude === null) { setFormError("Lokasi GPS harus ditentukan"); return; }

    setSubmitting(true);
    const supabase = createClient();

    const payload: IncidentInsert = {
      category: category as CategoryValue,
      description: description.trim(),
      latitude,
      longitude,
    };
    if (reporterName.trim()) payload.reporter_name = reporterName.trim();
    if (reporterNote.trim()) payload.reporter_note = reporterNote.trim();
    if (photoPath) payload.photo_path = photoPath;
    if (photoUrl) payload.photo_url = photoUrl;

    const { error } = await supabase.from("incidents").insert(payload);

    if (error) {
      setFormError("Gagal menyimpan laporan. Coba lagi.");
      setSubmitting(false);
      return;
    }

    router.push("/report/success");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lapor Insiden</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{formError}</div>
          )}

          <div className="space-y-2">
            <Label>Kategori Insiden *</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as CategoryValue)}>
              <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Textarea
              id="description"
              placeholder="Jelaskan insiden secara singkat..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reporterName">Nama Pelapor</Label>
            <Input
              id="reporterName"
              placeholder="Nama atau inisial"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reporterNote">Catatan</Label>
            <Textarea
              id="reporterNote"
              placeholder="Informasi tambahan..."
              rows={2}
              value={reporterNote}
              onChange={(e) => setReporterNote(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Foto Insiden</Label>
            <PhotoCapture
              currentPhotoUrl={photoUrl}
              onUploadComplete={handlePhotoComplete}
              onClear={handleClearPhoto}
            />
          </div>

          <div className="space-y-2">
            <Label>Lokasi GPS *</Label>
            <GpsButton loading={gpsLoading} onClick={fetchLocation} />
            {gpsError && <p className="text-xs text-destructive">{gpsError}</p>}
            {latitude !== null && longitude !== null && (
              <p className="text-xs text-muted-foreground">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            )}
            <DynamicMiniMap latitude={latitude} longitude={longitude} onPositionChange={setPosition} />
            <p className="text-xs text-muted-foreground">Klik peta atau geser pin untuk menyesuaikan lokasi</p>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? "Mengirim..." : "Kirim Laporan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
