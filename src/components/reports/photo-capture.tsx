"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { INCIDENT_BUCKET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

interface PhotoCaptureProps {
  onUploadComplete: (path: string, url: string) => void;
  currentPhotoUrl: string | null;
  onClear: () => void;
}

export default function PhotoCapture({
  onUploadComplete,
  currentPhotoUrl,
  onClear,
}: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  function handleClear() {
    setLocalPreview(null);
    setUploadError(null);
    onClear();
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      const previewUrl = URL.createObjectURL(compressed);
      setLocalPreview(previewUrl);

      const ext = compressed.type === "image/webp"
        ? "webp"
        : compressed.type === "image/png"
          ? "png"
          : "jpg";
      const filePath = `incidents/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const supabase = createClient();

      const { error: uploadErr } = await supabase.storage
        .from(INCIDENT_BUCKET)
        .upload(filePath, compressed, { contentType: compressed.type, upsert: false });
      if (uploadErr) {
        console.error("Storage upload failed:", uploadErr.message);
        setUploadError(uploadErr.message);
        setLocalPreview(null);
        return;
      }

      const { data: urlData } = supabase.storage
        .from(INCIDENT_BUCKET)
        .getPublicUrl(filePath);
      onUploadComplete(filePath, urlData.publicUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Photo upload error:", msg);
      setUploadError(msg);
      setLocalPreview(null);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const previewUrl = currentPhotoUrl ?? localPreview;

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview foto insiden"
            className="w-full max-h-48 rounded-md object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={handleClear}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="outline"
            className="h-24 w-full gap-2"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Camera className="h-6 w-6" />
            )}
            {uploading ? "Mengupload..." : "Ambil Foto"}
          </Button>
        </>
      )}
      {uploadError && (
        <p className="text-xs text-destructive">
          Gagal upload: {uploadError}
        </p>
      )}
    </div>
  );
}
