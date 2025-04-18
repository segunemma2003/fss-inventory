"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export const ImageUploadOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
      <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm p-2 rounded-full">
        <Camera className="w-5 h-5 text-white" />
      </div>
    </div>
  );
};

interface ImageUploaderProps {
  onImageUpload?: (file: File) => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  className,
}) => {
  const [image, setImage] = useState<string | null>(
    "https://img.freepik.com/premium-psd/ice-cube-border-transparent-background_53876-209958.jpg"
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        if (onImageUpload) {
          onImageUpload(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      {image && (
        <img
          src={image}
          alt="Profile picture"
          className="w-full h-full object-cover"
        />
      )}
      <ImageUploadOverlay />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload image"
      />
    </div>
  );
};
