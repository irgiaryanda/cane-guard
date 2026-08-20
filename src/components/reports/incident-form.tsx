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
import { Send, Loader2, CheckCircle, ChevronRight, ChevronLeft, Shield } from "lucide-react";
import PhotoCapture from "./photo-capture";
import DynamicMiniMap from "@/components/maps/dynamic-mini-map";
import { useGeolocation } from "@/hooks/use-geolocation";

const STEPS = ["Kategori", "Detail", "Foto & Lokasi"];

export default function IncidentForm() {
  const router = useRouter();
  const {
    latitude,
    longitude,
    loading: gpsLoading,
    error: gpsError,
    fetchLocation,
    setPosition,
  } = useGeolocation();

  const [step, setStep] = useState(0);
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

  function validateStep(): string | null {
    if (step === 0 && !category) return "Pilih kategori insiden";
    if (step === 1 && !description.trim()) return "Deskripsi harus diisi";
    if (step === 2 && (latitude === null || longitude === null))
      return "Lokasi GPS harus ditentukan";
    return null;
  }

  function handleNext() {
    const error = validateStep();
    if (error) {
      setFormError(error);
      return;
    }
    setFormError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function handleBack() {
    setFormError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const error = validateStep();
    if (error) {
      setFormError(error);
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    const payload: IncidentInsert = {
      category: category as CategoryValue,
      description: description.trim(),
      latitude: latitude!,
      longitude: longitude!,
    };
    if (reporterName.trim()) payload.reporter_name = reporterName.trim();
    if (reporterNote.trim()) payload.reporter_note = reporterNote.trim();
    if (photoPath) payload.photo_path = photoPath;
    if (photoUrl) payload.photo_url = photoUrl;

    const { error: insertErr } = await supabase.from("incidents").insert(payload);

    if (insertErr) {
      console.error("Insert failed:", insertErr.message);
      setFormError(`Gagal menyimpan: ${insertErr.message}`);
      setSubmitting(false);
      return;
    }

    router.push("/report/success");
  }

  const selectedCategory = CATEGORIES.find((c) => c.value === category);

  return (
    <div className="mx-auto w-full max-w-lg space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-emerald-800">Cane Guard</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Laporkan insiden di area perkebunan tebu
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                i < step
                  ? "bg-emerald-600 text-white"
                  : i === step
                    ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-600"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < step ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                i + 1
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 rounded ${
                  i < step ? "bg-emerald-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground">
        {STEPS[step]}
      </div>

      {/* Form */}
      <Card className="border-emerald-100 shadow-lg">
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === STEPS.length - 1) handleSubmit(e);
              else handleNext();
            }}
            className="space-y-5"
          >
            {formError && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                {formError}
              </div>
            )}

            {/* Step 0: Category */}
            {step === 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Apa jenis insiden?
                </Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                        category === cat.value
                          ? "border-emerald-500 bg-emerald-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <div>
                        <div className="text-sm font-medium">{cat.label}</div>
                      </div>
                      {category === cat.value && (
                        <CheckCircle className="ml-auto h-5 w-5 text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Detail */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">
                    Deskripsi Insiden *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan insiden secara singkat... Contoh: Terjadi kebakaran di Blok A7 sekitar pukul 14:00 WIB"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reporterName" className="text-sm font-medium">
                    Nama Pelapor
                  </Label>
                  <Input
                    id="reporterName"
                    placeholder="Nama atau inisial (opsional)"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reporterNote" className="text-sm font-medium">
                    Catatan Tambahan
                  </Label>
                  <Textarea
                    id="reporterNote"
                    placeholder="Informasi tambahan yang relevan (opsional)"
                    rows={2}
                    value={reporterNote}
                    onChange={(e) => setReporterNote(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Photo & Location */}
            {step === 2 && (
              <div className="space-y-5">
                {/* Photo */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Foto Insiden</Label>
                  <p className="text-xs text-muted-foreground">
                    Ambil atau unggah foto untuk membantu identifikasi
                  </p>
                  <PhotoCapture
                    currentPhotoUrl={photoUrl}
                    onUploadComplete={handlePhotoComplete}
                    onClear={handleClearPhoto}
                  />
                </div>

                {/* GPS */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Lokasi Kejadian *
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={latitude !== null ? "default" : "outline"}
                      size="sm"
                      onClick={fetchLocation}
                      disabled={gpsLoading}
                      className={`gap-2 ${
                        latitude !== null
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : ""
                      }`}
                    >
                      {gpsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : latitude !== null ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span>📍</span>
                      )}
                      {gpsLoading
                        ? "Mengambil lokasi..."
                        : latitude !== null
                          ? "Lokasi Tertangkap"
                          : "Tangkap Lokasi GPS"}
                    </Button>
                    {latitude !== null && longitude !== null && (
                      <span className="text-xs text-muted-foreground font-mono">
                        {latitude.toFixed(5)}, {longitude.toFixed(5)}
                      </span>
                    )}
                  </div>
                  {gpsError && (
                    <p className="text-xs text-destructive">{gpsError}</p>
                  )}

                  <div className="overflow-hidden rounded-lg border">
                    <DynamicMiniMap
                      latitude={latitude}
                      longitude={longitude}
                      onPositionChange={setPosition}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Klik peta atau geser pin untuk menyesuaikan lokasi
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Kembali
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button type="submit" className="flex-1 gap-1 bg-emerald-600 hover:bg-emerald-700">
                  Selanjutnya
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {submitting ? "Mengirim..." : "Kirim Laporan"}
                </Button>
              )}
            </div>

            {/* Summary on last step */}
            {step === STEPS.length - 1 && (
              <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm border">
                <div className="font-semibold text-gray-700">Ringkasan:</div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kategori</span>
                  <span>
                    {selectedCategory?.emoji} {selectedCategory?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deskripsi</span>
                  <span className="max-w-[200px] truncate text-right">
                    {description}
                  </span>
                </div>
                {reporterName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pelapor</span>
                    <span>{reporterName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Foto</span>
                  <span>{photoUrl ? "✓ Terunggah" : "Tidak ada"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lokasi</span>
                  <span className="font-mono text-xs">
                    {latitude?.toFixed(5)}, {longitude?.toFixed(5)}
                  </span>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
