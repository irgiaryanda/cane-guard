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
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  function handleClear() {
    setCompressedFile(null);
    setLocalPreview(null);
    onClear();
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      const previewUrl = URL.createObjectURL(compressed);
      setCompressedFile(compressed);
      setLocalPreview(previewUrl);

      const extension = file.name.split(".").pop() ?? "jpg";
      const filePath = `incidents/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${extension}`;
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(INCIDENT_BUCKET)
        .upload(filePath, compressed, { contentType: compressed.type });
      if (error) throw error;

      const { data } = supabase.storage
        .from(INCIDENT_BUCKET)
        .getPublicUrl(filePath);
      onUploadComplete(filePath, data.publicUrl);
    } catch {
      setCompressedFile(null);
      setLocalPreview(null);
      alert("Gagal mengupload foto");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const previewUrl = currentPhotoUrl ?? localPreview;

  if (previewUrl) {
    return (
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
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}
