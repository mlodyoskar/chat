import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  children: React.ReactNode;
  className?: string;
}

export function SystemMessage({ children, className }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "bg-white border border-paper-200 p-6 rounded-r-xl rounded-bl-xl shadow-paper",
        className
      )}
    >
      <div className="text-ink leading-relaxed font-body prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Headings
            h1: ({ ...props }) => (
              <h1
                className="text-2xl font-bold text-ink mt-6 mb-4 first:mt-0"
                {...props}
              />
            ),
            h2: ({ ...props }) => (
              <h2
                className="text-xl font-bold text-ink mt-5 mb-3 first:mt-0"
                {...props}
              />
            ),
            h3: ({ ...props }) => (
              <h3
                className="text-lg font-semibold text-ink mt-4 mb-2 first:mt-0"
                {...props}
              />
            ),
            h4: ({ ...props }) => (
              <h4
                className="text-base font-semibold text-ink mt-3 mb-2 first:mt-0"
                {...props}
              />
            ),
            // Paragraphs
            p: ({ ...props }) => <p className="mb-4 last:mb-0" {...props} />,
            // Lists
            ul: ({ ...props }) => (
              <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol
                className="list-decimal list-inside mb-4 space-y-1"
                {...props}
              />
            ),
            li: ({ ...props }) => <li className="text-ink" {...props} />,
            // Code
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code
                  className="bg-paper-100 text-brand px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code
                  className={cn(
                    "block bg-paper-100 text-ink p-4 rounded-lg overflow-x-auto font-mono text-sm",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre: ({ ...props }) => (
              <pre className="mb-4 overflow-x-auto" {...props} />
            ),
            // Blockquotes
            blockquote: ({ ...props }) => (
              <blockquote
                className="border-l-4 border-brand pl-4 italic text-ink-light my-4"
                {...props}
              />
            ),
            // Links
            a: ({ ...props }) => (
              <a
                className="text-brand hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            // Strong/Bold
            strong: ({ ...props }) => (
              <strong className="font-bold text-ink" {...props} />
            ),
            // Em/Italic
            em: ({ ...props }) => <em className="italic" {...props} />,
            // Horizontal rule
            hr: ({ ...props }) => (
              <hr className="my-6 border-paper-200" {...props} />
            ),
            // Tables
            table: ({ ...props }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse" {...props} />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-paper-100" {...props} />
            ),
            th: ({ ...props }) => (
              <th
                className="border border-paper-200 px-4 py-2 text-left font-semibold"
                {...props}
              />
            ),
            td: ({ ...props }) => (
              <td className="border border-paper-200 px-4 py-2" {...props} />
            ),
          }}
        >
          {String(children)}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export function UserMessage({ children, className }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "bg-brand text-white p-6 rounded-l-xl rounded-br-xl shadow-sm",
        className
      )}
    >
      <div className="leading-relaxed font-body">{children}</div>
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <div className="bg-paper-100/50 border border-paper-200 p-4 rounded-xl inline-flex items-center gap-3 shadow-inner">
      <div className="flex gap-1.5">
        <span className="w-1.5 h-1.5 bg-brand/60 rounded-full animate-[bounce_1s_infinite]"></span>
        <span className="w-1.5 h-1.5 bg-brand/60 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
        <span className="w-1.5 h-1.5 bg-brand/60 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
      </div>
      <span className="font-mono text-xs font-medium text-ink-light tracking-wide uppercase animate-pulse">
        Processing Logic...
      </span>
    </div>
  );
}
