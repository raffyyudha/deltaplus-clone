"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ImageUploaderProps {
  currentImage: string;
  onImageChange: (url: string) => void;
  label?: string;
  bucket?: string;
  folder?: string;
  className?: string;
}

export default function ImageUploader({
  currentImage,
  onImageChange,
  label = "Image",
  bucket = "site-images",
  folder = "uploads",
  className = "",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new window.Image();
      img.onload = () => {
        const maxSize = 1200;
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/webp" }));
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.85
        );
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      setProgress(10);

      try {
        // Compress image
        setProgress(30);
        const compressed = await compressImage(file);
        setProgress(50);

        // Generate unique filename
        const ext = "webp";
        const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        setProgress(70);

        let { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filename, compressed, {
            cacheControl: "3600",
            upsert: false,
          });

        // Auto-create bucket if missing
        if (uploadError && (
          uploadError.message?.toLowerCase().includes("not found") ||
          uploadError.message?.toLowerCase().includes("bucket")
        )) {
          try {
            await supabase.storage.createBucket(bucket, { public: true });
            const retry = await supabase.storage
              .from(bucket)
              .upload(filename, compressed, {
                cacheControl: "3600",
                upsert: false,
              });
            data = retry.data;
            uploadError = retry.error;
          } catch (bErr) {
            console.warn("Could not auto-create bucket:", bErr);
          }
        }

        if (uploadError) {
          if (uploadError.message?.toLowerCase().includes("not found") || uploadError.message?.toLowerCase().includes("bucket")) {
            throw new Error(`Storage bucket '${bucket}' was not found in Supabase. Please go to Supabase Dashboard -> Storage -> Create New Bucket named '${bucket}' (set to Public) or run the SQL setup script.`);
          }
          throw uploadError;
        }

        setProgress(90);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data!.path);

        setProgress(100);
        onImageChange(urlData.publicUrl);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
        setError(message);
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [bucket, folder, onImageChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-bold text-[#1e2a32]">{label}</label>

      {/* Current Image Preview */}
      {currentImage && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 group">
          <Image
            src={currentImage}
            alt="Current image preview"
            fill
            className="object-contain p-2"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-[#1e2a32] px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:scale-105 transition-transform"
            >
              📸 Change Image
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-[#f5c80c] bg-yellow-50"
            : "border-gray-200 hover:border-[#f5c80c] hover:bg-yellow-50/30"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-3">
            <div className="w-10 h-10 mx-auto bg-[#f5c80c]/20 rounded-full flex items-center justify-center animate-spin">
              <svg className="w-5 h-5 text-[#f5c80c]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#1e2a32]">Uploading...</p>
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#f5c80c] h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
            <p className="text-sm font-semibold text-[#1e2a32]">
              {currentImage ? "Replace image" : "Upload image"}
            </p>
            <p className="text-xs text-gray-400">
              Drag & drop or click to browse • Max 5MB
            </p>
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={currentImage}
          onChange={(e) => onImageChange(e.target.value)}
          placeholder="Or paste image URL here..."
          className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f5c80c] focus:border-transparent"
        />
      </div>

      {error && (
        <div className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 p-3 rounded-xl space-y-1">
          <p className="font-bold flex items-center gap-1">⚠️ {error}</p>
        </div>
      )}
    </div>
  );
}
