"use client";

import React, { useRef, useEffect, useState } from "react";
import { Send, Paperclip, Maximize2 } from "lucide-react";

interface FloatingInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function FloatingInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: FloatingInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMaxHeight, setIsMaxHeight] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get accurate scrollHeight
    textarea.style.height = "auto";

    const lineHeight = 24; // Approximate line height in pixels
    const maxLines = 5;
    const maxHeight = lineHeight * maxLines;

    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;

    // Check if we've reached max height
    setIsMaxHeight(textarea.scrollHeight > maxHeight);
  }, [value]);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleMakeBigger = () => {
    setIsExpanded(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = "200px";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        className="bg-white border border-paper-200 shadow-float rounded-lg flex items-start gap-2 p-2 transition-all duration-300 focus-within:shadow-drawer focus-within:border-brand/30 w-full"
      >
        <button
          type="button"
          className="p-3 text-ink-faint hover:text-brand hover:bg-paper-50 rounded-md transition-colors flex-shrink-0"
          disabled={isLoading}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your message..."
          className="flex-1 bg-transparent border-none outline-none text-ink placeholder-ink-faint font-body py-3 disabled:opacity-50 resize-none min-h-[24px] overflow-y-auto"
          disabled={isLoading}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e as unknown as React.FormEvent);
            }
          }}
        />

        <button
          type="submit"
          // disabled={!value.trim() || isLoading}
          className="bg-brand text-white p-3 rounded-md shadow-sm hover:bg-brand-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {isMaxHeight && !isExpanded && (
        <button
          onClick={handleMakeBigger}
          className="mt-2 text-xs text-ink-faint hover:text-brand transition-colors flex items-center gap-1 ml-auto"
        >
          <Maximize2 className="w-3 h-3" />
          Make bigger
        </button>
      )}
    </div>
  );
}
