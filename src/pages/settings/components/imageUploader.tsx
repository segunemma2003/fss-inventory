"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { UploadIcon } from "lucide-react";

export const ImageUploadOverlay: React.FC = () => {
  return (
    <div className="flex absolute bottom-0 left-2/4 gap-2.5 justify-center items-center px-2.5 py-1.5 bg-accent -translate-x-2/4 backdrop-blur-[2px] h-[65px] w-[380px] max-md:w-80 max-md:h-[60px] max-sm:px-2 max-sm:py-1 max-sm:h-[55px] max-sm:w-[280px]">
      <p className="text-sm font-bold leading-5 text-muted-foreground max-sm:text-xs">
        Upload Image
      </p>
      <UploadIcon className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
    </div>
  );
};

interface ImageUploaderProps {
  onImageUpload?: (file: File) => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  // className,
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
    <Card
      className="relative rounded-xl border border-solid border-neutral-400 h-[200px] w-[230px] max-md:h-[180px] max-md:w-[200px] max-sm:h-40 max-sm:w-[180px] cursor-pointer overflow-hidden py-0 mx-auto"
      onClick={handleClick}
    >
      {image && (
        <img
          src={image}
          alt="Uploaded preview"
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
    </Card>
  );
};
