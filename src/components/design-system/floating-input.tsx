"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  onStop?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  className?: string;
}

const MAX_HEIGHT = 240;

export function FloatingInput({
  value: controlledValue,
  onChange,
  onSubmit,
  onStop,
  isLoading = false,
  placeholder = "Ask anything…",
  autoFocus,
  inputRef,
  className,
}: FloatingInputProps) {
  // Works controlled (app) or uncontrolled (design-system showcase).
  const [localValue, setLocalValue] = useState("");
  const value = controlledValue ?? localValue;
  const setValue = onChange ?? setLocalValue;

  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? fallbackRef;
  const canSend = value.trim().length > 0 && !isLoading;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  }, [value, textareaRef]);

  const submit = () => {
    if (!canSend) return;
    onSubmit?.();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn(
        "group relative w-full rounded-2xl border border-paper-200 bg-white shadow-float transition-[border-color,box-shadow] duration-200",
        "focus-within:border-brand-light/60 focus-within:shadow-[0_0_0_4px_rgb(129_140_248/0.12),var(--shadow-float)]",
        className
      )}
    >
      <label htmlFor="chat-input" className="sr-only">
        Message
      </label>
      <textarea
        id="chat-input"
        ref={textareaRef}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={1}
        enterKeyHint="send"
        className="block w-full resize-none bg-transparent px-4 pb-14 pt-4 font-body text-[15.5px] leading-6 text-ink outline-none placeholder:text-ink-faint"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
          if (e.key === "Escape" && isLoading) onStop?.();
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-3">
        <span className="hidden pl-1 font-mono text-[11px] text-ink-faint sm:block">
          {isLoading ? (
            <>
              <kbd className="font-mono">Esc</kbd> to stop
            </>
          ) : (
            <>
              <kbd className="font-mono">Enter</kbd> to send ·{" "}
              <kbd className="font-mono">Shift + Enter</kbd> for a new line
            </>
          )}
        </span>
        <span className="sm:hidden" />

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating"
            title="Stop generating"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white shadow-sm transition-all hover:bg-brand-dark active:scale-95"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            title="Send message"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-sm transition-all hover:bg-brand-dark active:scale-95 disabled:bg-paper-200 disabled:text-ink-faint disabled:shadow-none"
          >
            <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </button>
        )}
      </div>
    </form>
  );
}
