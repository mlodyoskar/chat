"use client";

import React from "react";
import { Check, Copy } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node))
    return extractText(node.props.children);
  return "";
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
  const { copied, copy } = useCopy();
  const child = React.Children.toArray(children)[0];
  const className = React.isValidElement<{ className?: string }>(child)
    ? child.props.className ?? ""
    : "";
  const language = /language-([\w-]+)/.exec(className)?.[1];
  const code = extractText(children).replace(/\n$/, "");

  return (
    <div className="group/code my-4 overflow-hidden rounded-lg border border-paper-200 bg-paper-100/70 first:mt-0 last:mb-0">
      <div className="flex items-center justify-between border-b border-paper-200 bg-white/60 px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
          {language ?? "code"}
        </span>
        <button
          type="button"
          onClick={() => copy(code)}
          className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[11px] text-ink-muted transition-colors hover:bg-paper-100 hover:text-brand focus-visible:outline-2 focus-visible:outline-brand-light"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-science-dark" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-ink [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit [&>code]:text-[13px]">
        {children}
      </pre>
    </div>
  );
}
