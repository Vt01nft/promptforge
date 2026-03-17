"use client";

import { useCallback } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileContent: (content: string, filename: string) => void;
  accept?: string;
  label?: string;
  className?: string;
}

export default function FileUpload({
  onFileContent,
  accept = ".txt,.md,.json,.yaml,.yml,.xml,.csv,.log,.prompt,.html,.css,.js,.ts,.tsx,.jsx,.py,.rb,.go,.rs,.sh",
  label = "upload a file",
  className,
}: FileUploadProps) {
  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          onFileContent(content, file.name);
        }
      };
      reader.readAsText(file);
    },
    [onFileContent]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <label
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border bg-bg-secondary/30 cursor-pointer hover:border-accent-green/30 hover:bg-bg-tertiary/30 transition-all text-sm text-text-secondary",
        className
      )}
    >
      <Upload className="w-4 h-4" />
      <span>{label}</span>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}
