"use client";

import { useCallback, useRef, useState } from "react";
import { Plus, Paperclip, Image, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileContent: (content: string, filename: string, type: string) => void;
  className?: string;
}

export default function FileUpload({ onFileContent, className }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          const description = `[uploaded image: ${file.name}, type: ${file.type}, size: ${(file.size / 1024).toFixed(1)}KB]`;
          setAttachedFile(file.name);
          onFileContent(description, file.name, "image");
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (content) {
            setAttachedFile(file.name);
            onFileContent(content, file.name, "text");
          }
        };
        reader.readAsText(file);
      }
    },
    [onFileContent]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = () => {
    setAttachedFile(null);
  };

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-9 h-9 rounded-full border border-border bg-bg-secondary/50 flex items-center justify-center text-text-secondary hover:text-accent-green hover:border-accent-green/30 hover:bg-accent-green/5 transition-all"
        title="attach file or image"
      >
        <Plus className="w-4 h-4" />
      </button>

      {attachedFile && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-tertiary border border-border text-xs text-text-secondary">
          <Paperclip className="w-3 h-3" />
          <span className="max-w-[150px] truncate">{attachedFile}</span>
          <button onClick={clearFile} className="text-text-muted hover:text-accent-red transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="*/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}