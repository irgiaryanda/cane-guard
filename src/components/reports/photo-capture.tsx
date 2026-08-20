"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import imageCompression from "browser-image-compression";
import { INCIDENT_BUCKET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

interface PhotoCaptureProps {
  onUploadComplete: (path: string, url: string) => void;
  currentPhotoUrl: string | null;
  onClear: () => void;
}

export default function PhotoCapture({ onUploadComplete, currentPhotoUrl, onClear }: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  function handleClear() {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    onClear();
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        useWebWorker: true,
        maxWidthOrHeight: 1920,
      });
      // Local preview from compressed blob
      const previewUrl = URL.createObjectURL(compressed);
      setLocalPreview(previewUrl);

      const ext = file.name.split(".").pop() ?? "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = `incidents/${fileName}`;
      const supabase = createClient();
      await supabase.storage
        .from(INCIDENT_BUCKET)
        .upload(filePath, compressed, { contentType: compressed.type });
      const { data: urlData } = supabase.storage
        .from(INCIDENT_BUCKET)
        .getPublicUrl(filePath);
      // Replace local preview with Supabase URL
      onUploadComplete(filePath, urlData.publicUrl);
    } catch {
      alert("Gagal mengupload foto");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const previewUrl = localPreview ?? currentPhotoUrl;

  if (previewUrl) {
    return (
      <div className="relative">
        <img
          src={previewUrl}
          alt="Preview foto insiden"
          className="h-48 w-full rounded-lg object-cover"
          onLoad={() => {
            // Revoke local preview once parent has a Supabase URL
            if (localPreview && currentPhotoUrl && currentPhotoUrl !== localPreview) {
              URL.revokeObjectURL(localPreview);
              setLocalPreview(null);
            }
          }}
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
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
