"use client";

import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle, Check, Copy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCopy } from "@/hooks/use-copy";
import { CodeBlock } from "./code-block";

interface MessageBubbleProps {
  children: React.ReactNode;
  className?: string;
}

const markdownComponents: Components = {
  h1: (props) => (
    <h1 className="mb-3 mt-6 font-serif text-2xl font-bold text-ink first:mt-0" {...props} />
  ),
  h2: (props) => (
    <h2 className="mb-3 mt-6 font-serif text-xl font-bold text-ink first:mt-0" {...props} />
  ),
  h3: (props) => (
    <h3 className="mb-2 mt-5 font-serif text-lg font-semibold text-ink first:mt-0" {...props} />
  ),
  h4: (props) => (
    <h4 className="mb-2 mt-4 text-base font-semibold text-ink first:mt-0" {...props} />
  ),
  p: (props) => <p className="mb-4 last:mb-0" {...props} />,
  ul: (props) => (
    <ul className="mb-4 list-disc space-y-1.5 pl-6 marker:text-brand-light last:mb-0" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 list-decimal space-y-1.5 pl-6 marker:font-mono marker:text-sm marker:text-ink-muted last:mb-0" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  code: ({ className, children, ...props }) => (
    <code
      className={cn(
        "rounded bg-paper-100 px-1.5 py-0.5 font-mono text-[0.85em] text-brand",
        className
      )}
      {...props}
    >
      {children}
    </code>
  ),
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-2 border-brand-light pl-4 italic text-ink-light"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-brand underline decoration-brand-light/50 underline-offset-2 transition-colors hover:decoration-brand"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  hr: () => <hr className="my-6 border-paper-200" />,
  table: (props) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-paper-200">
      <table className="min-w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-paper-100" {...props} />,
  th: (props) => (
    <th className="border-b border-paper-200 px-4 py-2 text-left font-semibold" {...props} />
  ),
  td: (props) => (
    <td className="border-b border-paper-200 px-4 py-2 [tr:last-child>&]:border-b-0" {...props} />
  ),
};

export const Markdown = memo(function Markdown({
  content,
  streaming,
}: {
  content: string;
  streaming?: boolean;
}) {
  return (
    <div
      className={cn(
        "font-body text-[15.5px] leading-[1.75] text-ink",
        streaming && "streaming-caret"
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
});

/** Assistant reply: unboxed, readable prose like a page in a journal. */
export function SystemMessage({ children, className }: MessageBubbleProps) {
  return (
    <div className={cn("min-w-0", className)}>
      {typeof children === "string" ? <Markdown content={children} /> : children}
    </div>
  );
}

export function UserMessage({ children, className }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-white shadow-paper",
        className
      )}
    >
      <div className="whitespace-pre-wrap break-words font-body text-[15px] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function ThinkingIndicator({ label = "Thinking" }: { label?: string }) {
  return (
    <div
      className="inline-flex items-center gap-3 py-2"
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-[bounce_1s_infinite] rounded-full bg-brand/60" />
        <span className="h-1.5 w-1.5 animate-[bounce_1s_infinite_150ms] rounded-full bg-brand/60" />
        <span className="h-1.5 w-1.5 animate-[bounce_1s_infinite_300ms] rounded-full bg-brand/60" />
      </div>
      <span className="font-mono text-xs tracking-wide text-ink-muted">{label}…</span>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-paper-100 hover:text-brand focus-visible:outline-2 focus-visible:outline-brand-light"
    >
      {children}
    </button>
  );
}

export function MessageActions({
  content,
  onRegenerate,
  className,
}: {
  content: string;
  onRegenerate?: () => void;
  className?: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <ActionButton label={copied ? "Copied" : "Copy"} onClick={() => copy(content)}>
        {copied ? (
          <Check className="h-4 w-4 text-science-dark" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </ActionButton>
      {onRegenerate && (
        <ActionButton label="Regenerate" onClick={onRegenerate}>
          <RotateCcw className="h-4 w-4" />
        </ActionButton>
      )}
    </div>
  );
}

export function MessageError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-800"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">
        <p className="font-medium">Something went wrong</p>
        <p className="mt-0.5 text-red-700/80">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-800 transition-colors hover:bg-red-100"
        >
          Try again
        </button>
      )}
    </div>
  );
}
